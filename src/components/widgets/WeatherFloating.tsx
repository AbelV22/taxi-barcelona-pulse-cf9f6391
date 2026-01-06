import { useState } from "react";
import { Cloud, CloudRain, Sun, Droplets, Wind, X, ExternalLink, CloudFog, CloudSnow } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWeather } from "@/hooks/useWeather";

const getWeatherIcon = (code: number, className: string) => {
  if (code === 0) return <Sun className={className} />;
  if (code <= 3) return <Cloud className={className} />;
  if (code <= 48) return <CloudFog className={className} />;
  if (code <= 77) return <CloudRain className={className} />;
  if (code <= 86) return <CloudSnow className={className} />;
  return <CloudRain className={className} />;
};

const openWeatherPage = () => {
  window.open("https://www.eltiempo.es/barcelona.html", "_blank");
};

export function WeatherFloating() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { weather, loading, isRainAlert } = useWeather();

  if (loading || !weather) {
    return (
      <div className="fixed top-2 right-2 z-50 md:top-4 md:right-4">
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-background/80 border border-border animate-pulse">
          <div className="h-4 w-4 bg-muted rounded" />
          <div className="h-4 w-8 bg-muted rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-2 right-2 z-50 md:top-4 md:right-4">
      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          className={cn(
            "flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium shadow-lg backdrop-blur-md transition-all hover:scale-105",
            isRainAlert 
              ? "bg-rain/20 text-rain border border-rain/30 animate-pulse" 
              : "bg-background/80 text-foreground border border-border"
          )}
        >
          {getWeatherIcon(weather.weatherCode, "h-4 w-4")}
          <span className="font-display">{weather.temp}°</span>
          {isRainAlert && <span>{weather.rainProbability}%</span>}
        </button>
      ) : (
        <div className="bg-background/95 backdrop-blur-md rounded-xl border border-border shadow-xl p-3 min-w-[180px] animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {getWeatherIcon(weather.weatherCode, cn("h-5 w-5", isRainAlert ? "text-rain" : "text-primary"))}
              <span className="font-display font-bold text-lg">{weather.temp}°C</span>
            </div>
            <button 
              onClick={() => setIsExpanded(false)}
              className="p-1 hover:bg-muted rounded-full"
            >
              <X className="h-3 w-3 text-muted-foreground" />
            </button>
          </div>
          
          <p className="text-xs text-muted-foreground capitalize mb-2">{weather.condition}</p>
          
          <div className="space-y-1 mb-3">
            <div className={cn(
              "flex items-center justify-between text-xs p-1.5 rounded-lg",
              isRainAlert ? "bg-rain/10 text-rain" : "bg-muted"
            )}>
              <div className="flex items-center gap-1">
                <Droplets className="h-3 w-3" />
                <span>Lluvia</span>
              </div>
              <span className="font-display font-bold">{weather.rainProbability}%</span>
            </div>
            <div className="flex items-center justify-between text-xs p-1.5 rounded-lg bg-muted">
              <div className="flex items-center gap-1">
                <Wind className="h-3 w-3" />
                <span>Viento</span>
              </div>
              <span className="font-display font-medium">{weather.wind} km/h</span>
            </div>
            <div className="flex items-center justify-between text-xs p-1.5 rounded-lg bg-muted">
              <div className="flex items-center gap-1">
                <Droplets className="h-3 w-3" />
                <span>Humedad</span>
              </div>
              <span className="font-display font-medium">{weather.humidity}%</span>
            </div>
          </div>
          
          <button
            onClick={openWeatherPage}
            className="w-full flex items-center justify-center gap-1.5 text-xs py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            <span>Ver pronóstico completo</span>
            <ExternalLink className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  );
}
