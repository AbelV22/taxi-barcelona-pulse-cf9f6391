import { Calendar, MapPin, Users, Clock, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface Event {
  id: string;
  title: string;
  location: string;
  date: string;
  time: string;
  attendees: string;
  type: "concert" | "sports" | "conference" | "festival" | "other";
  impact: "high" | "medium" | "low";
}

// Mock events data
const upcomingEvents: Event[] = [
  {
    id: "1",
    title: "FC Barcelona vs Real Madrid",
    location: "Camp Nou",
    date: "Hoy",
    time: "21:00",
    attendees: "99.000",
    type: "sports",
    impact: "high"
  },
  {
    id: "2",
    title: "Coldplay - Music of the Spheres",
    location: "Estadi Olímpic",
    date: "Mañana",
    time: "20:30",
    attendees: "55.000",
    type: "concert",
    impact: "high"
  },
  {
    id: "3",
    title: "Mobile World Congress",
    location: "Fira Gran Via",
    date: "05/01",
    time: "09:00",
    attendees: "25.000",
    type: "conference",
    impact: "medium"
  },
  {
    id: "4",
    title: "Mercat de Sant Antoni",
    location: "Sant Antoni",
    date: "Domingo",
    time: "08:00",
    attendees: "5.000",
    type: "other",
    impact: "low"
  },
];

const typeColors = {
  concert: "bg-purple-500",
  sports: "bg-green-500",
  conference: "bg-blue-500",
  festival: "bg-orange-500",
  other: "bg-gray-500"
};

const impactColors = {
  high: "bg-destructive text-destructive-foreground",
  medium: "bg-warning text-warning-foreground",
  low: "bg-muted text-muted-foreground"
};

interface EventsWidgetProps {
  expanded?: boolean;
  limit?: number;
}

export function EventsWidget({ expanded = false, limit = 3 }: EventsWidgetProps) {
  const displayEvents = expanded ? upcomingEvents : upcomingEvents.slice(0, limit);

  return (
    <div className="card-dashboard p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
            <Calendar className="h-5 w-5 text-purple-500" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-foreground">Eventos Barcelona</h3>
            <p className="text-sm text-muted-foreground">Próximos eventos de alto tráfico</p>
          </div>
        </div>
        {!expanded && (
          <button className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors">
            Ver todos
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="space-y-3">
        {displayEvents.map((event) => (
          <div 
            key={event.id}
            className="relative flex gap-4 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group"
          >
            {/* Type indicator */}
            <div className={cn(
              "absolute left-0 top-0 bottom-0 w-1 rounded-l-xl",
              typeColors[event.type]
            )} />

            {/* Date badge */}
            <div className="flex flex-col items-center justify-center min-w-[50px] pl-2">
              <span className="text-xs text-muted-foreground uppercase">{event.date}</span>
              <span className="text-lg font-bold font-display text-foreground">{event.time.split(':')[0]}</span>
              <span className="text-xs text-muted-foreground">:{event.time.split(':')[1]}</span>
            </div>

            {/* Event details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                  {event.title}
                </h4>
                <Badge variant="secondary" className={cn("shrink-0 text-xs", impactColors[event.impact])}>
                  {event.impact === "high" ? "Alto" : event.impact === "medium" ? "Medio" : "Bajo"}
                </Badge>
              </div>
              
              <div className="flex items-center gap-4 mt-1.5 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {event.location}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  {event.attendees}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!expanded && upcomingEvents.length > limit && (
        <p className="text-center text-sm text-muted-foreground mt-3">
          +{upcomingEvents.length - limit} eventos más esta semana
        </p>
      )}
    </div>
  );
}
