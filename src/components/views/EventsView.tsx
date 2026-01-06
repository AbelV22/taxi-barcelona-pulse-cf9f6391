import { useState, useMemo } from "react";
import { Calendar as CalendarIcon, MapPin, Users, Clock, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { useEvents } from "@/hooks/useEvents";

const typeColors: Record<string, string> = {
  Congress: "bg-info/20 text-info border border-info/30",
  Music: "bg-purple-500/20 text-purple-400 border border-purple-500/30",
  Sports: "bg-success/20 text-success border border-success/30",
  Culture: "bg-primary/20 text-primary border border-primary/30",
  Other: "bg-muted text-muted-foreground border border-border",
};

const typeLabels: Record<string, string> = {
  Congress: "Congreso",
  Music: "Música",
  Sports: "Deportes",
  Culture: "Cultura",
  Other: "Otro",
};

export function EventsView() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const { events, loading } = useEvents();

  // Parse dates from event.date string for calendar highlighting
  const eventDatesMap = useMemo(() => {
    const map = new Map<string, typeof events>();
    events.forEach(event => {
      // Extract date from formatted string - we need to get the original date
      // We'll use a simple approach: parse the formatted date
      const dateMatch = event.date.match(/(\d+) de (\w+)/);
      if (dateMatch) {
        const monthNames: Record<string, number> = {
          enero: 0, febrero: 1, marzo: 2, abril: 3, mayo: 4, junio: 5,
          julio: 6, agosto: 7, septiembre: 8, octubre: 9, noviembre: 10, diciembre: 11
        };
        const day = parseInt(dateMatch[1]);
        const month = monthNames[dateMatch[2].toLowerCase()];
        const year = new Date().getFullYear();
        const dateKey = new Date(year >= 2026 ? year : 2026, month, day).toDateString();
        
        if (!map.has(dateKey)) {
          map.set(dateKey, []);
        }
        map.get(dateKey)?.push(event);
      }
    });
    return map;
  }, [events]);

  const eventDates = useMemo(() => {
    return Array.from(eventDatesMap.keys()).map(dateStr => new Date(dateStr));
  }, [eventDatesMap]);

  const selectedDayEvents = useMemo(() => {
    if (!selectedDate) return [];
    return eventDatesMap.get(selectedDate.toDateString()) || [];
  }, [selectedDate, eventDatesMap]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-muted rounded" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-48 bg-muted rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Featured Events Grid */}
      <div>
        <h2 className="font-display text-xl font-semibold text-foreground mb-4">
          Próximos Eventos ({events.length} programados)
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {events.slice(0, 6).map((event) => (
            <div 
              key={event.id} 
              className="card-dashboard-hover p-4 md:p-5 cursor-pointer group"
              onClick={() => window.open(event.url_ticket, "_blank")}
            >
              <div className="flex items-start justify-between mb-3">
                <Badge className={typeColors[event.type]}>
                  {typeLabels[event.type] || event.categoria}
                </Badge>
                <div className="flex items-center gap-1 text-primary">
                  <Users className="h-4 w-4" />
                  <span className="font-medium text-sm">{event.attendees.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-foreground mb-3 text-sm md:text-base line-clamp-2">{event.title}</h3>
                <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
              </div>
              
              <div className="space-y-1.5 md:space-y-2 text-xs md:text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                  <span className="truncate">{event.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                  <span>{event.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Calendar Section */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card-dashboard p-4 md:p-6">
          <h3 className="font-display text-lg font-semibold text-foreground mb-4">Calendario de Eventos</h3>
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md"
              modifiers={{
                event: eventDates
              }}
              modifiersStyles={{
                event: {
                  backgroundColor: 'hsl(42, 100%, 50%)',
                  color: 'hsl(220, 25%, 6%)',
                  fontWeight: 'bold',
                  borderRadius: '50%'
                }
              }}
            />
          </div>
        </div>

        {/* Selected Day Events */}
        <div className="card-dashboard p-4 md:p-6">
          <h3 className="font-display text-lg font-semibold text-foreground mb-4">
            {selectedDate?.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
          </h3>
          
          {selectedDayEvents.length > 0 ? (
            <div className="space-y-3">
              {selectedDayEvents.map(event => (
                <div 
                  key={event.id} 
                  className="p-3 rounded-lg bg-accent/30 border border-border cursor-pointer hover:border-primary/30 transition-colors"
                  onClick={() => window.open(event.url_ticket, "_blank")}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={cn(typeColors[event.type])}>
                      {typeLabels[event.type] || event.categoria}
                    </Badge>
                    <ExternalLink className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <h4 className="font-medium text-foreground text-sm line-clamp-2">{event.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{event.location} - {event.time}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No hay eventos programados para este día.</p>
          )}
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="card-dashboard p-4 md:p-6 min-h-[250px] md:min-h-[300px] relative overflow-hidden">
        <h3 className="font-display text-lg font-semibold text-foreground mb-4">Mapa de Eventos</h3>
        <div className="absolute inset-0 top-14 flex items-center justify-center">
          {/* Decorative dots for map effect */}
          <div className="absolute top-16 left-1/4 w-2 h-2 bg-primary rounded-full animate-pulse" />
          <div className="absolute top-24 left-1/3 w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: "0.5s" }} />
          <div className="absolute top-32 right-1/3 w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute bottom-24 left-1/2 w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: "1.5s" }} />
          <div className="absolute bottom-32 right-1/4 w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: "2s" }} />
          
          {/* Center marker */}
          <div className="relative">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center border-2 border-primary">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <div className="text-center mt-4">
              <p className="text-foreground font-medium">Mapa interactivo de Barcelona</p>
              <p className="text-sm text-muted-foreground">Próximamente con ubicación en tiempo real</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
