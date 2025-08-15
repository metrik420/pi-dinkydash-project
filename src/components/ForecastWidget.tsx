import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchForecast } from '@/services/weather';
import { useDashboardStore } from '@/store/dashboard';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export function ForecastWidget() {
  const city = useDashboardStore((s) => s.city);
  const units = useDashboardStore((s) => s.units);
  const { data, isLoading, error } = useQuery({
    queryKey: ['forecast', city, units],
    queryFn: () => fetchForecast(city, units),
    staleTime: 1000 * 60 * 10,
  });

  return (
    <div className="widget">
      <div className="widget-title">5-Day Forecast</div>
      {isLoading && (
        <div className="flex items-center justify-center gap-2 py-4">
          <LoadingSpinner size="sm" />
          <span className="text-sm text-muted-foreground">Loading forecast...</span>
        </div>
      )}
      {error && (
        <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
          Failed to load forecast. Please check your internet connection.
        </div>
      )}
      {data && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {data.map((d) => (
            <div key={d.dateISO} className="rounded-xl p-2 sm:p-3 bg-white/10 text-center">
              <div className="text-sm text-muted-foreground">
                {new Date(d.dateISO).toLocaleDateString([], { weekday: 'short' })}
              </div>
              <img
                src={`https://openweathermap.org/img/wn/${d.icon}.png`}
                alt="forecast icon"
                className="mx-auto"
                width={40}
                height={40}
                loading="lazy"
              />
              <div className="text-sm">{d.max}° / {d.min}°</div>
              <div className="text-xs text-muted-foreground">{d.pop}% rain</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
