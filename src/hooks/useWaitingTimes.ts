import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface WaitingTimeData {
    zona: string;
    espera_minutos: number;
    taxistas_activos: number;
}

interface UseWaitingTimesResult {
    waitingTimes: Record<string, WaitingTimeData>;
    loading: boolean;
    error: Error | null;
    refresh: () => void;
}

const DEFAULT_WAITING_TIMES: Record<string, number> = {
    T1: 25,
    T2: 15,
    SANTS: 10,
    PUENTE_AEREO: 8,
    T2C_EASY: 12,
    // Map frontend names to backend names
    t1: 25,
    t2: 15,
    puente: 8,
    t2c: 12,
};

/**
 * Hook to fetch real waiting times from Supabase
 */
export const useWaitingTimes = (): UseWaitingTimesResult => {
    const [waitingTimes, setWaitingTimes] = useState<Record<string, WaitingTimeData>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchWaitingTimes = useCallback(async () => {
        try {
            // Fetch entries from last 2 hours to calculate waiting times
            const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();

            const { data: registros, error: fetchError } = await supabase
                .from('registros_reten')
                .select('zona, created_at, exited_at')
                .gte('created_at', twoHoursAgo)
                .order('created_at', { ascending: false });

            if (fetchError) throw fetchError;

            // Calculate stats per zone
            const zonas = ['T1', 'T2', 'SANTS', 'PUENTE_AEREO', 'T2C_EASY'];
            const stats: Record<string, WaitingTimeData> = {};

            for (const zona of zonas) {
                const zonaRegistros = (registros || []).filter(r => r.zona === zona);
                const activos = zonaRegistros.filter(r => !r.exited_at).length;

                // Calculate average waiting time from completed waits
                const completedWaits = zonaRegistros.filter(r => r.exited_at);
                let avgWait = DEFAULT_WAITING_TIMES[zona] || 20;

                if (completedWaits.length >= 2) {
                    const totalWait = completedWaits.reduce((acc, r) => {
                        const start = new Date(r.created_at).getTime();
                        const end = new Date(r.exited_at!).getTime();
                        return acc + (end - start) / 60000; // Convert to minutes
                    }, 0);
                    avgWait = Math.round(totalWait / completedWaits.length);
                }

                stats[zona] = {
                    zona,
                    espera_minutos: avgWait,
                    taxistas_activos: activos,
                };

                // Also map to lowercase names for compatibility
                const lowerMap: Record<string, string> = {
                    T1: 't1',
                    T2: 't2',
                    PUENTE_AEREO: 'puente',
                    T2C_EASY: 't2c',
                };
                if (lowerMap[zona]) {
                    stats[lowerMap[zona]] = stats[zona];
                }
            }

            setWaitingTimes(stats);
            setError(null);
        } catch (err) {
            console.error('[useWaitingTimes] Error:', err);
            setError(err instanceof Error ? err : new Error('Failed to fetch waiting times'));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchWaitingTimes();
        // Refresh every 2 minutes
        const interval = setInterval(fetchWaitingTimes, 2 * 60 * 1000);
        return () => clearInterval(interval);
    }, [fetchWaitingTimes]);

    return { waitingTimes, loading, error, refresh: fetchWaitingTimes };
};

/**
 * Get waiting time for a specific zone
 */
export const getZoneWaitingTime = (
    waitingTimes: Record<string, WaitingTimeData>,
    zona: string
): number => {
    return waitingTimes[zona]?.espera_minutos || DEFAULT_WAITING_TIMES[zona] || 20;
};

/**
 * Get active taxistas count for a zone
 */
export const getZoneTaxistasActivos = (
    waitingTimes: Record<string, WaitingTimeData>,
    zona: string
): number => {
    return waitingTimes[zona]?.taxistas_activos || 0;
};
