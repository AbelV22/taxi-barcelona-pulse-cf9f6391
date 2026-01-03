import { Sparkles, TrendingUp, Clock } from "lucide-react";

export function HeroSection() {
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? "Buenos días" : currentHour < 20 ? "Buenas tardes" : "Buenas noches";
  
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-background to-accent/10 border border-primary/20 p-6 md:p-8 mb-6">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-info/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-5 w-5 text-primary animate-pulse" />
          <span className="text-xs md:text-sm font-medium text-primary uppercase tracking-wider">
            Tu copiloto profesional
          </span>
        </div>
        
        <h1 className="font-display text-2xl md:text-4xl font-bold text-foreground mb-2">
          {greeting}, <span className="text-primary">taxista</span>
        </h1>
        
        <p className="text-sm md:text-base text-muted-foreground max-w-lg mb-6">
          Toda la información que necesitas para optimizar tu jornada: vuelos en tiempo real, 
          eventos de la ciudad y tendencias de licencias.
        </p>
        
        <div className="flex flex-wrap gap-3 md:gap-4">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background/60 backdrop-blur border border-border">
            <TrendingUp className="h-4 w-4 text-success" />
            <span className="text-xs md:text-sm text-foreground">
              <span className="font-semibold text-success">+12%</span> demanda vs ayer
            </span>
          </div>
          
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background/60 backdrop-blur border border-border">
            <Clock className="h-4 w-4 text-info" />
            <span className="text-xs md:text-sm text-foreground">
              Hora punta: <span className="font-semibold text-info">14:30 - 16:00</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
