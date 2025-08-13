import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Task } from "@/types";

export type Units = "metric" | "imperial";

interface SettingsState {
  city: string;
  units: Units;
  setCity: (city: string) => void;
  setUnits: (units: Units) => void;
}

interface TasksState {
  tasks: Task[];
  addTask: (t: Omit<Task, "id" | "completed">) => void;
  toggleTask: (id: string) => void;
  updateTask: (id: string, patch: Partial<Task>) => void;
  deleteTask: (id: string) => void;
}

export type DashboardState = SettingsState & TasksState;

const defaultCity = (import.meta as any).env?.VITE_WEATHER_DEFAULT_CITY || "London";

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      city: defaultCity,
      units: "metric",
      setCity: (city) => set({ city }),
      setUnits: (units) => set({ units }),
      tasks: [
        { id: "1", title: "Feed the fish", assignee: "Emma", priority: "medium", completed: false },
        { id: "2", title: "Take out trash", assignee: "Dad", priority: "high", completed: false },
        { id: "3", title: "Water plants", assignee: "Mom", priority: "low", completed: false },
      ],
      addTask: (t) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            { id: crypto.randomUUID(), completed: false, ...t },
          ],
        })),
      toggleTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task
          ),
        })),
      updateTask: (id, patch) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...patch } : task
          ),
        })),
      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        })),
    }),
    {
      name: "dashboard-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        tasks: state.tasks,
        city: state.city,
        units: state.units,
      }),
    }
  )
);
