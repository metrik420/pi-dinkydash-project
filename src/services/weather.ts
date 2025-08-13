import type { WeatherDetails, ForecastDay } from "@/types";

const getApiKey = (): string | undefined => {
  const envKey = (import.meta as any).env?.VITE_WEATHER_API_KEY as string | undefined;
  const localKey = typeof localStorage !== "undefined" ? localStorage.getItem("weatherApiKey") || undefined : undefined;
  return localKey || envKey;
};

export async function fetchCurrentWeather(
  city: string,
  units: "metric" | "imperial" = "metric",
  apiKey?: string
): Promise<WeatherDetails> {
  const key = apiKey ?? getApiKey();
  if (!key) throw new Error("Missing OpenWeatherMap API key");
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${key}&units=${units}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch weather");
  const data = await res.json();

  const details: WeatherDetails = {
    temp: Math.round(data.main.temp),
    condition: data.weather?.[0]?.main ?? "N/A",
    icon: data.weather?.[0]?.icon ?? "01d",
    humidity: data.main.humidity,
    wind: Math.round(data.wind.speed),
    pressure: data.main.pressure,
    city: data.name,
    country: data.sys?.country ?? "",
  };
  return details;
}

export async function fetchForecast(
  city: string,
  units: "metric" | "imperial" = "metric",
  apiKey?: string
): Promise<ForecastDay[]> {
  const key = apiKey ?? getApiKey();
  if (!key) throw new Error("Missing OpenWeatherMap API key");
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${key}&units=${units}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch forecast");
  const data = await res.json();

  const groups: Record<string, any[]> = {};
  for (const item of data.list) {
    const date = item.dt_txt.split(" ")[0];
    (groups[date] ||= []).push(item);
  }

  const days: ForecastDay[] = Object.keys(groups)
    .slice(0, 5)
    .map((date) => {
      const items = groups[date];
      const tempsMin = items.map((i) => i.main.temp_min);
      const tempsMax = items.map((i) => i.main.temp_max);
      const popAvg = Math.round((items.reduce((a, b) => a + (b.pop || 0), 0) / items.length) * 100);
      const midday = items.find((i) => i.dt_txt.includes("12:00:00")) || items[0];
      const icon = midday.weather?.[0]?.icon || items[0].weather?.[0]?.icon || "01d";
      return {
        dateISO: date,
        icon,
        min: Math.round(Math.min(...tempsMin)),
        max: Math.round(Math.max(...tempsMax)),
        pop: popAvg,
      } as ForecastDay;
    });

  return days;
}
