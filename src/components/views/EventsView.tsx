import { useState } from "react";
import { Calendar, MapPin, Users, ChevronLeft, ChevronRight, List, Grid, Map } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CalendarEvent {
  id: string;
  title: string;
  location: string;
  date: Date;
  time: string;
  attendees: string;
  type: "concert" | "sports" | "conference" | "festival" | "other";
  impact: "high" | "medium" | "low";
  coordinates?: { lat: number; lng: number };
}

const events: CalendarEvent[] = [
  {
    id: "1",
    title: "FC Barcelona vs Real Madrid",
    location: "Camp Nou",
    date: new Date(2026, 0, 3),
    time: "21:00",
    attendees: "99.000",
    type: "sports",
    impact: "high",
    coordinates: { lat: 41.3809, lng: 2.1228 }
  },
  {
    id: "2",
    title: "Coldplay - Music of the Spheres",
    location: "Estadi Olímpic",
    date: new Date(2026, 0, 4),
    time: "20:30",
    attendees: "55.000",
    type: "concert",
    impact: "high",
    coordinates: { lat: 41.3647, lng: 2.1555 }
  },
  {
    id: "3",
    title: "Mobile World Congress",
    location: "Fira Gran Via",
    date: new Date(2026, 0, 5),
    time: "09:00",
    attendees: "25.000",
    type: "conference",
    impact: "medium",
    coordinates: { lat: 41.3545, lng: 2.1274 }
  },
  {
    id: "4",
    title: "Mercat de Sant Antoni",
    location: "Sant Antoni",
    date: new Date(2026, 0, 5),
    time: "08:00",
    attendees: "5.000",
    type: "other",
    impact: "low",
    coordinates: { lat: 41.3774, lng: 2.1615 }
  },
  {
    id: "5",
    title: "Bad Bunny Concert",
    location: "Palau Sant Jordi",
    date: new Date(2026, 0, 10),
    time: "21:00",
    attendees: "18.000",
    type: "concert",
    impact: "high",
    coordinates: { lat: 41.3642, lng: 2.1528 }
  },
];

const typeColors = {
  concert: "bg-purple-500",
  sports: "bg-green-500",
  conference: "bg-blue-500",
  festival: "bg-orange-500",
  other: "bg-gray-500"
};

const impactBadgeColors = {
  high: "bg-destructive text-destructive-foreground",
  medium: "bg-warning text-warning-foreground",
  low: "bg-muted text-muted-foreground"
};

const daysOfWeek = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

export function EventsView() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1));
  const [view, setView] = useState<"month" | "week" | "map">("month");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const startingDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7; // Monday = 0
  const daysInMonth = lastDayOfMonth.getDate();

  const days = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  const getEventsForDay = (day: number) => {
    return events.filter(event => 
      event.date.getDate() === day && 
      event.date.getMonth() === month &&
      event.date.getFullYear() === year
    );
  };

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const monthName = currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="font-display text-xl font-bold capitalize">{monthName}</h2>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant={view === "month" ? "default" : "outline"} 
            size="sm"
            onClick={() => setView("month")}
          >
            <Grid className="h-4 w-4 mr-2" />
            Mes
          </Button>
          <Button 
            variant={view === "week" ? "default" : "outline"} 
            size="sm"
            onClick={() => setView("week")}
          >
            <List className="h-4 w-4 mr-2" />
            Semana
          </Button>
          <Button 
            variant={view === "map" ? "default" : "outline"} 
            size="sm"
            onClick={() => setView("map")}
          >
            <Map className="h-4 w-4 mr-2" />
            Mapa
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4">
        {Object.entries(typeColors).map(([type, color]) => (
          <div key={type} className="flex items-center gap-2">
            <div className={cn("w-3 h-3 rounded-full", color)} />
            <span className="text-sm text-muted-foreground capitalize">{type === "other" ? "Otros" : type}</span>
          </div>
        ))}
      </div>

      {view === "month" && (
        <div className="card-dashboard p-5">
          {/* Days header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {daysOfWeek.map(day => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, idx) => {
              const dayEvents = day ? getEventsForDay(day) : [];
              const isToday = day === 3; // Mock "today"

              return (
                <div
                  key={idx}
                  className={cn(
                    "min-h-24 p-2 rounded-lg border border-transparent transition-colors",
                    day && "hover:border-primary/30 cursor-pointer",
                    day && "bg-muted/30",
                    isToday && "bg-primary/10 border-primary/30"
                  )}
                >
                  {day && (
                    <>
                      <span className={cn(
                        "text-sm font-medium",
                        isToday ? "text-primary" : "text-foreground"
                      )}>
                        {day}
                      </span>
                      <div className="mt-1 space-y-1">
                        {dayEvents.slice(0, 2).map(event => (
                          <div 
                            key={event.id}
                            className={cn(
                              "text-xs px-1.5 py-0.5 rounded truncate text-white",
                              typeColors[event.type]
                            )}
                          >
                            {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <span className="text-xs text-muted-foreground">
                            +{dayEvents.length - 2} más
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {view === "week" && (
        <div className="space-y-4">
          {events.slice(0, 5).map(event => (
            <div key={event.id} className="card-dashboard p-4 flex items-center gap-4">
              <div className={cn("w-1 h-16 rounded-full", typeColors[event.type])} />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-foreground">{event.title}</h3>
                  <Badge className={impactBadgeColors[event.impact]}>
                    {event.impact === "high" ? "Alto impacto" : event.impact === "medium" ? "Medio" : "Bajo"}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {event.date.toLocaleDateString('es-ES')} - {event.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {event.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {event.attendees}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {view === "map" && (
        <div className="card-dashboard p-5">
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Map className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">
                Mapa de eventos próximamente
              </p>
              <p className="text-sm text-muted-foreground">
                Integración con Mapbox pendiente
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
