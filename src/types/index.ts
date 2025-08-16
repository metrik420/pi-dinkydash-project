export type Priority = "high" | "medium" | "low";
export type Recurring = "daily" | "weekly" | "monthly" | null;

export interface Task {
  id: string;
  title: string;
  assignee?: string;
  priority: Priority;
  recurring?: Recurring;
  completed: boolean;
}

export interface WeatherDetails {
  temp: number;
  condition: string;
  icon: string;
  humidity: number;
  wind: number;
  pressure: number;
  city: string;
  country: string;
}

export interface ForecastDay {
  dateISO: string;
  icon: string;
  min: number;
  max: number;
  pop: number; // precipitation probability in %
}

export interface EventItem {
  id: string;
  name: string;
  dateISO: string; // ISO date string
  emoji: string;
  color?: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  avatarUrl?: string;
}

export type ThemeMode = "light" | "dark" | "auto";

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  description?: string;
  source: 'local' | 'google';
}

export interface WidgetLayout {
  id: string;
  type: 'weather' | 'tasks' | 'events' | 'calendar' | 'funfacts' | 'system';
  enabled: boolean;
  position: number;
  size: 'small' | 'medium' | 'large';
  settings?: Record<string, any>;
}

export interface FeatureToggles {
  showWeather: boolean;
  showTasks: boolean;
  showEvents: boolean;
  showCalendar: boolean;
  showFunFacts: boolean;
  showSystem: boolean;
}
