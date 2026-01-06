import { Cloud, CloudRain, Sun, Droplets, Wind, ExternalLink, CloudSnow, CloudFog } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWeather } from "@/hooks/useWeather";

interface WeatherWidgetProps {
  compact?: boolean;
}

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

export function WeatherWidget({ compact = false }: WeatherWidgetProps) {
  const { weather, loading, isRainAlert } = useWeather();

  if (loading || !weather) {
    if (compact) {
      return (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted animate-pulse">
          <div className="h-4 w-4 bg-muted-foreground/20 rounded" />
          <div className="h-4 w-12 bg-muted-foreground/20 rounded" />
        </div>
      );
    }
    return (
      <div className="card-dashboard p-4 md:p-5 animate-pulse">
        <div className="h-6 w-32 bg-muted rounded mb-4" />
        <div className="h-12 w-24 bg-muted rounded" />
      </div>
    );
  }

  if (compact) {
    return (
      <button
        onClick={openWeatherPage}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all hover:scale-105 cursor-pointer",
          isRainAlert ? "bg-rain/10 text-rain border border-rain/20" : "bg-muted hover:bg-muted/80"
        )}
      >
        {isRainAlert ? (
          <>
            <CloudRain className="h-4 w-4 animate-pulse" />
            <span className="text-sm font-medium">{weather.rainProbability}% lluvia</span>
          </>
        ) : (
          <>
            {getWeatherIcon(weather.weatherCode, "h-4 w-4 text-primary")}
            <span className="text-sm font-medium text-foreground">{weather.temp}°C</span>
          </>
        )}
        <ExternalLink className="h-3 w-3 opacity-50" />
      </button>
    );
  }

  return (
    <div 
      className="card-dashboard p-4 md:p-5 cursor-pointer hover:border-primary/30 transition-colors"
      onClick={openWeatherPage}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-display font-semibold text-foreground text-sm md:text-base">Tiempo en Barcelona</h3>
          <ExternalLink className="h-3 w-3 text-muted-foreground" />
        </div>
        {isRainAlert && (
          <div className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 md:py-1.5 rounded-lg bg-rain/10 text-rain text-xs md:text-sm border border-rain/20">
            <CloudRain className="h-3 w-3 md:h-4 md:w-4 animate-pulse" />
            <span>Alerta lluvia</span>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 md:gap-6 mb-4 md:mb-6">
        <div className="flex items-center gap-3">
          {getWeatherIcon(weather.weatherCode, cn(
            "h-10 w-10 md:h-12 md:w-12",
            isRainAlert ? "text-rain" : "text-primary"
          ))}
          <div>
            <p className="text-3xl md:text-4xl font-bold font-display text-foreground">{weather.temp}°C</p>
            <p className="text-xs md:text-sm text-muted-foreground">{weather.condition}</p>
          </div>
        </div>

        <div className="flex gap-4 text-xs md:text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Droplets className="h-3 w-3 md:h-4 md:w-4 text-rain" />
            <span>{weather.humidity}%</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Wind className="h-3 w-3 md:h-4 md:w-4" />
            <span>{weather.wind} km/h</span>
          </div>
        </div>
      </div>

      {/* Rain probability bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs md:text-sm mb-1.5">
          <span className="text-muted-foreground">Probabilidad de lluvia</span>
          <span className={cn("font-semibold", isRainAlert ? "text-rain" : "text-foreground")}>
            {weather.rainProbability}%
          </span>
        </div>
        <div className="h-1.5 md:h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className={cn(
              "h-full rounded-full transition-all duration-500",
              isRainAlert ? "bg-rain" : "bg-info"
            )}
            style={{ width: `${weather.rainProbability}%` }}
          />
        </div>
      </div>

      {/* Hourly forecast */}
      {weather.forecast.length > 0 && (
        <div className="grid grid-cols-4 gap-1.5 md:gap-2">
          {weather.forecast.map((hour) => (
            <div key={hour.hour} className="text-center p-2 md:p-3 rounded-lg bg-muted border border-border">
              <p className="text-xs text-muted-foreground mb-1">{hour.hour}</p>
              <p className="text-xs md:text-sm font-medium text-foreground">{hour.temp}°</p>
              <div className="flex items-center justify-center gap-0.5 md:gap-1 mt-1">
                <Droplets className="h-2.5 w-2.5 md:h-3 md:w-3 text-rain" />
                <span className="text-xs text-rain">{hour.rain}%</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
