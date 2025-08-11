import { useEffect, useState } from 'react';
import { Clock, Calendar, Thermometer, Zap, Users, Star } from 'lucide-react';

interface WeatherData {
  temp: number;
  condition: string;
  emoji: string;
}

interface CountdownEvent {
  name: string;
  date: Date;
  emoji: string;
}

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather] = useState<WeatherData>({
    temp: 22,
    condition: 'Sunny',
    emoji: '☀️'
  });

  const countdownEvents: CountdownEvent[] = [
    { name: 'Christmas', date: new Date('2024-12-25'), emoji: '🎄' },
    { name: 'Summer Break', date: new Date('2024-07-01'), emoji: '🏖️' },
    { name: 'Birthday Party', date: new Date('2024-09-15'), emoji: '🎂' }
  ];

  const dailyTasks = [
    { task: 'Feed the fish', assigned: 'Emma', emoji: '🐠' },
    { task: 'Take out trash', assigned: 'Dad', emoji: '🗑️' },
    { task: 'Water plants', assigned: 'Mom', emoji: '🌱' }
  ];

  const funFacts = [
    'A group of flamingos is called a flamboyance! 🦩',
    'Honey never spoils - it can last thousands of years! 🍯',
    'A day on Venus is longer than its year! 🪐',
    'Octopuses have three hearts! 🐙'
  ];

  const [currentFactIndex, setCurrentFactIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const factTimer = setInterval(() => {
      setCurrentFactIndex((prev) => (prev + 1) % funFacts.length);
    }, 10000);

    return () => {
      clearInterval(timer);
      clearInterval(factTimer);
    };
  }, [funFacts.length]);

  const calculateDaysUntil = (targetDate: Date): number => {
    const now = new Date();
    const diffTime = targetDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString([], { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-white mb-2 animate-float">
            Family Dashboard
          </h1>
          <p className="text-xl text-white/80">
            Your daily companion on Raspberry Pi
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          {/* Current Time */}
          <div className="widget col-span-1 md:col-span-2 lg:col-span-2">
            <div className="flex items-center gap-4">
              <Clock className="w-8 h-8 text-primary animate-pulse-gentle" />
              <div>
                <div className="widget-title">Current Time</div>
                <div className="text-4xl font-bold text-card-foreground">
                  {formatTime(currentTime)}
                </div>
                <div className="text-lg text-muted-foreground">
                  {formatDate(currentTime)}
                </div>
              </div>
            </div>
          </div>

          {/* Weather */}
          <div className="widget">
            <div className="widget-title flex items-center gap-2">
              <Thermometer className="w-4 h-4" />
              Weather
            </div>
            <div className="text-center">
              <div className="emoji-large mb-2">{weather.emoji}</div>
              <div className="widget-content">{weather.temp}°C</div>
              <div className="text-sm text-muted-foreground">{weather.condition}</div>
            </div>
          </div>

          {/* System Status */}
          <div className="widget">
            <div className="widget-title flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Pi Status
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
                <Calendar className="w-4 h-4" />
                {event.name}
              </div>
              <div className="text-center">
                <div className="emoji-large mb-2">{event.emoji}</div>
                <div className="widget-content">
                  {calculateDaysUntil(event.date)} days
                </div>
                <div className="text-sm text-muted-foreground">to go!</div>
              </div>
            </div>
          ))}
        </div>

        {/* Daily Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="widget">
            <div className="widget-title flex items-center gap-2">
              <Users className="w-4 h-4" />
              Today's Tasks
            </div>
            <div className="space-y-4">
              {dailyTasks.map((task, index) => (
                <div key={index} className="flex items-center gap-4 p-3 bg-white/10 rounded-xl">
                  <span className="emoji-medium">{task.emoji}</span>
                  <div className="flex-1">
                    <div className="font-semibold text-card-foreground">{task.task}</div>
                    <div className="text-sm text-muted-foreground">{task.assigned}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fun Facts */}
          <div className="widget">
            <div className="widget-title flex items-center gap-2">
              <Star className="w-4 h-4" />
              Did You Know?
            </div>
            <div className="text-center">
              <div className="emoji-large mb-4">🤔</div>
              <div className="text-lg text-card-foreground leading-relaxed">
                {funFacts[currentFactIndex]}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}