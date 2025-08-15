import { useEffect, useMemo, useState } from 'react';
import { Clock, Calendar, Thermometer, Zap, Users, Star, RefreshCcw, Plus, Pencil, Settings as SettingsIcon } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useQuery } from '@tanstack/react-query';
import { fetchCurrentWeather } from '@/services/weather';
import { useDashboardStore } from '@/store/dashboard';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { ForecastWidget } from '@/components/ForecastWidget';
import { TaskModal } from '@/components/TaskModal';
import { EventModal } from '@/components/EventModal';
import { SettingsDialog } from '@/components/SettingsDialog';

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Store selectors
  const city = useDashboardStore((s) => s.city);
  const units = useDashboardStore((s) => s.units);
  const tasks = useDashboardStore((s) => s.tasks);
  const toggleTask = useDashboardStore((s) => s.toggleTask);
  const addTask = useDashboardStore((s) => s.addTask);
  const updateTask = useDashboardStore((s) => s.updateTask);
  const deleteTask = useDashboardStore((s) => s.deleteTask);

  const events = useDashboardStore((s) => s.events);
  const addEvent = useDashboardStore((s) => s.addEvent);
  const updateEvent = useDashboardStore((s) => s.updateEvent);
  const deleteEvent = useDashboardStore((s) => s.deleteEvent);

  const toggles = useDashboardStore((s) => s.toggles);

  // Weather query
  const { data: weather, isLoading, isFetching, refetch, error } = useQuery({
    queryKey: ['weather', city, units],
    queryFn: () => fetchCurrentWeather(city, units),
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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

  const formatTime = (date: Date): string => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formatDate = (date: Date): string => date.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const daysUntil = (dateISO: string): number => {
    const now = new Date();
    const target = new Date(dateISO);
    const diff = target.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const completed = tasks.filter((t) => t.completed).length;
  const percent = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;

  const handleToggleTask = (id: string) => {
    const wasCompleted = tasks.find((t) => t.id === id)?.completed;
    toggleTask(id);
    if (!wasCompleted) {
      toast({ title: 'Great job!', description: 'Task completed.' });
    }
  };

  // Modals state
  const [taskOpen, setTaskOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [eventOpen, setEventOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const editingTask = useMemo(() => tasks.find((t) => t.id === editingTaskId), [tasks, editingTaskId]);
  const editingEvent = useMemo(() => events.find((e) => e.id === editingEventId), [events, editingEventId]);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="text-center flex-1">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 animate-float">Family Dashboard</h1>
            <p className="text-lg md:text-xl text-white/80">Your daily companion on Raspberry Pi</p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="secondary" onClick={() => setSettingsOpen(true)} aria-label="Open settings">
              <SettingsIcon className="h-4 w-4 mr-2" /> Settings
            </Button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          {/* Current Time */}
          <div className="widget col-span-1 md:col-span-2 lg:col-span-2">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Clock className="w-8 h-8 text-primary animate-pulse-gentle flex-shrink-0" />
              <div className="text-center sm:text-left">
                <div className="widget-title">Current Time</div>
                <div className="text-2xl sm:text-4xl font-bold text-card-foreground">{formatTime(currentTime)}</div>
                <div className="text-sm sm:text-lg text-muted-foreground">{formatDate(currentTime)}</div>
              </div>
            </div>
          </div>

          {/* Weather */}
          {toggles.showWeather && (
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
                {isLoading && (
                  <div className="flex items-center justify-center gap-2 py-4">
                    <LoadingSpinner size="sm" />
                    <span className="text-sm text-muted-foreground">Loading...</span>
                  </div>
                )}
                {error && (
                  <div className="text-sm text-destructive bg-destructive/10 p-2 rounded-lg">
                    Weather unavailable
                  </div>
                )}
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
          )}

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

          {/* Forecast */}
          {toggles.showWeather && (
            <div className="lg:col-span-2 md:col-span-2 col-span-1">
              <ForecastWidget />
            </div>
          )}
        </div>

        {/* Events (Countdowns) */}
        {toggles.showEvents && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
            <div className="widget md:col-span-3">
              <div className="flex items-center justify-between mb-4">
                <div className="widget-title flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Countdowns
                </div>
                <Button size="sm" onClick={() => { setEditingEventId(null); setEventOpen(true); }}>
                  <Plus className="h-4 w-4 mr-1" /> Add Event
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                {events.map((event) => (
                  <div key={event.id} className="widget">
                    <div className="flex items-center justify-between">
                      <div className="widget-title flex items-center gap-2">
                        <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: event.color || '#06b6d4' }} />
                        {event.name}
                      </div>
                      <Button size="icon" variant="secondary" onClick={() => { setEditingEventId(event.id); setEventOpen(true); }} aria-label={`Edit ${event.name}`}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-center">
                      <div className="emoji-large mb-2">{event.emoji}</div>
                      <div className="widget-content">{daysUntil(event.dateISO)} days</div>
                      <div className="text-sm text-muted-foreground">to go!</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tasks */}
        {toggles.showTasks && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <div className="widget">
              <div className="flex items-center justify-between">
                <div className="widget-title flex items-center gap-2">
                  <Users className="w-4 h-4" /> Today's Tasks
                </div>
                <Button size="sm" onClick={() => { setEditingTaskId(null); setTaskOpen(true); }}>
                  <Plus className="h-4 w-4 mr-1" /> Add Task
                </Button>
              </div>
              <div className="space-y-4 mt-2">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`w-full flex items-center gap-4 p-3 rounded-xl border transition-all duration-300 ${
                      task.completed ? 'bg-secondary/30' : 'bg-white/10'
                    }`}
                  >
                    <button onClick={() => handleToggleTask(task.id)} aria-label={`Toggle ${task.title}`} className="emoji-medium">
                      {task.completed ? '✅' : '📝'}
                    </button>
                    <div className="flex-1 text-left">
                      <div className={`font-semibold text-card-foreground ${task.completed ? 'line-through opacity-70' : ''}`}>
                        {task.title}
                      </div>
                      <div className="text-sm text-muted-foreground">{task.assignee || 'Unassigned'}</div>
                    </div>
                    <Badge variant="secondary" aria-label={`Priority ${task.priority}`}>
                      {task.priority.toUpperCase()}
                    </Badge>
                    <Button size="icon" variant="secondary" onClick={() => { setEditingTaskId(task.id); setTaskOpen(true); }} aria-label={`Edit ${task.title}`}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
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
        )}
      </div>

      {/* Modals */}
      <TaskModal
        open={taskOpen}
        onOpenChange={setTaskOpen}
        initial={editingTask || undefined}
        onSubmit={(v) => {
          if (editingTaskId) {
            updateTask(editingTaskId, { title: v.title, assignee: v.assignee, priority: v.priority, recurring: v.recurring ?? null });
          } else {
            addTask({ title: v.title, assignee: v.assignee, priority: v.priority, recurring: v.recurring ?? null });
          }
        }}
        onDelete={editingTaskId ? () => { deleteTask(editingTaskId); setTaskOpen(false); } : undefined}
      />

      <EventModal
        open={eventOpen}
        onOpenChange={setEventOpen}
        initial={editingEvent || undefined}
        onSubmit={(v) => {
          if (editingEventId) {
            updateEvent(editingEventId, v);
          } else {
            addEvent(v);
          }
        }}
        onDelete={editingEventId ? () => { deleteEvent(editingEventId); setEventOpen(false); } : undefined}
      />

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
}
