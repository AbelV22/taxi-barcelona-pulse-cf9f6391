import { Bell, CloudRain, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WeatherWidget } from "@/components/widgets/WeatherWidget";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const currentDate = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 backdrop-blur px-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">{title}</h1>
        <p className="text-sm text-muted-foreground capitalize">{currentDate}</p>
      </div>

      <div className="flex items-center gap-4">
        <WeatherWidget compact />
        
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
            3
          </span>
        </Button>

        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary">
            <User className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium">Juan García</p>
            <p className="text-xs text-muted-foreground">Licencia #4521</p>
          </div>
        </div>
      </div>
    </header>
  );
}
