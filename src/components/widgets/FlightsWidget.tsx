import { Plane, TrendingUp, TrendingDown, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Terminal {
  id: string;
  name: string;
  fullName: string;
  arrivals: number;
  trend: number;
  color: string;
  nextPeak: string;
}

// Mock data - later we'll fetch from AENA API
const terminals: Terminal[] = [
  { id: "t1", name: "T1", fullName: "Terminal 1", arrivals: 47, trend: 12, color: "bg-terminal-t1", nextPeak: "14:30" },
  { id: "t2", name: "T2", fullName: "Terminal 2", arrivals: 23, trend: -5, color: "bg-terminal-t2", nextPeak: "15:00" },
  { id: "puente", name: "Puente", fullName: "Puente Aéreo", arrivals: 18, trend: 0, color: "bg-terminal-puente", nextPeak: "13:45" },
  { id: "t2c", name: "T2C", fullName: "EasyJet Terminal", arrivals: 31, trend: 8, color: "bg-terminal-t2c", nextPeak: "16:15" },
];

const totalArrivals = terminals.reduce((sum, t) => sum + t.arrivals, 0);

interface FlightsWidgetProps {
  expanded?: boolean;
}

export function FlightsWidget({ expanded = false }: FlightsWidgetProps) {
  return (
    <div className="card-dashboard p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10">
            <Plane className="h-5 w-5 text-info" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-foreground">Vuelos BCN Hoy</h3>
            <p className="text-sm text-muted-foreground">Llegadas al aeropuerto</p>
          </div>
        </div>
        <div className="text-right">
          <p className="stat-value text-info">{totalArrivals}</p>
          <p className="text-xs text-muted-foreground">vuelos restantes</p>
        </div>
      </div>

      <div className={cn("grid gap-3", expanded ? "grid-cols-2" : "grid-cols-2 md:grid-cols-4")}>
        {terminals.map((terminal) => (
          <div 
            key={terminal.id}
            className="relative overflow-hidden rounded-xl p-4 bg-muted/50 border border-border hover:border-primary/30 transition-colors"
          >
            <div className={cn("absolute top-0 left-0 w-1 h-full", terminal.color)} />
            <div className="pl-2">
              <div className="flex items-center justify-between mb-2">
                <span className={cn(
                  "badge-terminal text-white",
                  terminal.color
                )}>
                  {terminal.name}
                </span>
                {terminal.trend !== 0 && (
                  <div className={cn(
                    "flex items-center gap-0.5 text-xs",
                    terminal.trend > 0 ? "text-success" : "text-destructive"
                  )}>
                    {terminal.trend > 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    <span>{Math.abs(terminal.trend)}%</span>
                  </div>
                )}
              </div>
              
              <p className="text-2xl font-bold font-display text-foreground mb-1">
                {terminal.arrivals}
              </p>
              <p className="text-xs text-muted-foreground">{terminal.fullName}</p>
              
              {expanded && (
                <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>Próx. pico: {terminal.nextPeak}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {!expanded && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Hora punta estimada</span>
            <span className="font-semibold text-foreground flex items-center gap-1">
              <Clock className="h-4 w-4 text-warning" />
              14:30 - 16:00
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
