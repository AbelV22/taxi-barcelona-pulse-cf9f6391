import { getCurrentPosition, type LocationResult } from '@/services/native/geolocation';
import { supabase } from '@/integrations/supabase/client';
import { getOrCreateDeviceId } from '@/lib/deviceId';
import { Capacitor } from '@capacitor/core';

// Tracking state
let isTracking = false;
let trackingInterval: ReturnType<typeof setInterval> | null = null;
let lastZona: string | null = null;
let lastCheckTime = 0;

// Callback for UI updates
type ZoneCallback = (zona: string | null) => void;
let onZoneChange: ZoneCallback | null = null;

// Configuration
const CHECK_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
const MIN_CHECK_INTERVAL_MS = 30 * 1000; // 30 seconds minimum between checks

/**
 * Start automatic location tracking
 * Checks every 5 minutes and auto-registers when entering a zone
 */
export const startAutoTracking = (callback?: ZoneCallback): void => {
    if (isTracking) {
        console.log('[AutoLocation] Already tracking');
        return;
    }

    onZoneChange = callback || null;
    isTracking = true;

    console.log('[AutoLocation] Starting automatic tracking');

    // Initial check
    checkLocationAndRegister();

    // Set up interval
    trackingInterval = setInterval(() => {
        checkLocationAndRegister();
    }, CHECK_INTERVAL_MS);
};

/**
 * Stop automatic location tracking
 */
export const stopAutoTracking = (): void => {
    if (!isTracking) return;

    console.log('[AutoLocation] Stopping automatic tracking');

    if (trackingInterval) {
        clearInterval(trackingInterval);
        trackingInterval = null;
    }

    isTracking = false;
    lastZona = null;
    onZoneChange = null;
};

/**
 * Force an immediate location check
 */
export const forceLocationCheck = async (): Promise<string | null> => {
    const now = Date.now();
    if (now - lastCheckTime < MIN_CHECK_INTERVAL_MS) {
        console.log('[AutoLocation] Rate limited, skipping check');
        return lastZona;
    }

    return checkLocationAndRegister();
};

/**
 * Get current tracking status
 */
export const getTrackingStatus = () => ({
    isTracking,
    lastZona,
    lastCheckTime: lastCheckTime > 0 ? new Date(lastCheckTime).toISOString() : null,
});

/**
 * Internal: Check location and register with geofence
 */
const checkLocationAndRegister = async (): Promise<string | null> => {
    try {
        lastCheckTime = Date.now();

        console.log('[AutoLocation] Checking location...');

        // Get current position using Capacitor (works on Android + web)
        const position = await getCurrentPosition();

        if (!position) {
            console.warn('[AutoLocation] Could not get position');
            return null;
        }

        console.log(`[AutoLocation] Position: ${position.latitude.toFixed(5)}, ${position.longitude.toFixed(5)}`);

        const deviceId = getOrCreateDeviceId();

        // Call check-geofence to detect zone
        const { data, error } = await supabase.functions.invoke('check-geofence', {
            body: {
                lat: position.latitude,
                lng: position.longitude,
                action: 'register',
                deviceId
            }
        });

        if (error) {
            console.error('[AutoLocation] Geofence check error:', error);
            return lastZona;
        }

        const newZona = data?.success ? data.zona : null;

        // Detect zone changes
        if (newZona !== lastZona) {
            console.log(`[AutoLocation] Zone changed: ${lastZona || 'none'} → ${newZona || 'none'}`);

            // If we left a zone, register exit
            if (lastZona && !newZona) {
                await registerExit(deviceId, lastZona);
            }

            lastZona = newZona;
            onZoneChange?.(newZona);
        }

        return newZona;
    } catch (error) {
        console.error('[AutoLocation] Error:', error);
        return null;
    }
};

/**
 * Register exit from a zone
 */
const registerExit = async (deviceId: string, zona: string): Promise<void> => {
    try {
        console.log(`[AutoLocation] Registering exit from ${zona}`);

        // Update the most recent entry for this device in this zone
        const { error } = await supabase
            .from('registros_reten')
            .update({ exited_at: new Date().toISOString() } as any)
            .eq('device_id', deviceId)
            .eq('zona', zona)
            .is('exited_at', null)
            .order('created_at', { ascending: false })
            .limit(1);

        if (error) {
            console.error('[AutoLocation] Exit registration error:', error);
        }
    } catch (error) {
        console.error('[AutoLocation] Exit error:', error);
    }
};

/**
 * Check if running on a native platform
 */
export const isNative = (): boolean => {
    return Capacitor.isNativePlatform();
};
