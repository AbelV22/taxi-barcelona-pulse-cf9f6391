import { useState } from "react";
import { Bell, BellOff, CloudRain, Plane, Calendar, TrendingDown, Check, X, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

interface Alert {
  id: string;
  type: "rain" | "flights" | "events" | "license";
  title: string;
  message: string;
  time: string;
  read: boolean;
  priority: "high" | "medium" | "low";
}

const alerts: Alert[] = [
  {
    id: "1",
    type: "rain",
    title: "Alerta de lluvia",
    message: "75% probabilidad de lluvia entre las 16:00 y 20:00. Espera mayor demanda.",
    time: "Hace 10 min",
    read: false,
    priority: "high"
  },
  {
    id: "2",
    type: "events",
    title: "Evento de alto impacto",
    message: "FC Barcelona vs Real Madrid esta noche a las 21:00 en Camp Nou. 99.000 asistentes.",
    time: "Hace 1 hora",
    read: false,
    priority: "high"
  },
  {
    id: "3",
    type: "flights",
    title: "Pico de llegadas",
    message: "15 vuelos llegando entre 14:00-15:00. Terminal T1 con mayor afluencia.",
    time: "Hace 2 horas",
    read: true,
    priority: "medium"
  },
  {
    id: "4",
    type: "license",
    title: "Nuevo anuncio de licencia",
    message: "Nueva licencia detectada en Wallapop: 145.000€ (sin coche). Precio por debajo de la mediana.",
    time: "Hace 3 horas",
    read: true,
    priority: "low"
  },
];

const alertTypeIcons = {
  rain: CloudRain,
  flights: Plane,
  events: Calendar,
  license: TrendingDown
};

const alertTypeColors = {
  rain: "bg-rain text-rain-foreground",
  flights: "bg-info text-info-foreground",
  events: "bg-purple-500 text-white",
  license: "bg-primary text-primary-foreground"
};

const priorityColors = {
  high: "bg-destructive/10 border-destructive/30",
  medium: "bg-warning/10 border-warning/30",
  low: "bg-muted border-border"
};

interface AlertPreference {
  type: string;
  label: string;
  enabled: boolean;
  icon: React.ElementType;
}

const alertPreferences: AlertPreference[] = [
  { type: "rain", label: "Alertas de lluvia", enabled: true, icon: CloudRain },
  { type: "flights", label: "Picos de vuelos", enabled: true, icon: Plane },
  { type: "events", label: "Eventos importantes", enabled: true, icon: Calendar },
  { type: "license", label: "Nuevas licencias", enabled: false, icon: TrendingDown },
];

export function AlertsView() {
  const [preferences, setPreferences] = useState(alertPreferences);
  const [localAlerts, setLocalAlerts] = useState(alerts);

  const togglePreference = (type: string) => {
    setPreferences(prev => prev.map(p => 
      p.type === type ? { ...p, enabled: !p.enabled } : p
    ));
  };

  const markAsRead = (id: string) => {
    setLocalAlerts(prev => prev.map(a => 
      a.id === id ? { ...a, read: true } : a
    ));
  };

  const dismissAlert = (id: string) => {
    setLocalAlerts(prev => prev.filter(a => a.id !== id));
  };

  const unreadCount = localAlerts.filter(a => !a.read).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Bell className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold">Centro de Alertas</h2>
            <p className="text-sm text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount} alertas sin leer` : "Todas las alertas leídas"}
            </p>
          </div>
        </div>
        <Button variant="outline" className="gap-2">
          <Settings className="h-4 w-4" />
          Configurar
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Alerts list */}
        <div className="lg:col-span-2 space-y-4">
          {localAlerts.length === 0 ? (
            <div className="card-dashboard p-8 text-center">
              <BellOff className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No hay alertas</p>
            </div>
          ) : (
            localAlerts.map((alert) => {
              const Icon = alertTypeIcons[alert.type];
              return (
                <div 
                  key={alert.id}
                  className={cn(
                    "card-dashboard p-4 border-l-4 transition-all",
                    priorityColors[alert.priority],
                    !alert.read && "shadow-md"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-lg flex-shrink-0",
                      alertTypeColors[alert.type]
                    )}>
                      <Icon className="h-5 w-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={cn(
                          "font-semibold",
                          !alert.read && "text-foreground",
                          alert.read && "text-muted-foreground"
                        )}>
                          {alert.title}
                        </h3>
                        {!alert.read && (
                          <Badge className="bg-primary text-primary-foreground text-xs">
                            Nueva
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {alert.message}
                      </p>
                      <p className="text-xs text-muted-foreground">{alert.time}</p>
                    </div>

                    <div className="flex items-center gap-1">
                      {!alert.read && (
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => markAsRead(alert.id)}
                          className="h-8 w-8"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => dismissAlert(alert.id)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Preferences */}
        <div className="card-dashboard p-5 h-fit">
          <h3 className="font-display font-semibold text-foreground mb-4">Preferencias</h3>
          <div className="space-y-4">
            {preferences.map((pref) => (
              <div key={pref.type} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <pref.icon className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">{pref.label}</span>
                </div>
                <Switch 
                  checked={pref.enabled}
                  onCheckedChange={() => togglePreference(pref.type)}
                />
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-border">
            <h4 className="text-sm font-medium mb-2">Notificaciones</h4>
            <p className="text-xs text-muted-foreground mb-3">
              Activa las notificaciones push para recibir alertas en tiempo real.
            </p>
            <Button variant="outline" size="sm" className="w-full gap-2">
              <Bell className="h-4 w-4" />
              Activar notificaciones
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
