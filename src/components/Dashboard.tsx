import { useEffect, useState } from 'react';
import { Clock, Calendar, Thermometer, Zap, Users, Star, RefreshCcw } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchCurrentWeather } from '@/services/weather';
import { useDashboardStore } from '@/store/dashboard';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

interface CountdownEvent {
  name: string;
  date: Date;
  emoji: string;
}

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());

  const city = useDashboardStore((s) => s.city);
  const units = useDashboardStore((s) => s.units);
  const tasks = useDashboardStore((s) => s.tasks);
  const toggleTask = useDashboardStore((s) => s.toggleTask);

  const { data: weather, isLoading, isFetching, refetch, error } = useQuery({
    queryKey: ['weather', city, units],
    queryFn: () => fetchCurrentWeather(city, units),
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const countdownEvents: CountdownEvent[] = [
    { name: 'Christmas', date: new Date('2025-12-25'), emoji: '🎄' },
    { name: 'Summer Break', date: new Date('2025-07-01'), emoji: '🏖️' },
    { name: 'Birthday Party', date: new Date('2025-09-15'), emoji: '🎂' },
  ];

  const funFacts = [
    'A group of flamingos is called a flamboyance! 🦩',
    'Honey never spoils - it can last thousands of years! 🍯',
    'A day on Venus is longer than its year! 🪐',
    'Octopuses have three hearts! 🐙',
  ];
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setCurrentFactIndex((p) => (p + 1) % funFacts.length), 10000);
    return () => clearInterval(t);
  }, [funFacts.length]);

  const calculateDaysUntil = (targetDate: Date): number => {
    const now = new Date();
    const diffTime = targetDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const formatTime = (date: Date): string => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formatDate = (date: Date): string => date.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const completed = tasks.filter((t) => t.completed).length;
  const percent = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;

  const handleToggleTask = (id: string) => {
    const wasCompleted = tasks.find((t) => t.id === id)?.completed;
    toggleTask(id);
    if (!wasCompleted) {
      toast({ title: 'Great job!', description: 'Task completed.' });
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-white mb-2 animate-float">Family Dashboard</h1>
          <p className="text-xl text-white/80">Your daily companion on Raspberry Pi</p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Current Time */}
          <div className="widget col-span-1 md:col-span-2 lg:col-span-2">
            <div className="flex items-center gap-4">
              <Clock className="w-8 h-8 text-primary animate-pulse-gentle" />
              <div>
                <div className="widget-title">Current Time</div>
                <div className="text-4xl font-bold text-card-foreground">{formatTime(currentTime)}</div>
                <div className="text-lg text-muted-foreground">{formatDate(currentTime)}</div>
              </div>
            </div>
          </div>

          {/* Weather */}
          <div className="widget">
            <div className="widget-title flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4" /> Weather • {city}
              </div>
              <Button size="sm" variant="secondary" onClick={() => refetch()} disabled={isFetching} aria-label="Refresh weather">
                <RefreshCcw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
              </Button>
            </div>
            <div className="text-center">
              {isLoading && <div className="text-sm text-muted-foreground">Loading...</div>}
              {error && <div className="text-sm text-destructive">Failed to load weather</div>}
              {weather && (
                <div>
                  <div className="mb-2 flex justify-center">
                    <img
                      src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                      alt={`Weather icon ${weather.condition}`}
                      width={80}
                      height={80}
                    />
                  </div>
                  <div className="widget-content">
                    {weather.temp}°{units === 'metric' ? 'C' : 'F'}
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">{weather.condition}</div>
                  <div className="grid grid-cols-3 gap-2 text-sm text-muted-foreground">
                    <div>💧 {weather.humidity}%</div>
                    <div>🌬️ {weather.wind} {units === 'metric' ? 'm/s' : 'mph'}</div>
                    <div>🔽 {weather.pressure} hPa</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* System Status */}
          <div className="widget">
            <div className="widget-title flex items-center gap-2">
              <Zap className="w-4 h-4" /> Pi Status
            </div>
            <div className="text-center">
              <div className="emoji-large mb-2">🟢</div>
              <div className="widget-content">Healthy</div>
              <div className="text-sm text-muted-foreground">All systems go!</div>
            </div>
          </div>
        </div>

        {/* Countdown Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {countdownEvents.map((event, index) => (
            <div key={index} className="widget">
              <div className="widget-title flex items-center gap-2">
                <Calendar className="w-4 h-4" /> {event.name}
              </div>
              <div className="text-center">
                <div className="emoji-large mb-2">{event.emoji}</div>
                <div className="widget-content">{calculateDaysUntil(event.date)} days</div>
                <div className="text-sm text-muted-foreground">to go!</div>
              </div>
            </div>
          ))}
        </div>

        {/* Daily Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="widget">
            <div className="widget-title flex items-center gap-2">
              <Users className="w-4 h-4" /> Today's Tasks
            </div>
            <div className="space-y-4">
              {tasks.map((task) => (
                <button
                  key={task.id}
                  onClick={() => handleToggleTask(task.id)}
                  className={`w-full flex items-center gap-4 p-3 rounded-xl border transition-all duration-300 ${
                    task.completed ? 'bg-secondary/30' : 'bg-white/10'
                  }`}
                >
                  <span className="emoji-medium">{task.completed ? '✅' : '📝'}</span>
                  <div className="flex-1 text-left">
                    <div className={`font-semibold text-card-foreground ${task.completed ? 'line-through opacity-70' : ''}`}>
                      {task.title}
                    </div>
                    <div className="text-sm text-muted-foreground">{task.assignee || 'Unassigned'}</div>
                  </div>
                  <Badge variant="secondary" aria-label={`Priority ${task.priority}`}>
                    {task.priority.toUpperCase()}
                  </Badge>
                </button>
              ))}
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                <span>Completion</span>
                <span>{percent}%</span>
              </div>
              <Progress value={percent} />
            </div>
          </div>

          {/* Fun Facts */}
          <div className="widget">
            <div className="widget-title flex items-center gap-2">
              <Star className="w-4 h-4" /> Did You Know?
            </div>
            <div className="text-center">
              <div className="emoji-large mb-4">🤔</div>
              <div className="text-lg text-card-foreground leading-relaxed">{funFacts[currentFactIndex]}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
