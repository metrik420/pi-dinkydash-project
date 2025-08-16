import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Task, EventItem, FamilyMember, FeatureToggles, ThemeMode, CalendarEvent, WidgetLayout } from "@/types";

export type Units = "metric" | "imperial";

interface SettingsState {
  city: string;
  units: Units;
  theme: ThemeMode;
  toggles: FeatureToggles;
  setCity: (city: string) => void;
  setUnits: (units: Units) => void;
  setTheme: (theme: ThemeMode) => void;
  setToggles: (t: Partial<FeatureToggles>) => void;
}

interface TasksState {
  tasks: Task[];
  addTask: (t: Omit<Task, "id" | "completed">) => void;
  toggleTask: (id: string) => void;
  updateTask: (id: string, patch: Partial<Task>) => void;
  deleteTask: (id: string) => void;
}

interface EventsState {
  events: EventItem[];
  addEvent: (e: Omit<EventItem, "id">) => void;
  updateEvent: (id: string, patch: Partial<EventItem>) => void;
  deleteEvent: (id: string) => void;
}

interface FamilyState {
  family: FamilyMember[];
  addFamily: (m: Omit<FamilyMember, "id">) => void;
  updateFamily: (id: string, patch: Partial<FamilyMember>) => void;
  deleteFamily: (id: string) => void;
}

interface CalendarState {
  calendarEvents: CalendarEvent[];
  googleCalendarConnected: boolean;
  addCalendarEvent: (e: Omit<CalendarEvent, "id">) => void;
  updateCalendarEvent: (id: string, patch: Partial<CalendarEvent>) => void;
  deleteCalendarEvent: (id: string) => void;
  setGoogleCalendarConnected: (connected: boolean) => void;
}

interface AdminState {
  widgetLayout: WidgetLayout[];
  updateWidgetLayout: (layout: WidgetLayout[]) => void;
  updateWidget: (id: string, patch: Partial<WidgetLayout>) => void;
}

export type DashboardState = SettingsState & TasksState & EventsState & FamilyState & CalendarState & AdminState;

const defaultCity = (import.meta as any).env?.VITE_WEATHER_DEFAULT_CITY || "London";

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      city: defaultCity,
      units: "metric",
      theme: "auto",
      toggles: { showWeather: true, showTasks: true, showEvents: true, showCalendar: true, showFunFacts: true, showSystem: true },
      setCity: (city) => set({ city }),
      setUnits: (units) => set({ units }),
      setTheme: (theme) => set({ theme }),
      setToggles: (t) => set((s) => ({ toggles: { ...s.toggles, ...t } })),

      tasks: [
        { id: "1", title: "Feed the fish", assignee: "Emma", priority: "medium", completed: false },
        { id: "2", title: "Take out trash", assignee: "Dad", priority: "high", completed: false },
        { id: "3", title: "Water plants", assignee: "Mom", priority: "low", completed: false },
      ],
      addTask: (t) => set((state) => ({ tasks: [...state.tasks, { id: crypto.randomUUID(), completed: false, ...t }] })),
      toggleTask: (id) => set((state) => ({ tasks: state.tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)) })),
      updateTask: (id, patch) => set((state) => ({ tasks: state.tasks.map((task) => (task.id === id ? { ...task, ...patch } : task)) })),
      deleteTask: (id) => set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),

      events: [
        { id: "e1", name: "Christmas", dateISO: "2025-12-25", emoji: "🎄", color: "#22c55e" },
        { id: "e2", name: "Summer Break", dateISO: "2025-07-01", emoji: "🏖️", color: "#06b6d4" },
        { id: "e3", name: "Birthday Party", dateISO: "2025-09-15", emoji: "🎂", color: "#f97316" },
      ],
      addEvent: (e) => set((s) => ({ events: [...s.events, { id: crypto.randomUUID(), ...e }] })),
      updateEvent: (id, patch) => set((s) => ({ events: s.events.map((ev) => (ev.id === id ? { ...ev, ...patch } : ev)) })),
      deleteEvent: (id) => set((s) => ({ events: s.events.filter((ev) => ev.id !== id) })),

      family: [
        { id: "f1", name: "Mom" },
        { id: "f2", name: "Dad" },
        { id: "f3", name: "Emma" },
      ],
      addFamily: (m) => set((s) => ({ family: [...s.family, { id: crypto.randomUUID(), ...m }] })),
      updateFamily: (id, patch) => set((s) => ({ family: s.family.map((m) => (m.id === id ? { ...m, ...patch } : m)) })),
      deleteFamily: (id) => set((s) => ({ family: s.family.filter((m) => m.id !== id) })),

      // Calendar state
      calendarEvents: [],
      googleCalendarConnected: false,
      addCalendarEvent: (e) => set((s) => ({ calendarEvents: [...s.calendarEvents, { id: crypto.randomUUID(), ...e }] })),
      updateCalendarEvent: (id, patch) => set((s) => ({ calendarEvents: s.calendarEvents.map((ev) => (ev.id === id ? { ...ev, ...patch } : ev)) })),
      deleteCalendarEvent: (id) => set((s) => ({ calendarEvents: s.calendarEvents.filter((ev) => ev.id !== id) })),
      setGoogleCalendarConnected: (connected) => set({ googleCalendarConnected: connected }),

      // Admin state
      widgetLayout: [
        { id: 'time', type: 'weather', enabled: true, position: 0, size: 'large' },
        { id: 'weather', type: 'weather', enabled: true, position: 1, size: 'medium' },
        { id: 'system', type: 'system', enabled: true, position: 2, size: 'small' },
        { id: 'calendar', type: 'calendar', enabled: true, position: 3, size: 'large' },
        { id: 'events', type: 'events', enabled: true, position: 4, size: 'large' },
        { id: 'tasks', type: 'tasks', enabled: true, position: 5, size: 'medium' },
        { id: 'funfacts', type: 'funfacts', enabled: true, position: 6, size: 'medium' },
      ],
      updateWidgetLayout: (layout) => set({ widgetLayout: layout }),
      updateWidget: (id, patch) => set((s) => ({ 
        widgetLayout: s.widgetLayout.map((w) => (w.id === id ? { ...w, ...patch } : w)) 
      })),
    }),
    {
      name: "dashboard-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        tasks: state.tasks,
        city: state.city,
        units: state.units,
        theme: state.theme,
        toggles: state.toggles,
        family: state.family,
        events: state.events,
        calendarEvents: state.calendarEvents,
        googleCalendarConnected: state.googleCalendarConnected,
        widgetLayout: state.widgetLayout,
      }),
    }
  )
);
