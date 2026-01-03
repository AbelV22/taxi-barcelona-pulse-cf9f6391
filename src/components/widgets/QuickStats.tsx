import { Plane, Calendar, TrendingUp, CloudRain } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCard {
  label: string;
  value: string;
  subtext: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

const stats: StatCard[] = [
  {
    label: "Vuelos Hoy",
    value: "119",
    subtext: "llegadas pendientes",
    icon: Plane,
    color: "text-info",
    bgColor: "bg-info/10"
  },
  {
    label: "Eventos",
    value: "4",
    subtext: "esta semana",
    icon: Calendar,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10"
  },
  {
    label: "Licencia",
    value: "152k€",
    subtext: "mediana actual",
    icon: TrendingUp,
    color: "text-primary",
    bgColor: "bg-primary/10"
  },
  {
    label: "Lluvia",
    value: "75%",
    subtext: "probabilidad hoy",
    icon: CloudRain,
    color: "text-rain",
    bgColor: "bg-rain/10"
  },
];

export function QuickStats() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div 
          key={stat.label}
          className="card-dashboard p-4 hover:scale-[1.02] transition-transform duration-200"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
              <p className={cn("stat-value", stat.color)}>{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.subtext}</p>
            </div>
            <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", stat.bgColor)}>
              <stat.icon className={cn("h-5 w-5", stat.color)} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
