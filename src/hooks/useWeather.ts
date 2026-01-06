import { useState, useEffect } from "react";

interface WeatherData {
  temp: number;
  humidity: number;
  wind: number;
  rainProbability: number;
  weatherCode: number;
  condition: string;
  forecast: Array<{
    hour: string;
    temp: number;
    rain: number;
  }>;
}

const getConditionFromCode = (code: number): string => {
  if (code === 0) return "Despejado";
  if (code <= 3) return "Parcialmente nublado";
  if (code <= 48) return "Niebla";
  if (code <= 57) return "Llovizna";
  if (code <= 67) return "Lluvia";
  if (code <= 77) return "Nieve";
  if (code <= 82) return "Chubascos";
  if (code <= 86) return "Nieve fuerte";
  if (code <= 99) return "Tormenta";
  return "Desconocido";
};

const isRainyCode = (code: number): boolean => {
  return code >= 51 && code <= 99;
};

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Barcelona coordinates
        const lat = 41.3851;
        const lon = 2.1734;
        
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&hourly=temperature_2m,precipitation_probability,weather_code&timezone=Europe%2FMadrid&forecast_days=1`
        );
        
        if (!response.ok) throw new Error("Error fetching weather");
        
        const data = await response.json();
        
        const currentHour = new Date().getHours();
        const forecastHours = [];
        
        for (let i = 0; i < 4; i++) {
          const hourIndex = currentHour + i + 1;
          if (hourIndex < 24 && data.hourly) {
            forecastHours.push({
              hour: `${hourIndex.toString().padStart(2, "0")}:00`,
              temp: Math.round(data.hourly.temperature_2m[hourIndex]),
              rain: data.hourly.precipitation_probability[hourIndex] || 0
            });
          }
        }

        // Calculate average rain probability for next 4 hours
        const avgRainProb = forecastHours.length > 0
          ? Math.round(forecastHours.reduce((sum, h) => sum + h.rain, 0) / forecastHours.length)
          : 0;

        setWeather({
          temp: Math.round(data.current.temperature_2m),
          humidity: data.current.relative_humidity_2m,
          wind: Math.round(data.current.wind_speed_10m),
          weatherCode: data.current.weather_code,
          rainProbability: avgRainProb,
          condition: getConditionFromCode(data.current.weather_code),
          forecast: forecastHours
        });
        setError(null);
      } catch (err) {
        setError("Error al cargar el clima");
        console.error("Weather fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    // Refresh every 15 minutes
    const interval = setInterval(fetchWeather, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const isRaining = weather ? isRainyCode(weather.weatherCode) : false;
  const isRainAlert = weather ? (weather.rainProbability >= 50 || isRaining) : false;

  return { weather, loading, error, isRaining, isRainAlert };
}
