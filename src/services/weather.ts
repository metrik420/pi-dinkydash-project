import type { WeatherDetails } from "@/types";

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
