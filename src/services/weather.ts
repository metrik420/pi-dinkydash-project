import type { WeatherDetails, ForecastDay } from "@/types";

const getApiKey = (): string => {
  // Use a free demo API key that works without registration
  return "demo_key";
};

export async function fetchCurrentWeather(
  city: string,
  units: "metric" | "imperial" = "metric",
  apiKey?: string
): Promise<WeatherDetails> {
  // Return mock data for demo - replace with real API in production
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
  
  const mockData = {
    temp: Math.round(15 + Math.random() * 20),
    condition: ["Sunny", "Cloudy", "Rainy", "Snowy"][Math.floor(Math.random() * 4)],
    icon: "01d",
    humidity: Math.round(40 + Math.random() * 40),
    wind: Math.round(5 + Math.random() * 15),
    pressure: Math.round(1000 + Math.random() * 50),
    city: city,
    country: "Demo",
  };

  return mockData;
}

export async function fetchForecast(
  city: string,
  units: "metric" | "imperial" = "metric",
  apiKey?: string
): Promise<ForecastDay[]> {
  // Return mock forecast data for demo
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const days: ForecastDay[] = Array.from({ length: 5 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1);
    return {
      dateISO: date.toISOString().split('T')[0],
      icon: "01d",
      min: Math.round(8 + Math.random() * 15),
      max: Math.round(20 + Math.random() * 15),
      pop: Math.round(Math.random() * 100),
    };
  });

  return days;
}
