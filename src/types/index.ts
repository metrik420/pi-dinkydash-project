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
