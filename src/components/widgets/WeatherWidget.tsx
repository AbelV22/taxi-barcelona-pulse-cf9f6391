import { Cloud, CloudRain, Sun, Droplets, Wind, Thermometer } from "lucide-react";
import { cn } from "@/lib/utils";

interface WeatherWidgetProps {
  compact?: boolean;
}

// Mock weather data - later we'll fetch from API
const weatherData = {
  temp: 18,
  condition: "cloudy",
  rainProbability: 75,
  humidity: 68,
  wind: 15,
  forecast: [
    { hour: "14:00", temp: 18, rain: 30 },
    { hour: "16:00", temp: 17, rain: 65 },
    { hour: "18:00", temp: 16, rain: 80 },
    { hour: "20:00", temp: 15, rain: 45 },
  ]
};

const isRainAlert = weatherData.rainProbability >= 60;

export function WeatherWidget({ compact = false }: WeatherWidgetProps) {
  if (compact) {
    return (
      <div className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-lg",
        isRainAlert ? "bg-rain/10 text-rain" : "bg-muted"
      )}>
        {isRainAlert ? (
          <>
            <CloudRain className="h-4 w-4 animate-pulse" />
            <span className="text-sm font-medium">{weatherData.rainProbability}% lluvia</span>
          </>
        ) : (
          <>
            <Sun className="h-4 w-4 text-warning" />
            <span className="text-sm font-medium">{weatherData.temp}°C</span>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="card-dashboard p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-foreground">Tiempo en Barcelona</h3>
        {isRainAlert && (
          <div className="rain-alert text-sm">
            <CloudRain className="h-4 w-4" />
            <span>Alerta de lluvia</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-6 mb-6">
        <div className="flex items-center gap-3">
          {isRainAlert ? (
            <CloudRain className="h-12 w-12 text-rain" />
          ) : (
            <Cloud className="h-12 w-12 text-muted-foreground" />
          )}
          <div>
            <p className="stat-value text-foreground">{weatherData.temp}°C</p>
            <p className="text-sm text-muted-foreground">Nublado</p>
          </div>
        </div>

        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Droplets className="h-4 w-4 text-rain" />
            <span>{weatherData.humidity}%</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Wind className="h-4 w-4" />
            <span>{weatherData.wind} km/h</span>
          </div>
        </div>
      </div>

      {/* Rain probability bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1.5">
          <span className="text-muted-foreground">Probabilidad de lluvia</span>
          <span className={cn("font-semibold", isRainAlert ? "text-rain" : "text-foreground")}>
            {weatherData.rainProbability}%
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className={cn(
              "h-full rounded-full transition-all duration-500",
              isRainAlert ? "bg-rain" : "bg-info"
            )}
            style={{ width: `${weatherData.rainProbability}%` }}
          />
        </div>
      </div>

      {/* Hourly forecast */}
      <div className="grid grid-cols-4 gap-2">
        {weatherData.forecast.map((hour) => (
          <div key={hour.hour} className="text-center p-2 rounded-lg bg-muted/50">
            <p className="text-xs text-muted-foreground mb-1">{hour.hour}</p>
            <p className="text-sm font-medium">{hour.temp}°</p>
            <div className="flex items-center justify-center gap-1 mt-1">
              <Droplets className="h-3 w-3 text-rain" />
              <span className="text-xs text-rain">{hour.rain}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
