import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
) {
  let timer: ReturnType<typeof setTimeout> | null;
  const debounced = (...args: any[]) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };

  debounced.cancel = () => {
    if (timer) clearTimeout(timer);
  };

  return debounced as T & { cancel: () => void };
}

export function getDayFromDate(date: string): number {
  return new Date(date).getDay(); // 0 = Sunday, 6 = Saturday
}

export function getDateFromWeekDay(baseWeekDate: Date, day: number): string {
  const result = new Date(baseWeekDate);
  result.setDate(baseWeekDate.getDate() + day);
  return result.toISOString().split("T")[0]; // YYYY-MM-DD
}

export const PLANNER_EVENT_COLORS = [
  "#14b8a6", // teal-500
  "#3b82f6", // blue-500
  "#10b981", // green-500
  "#f59e0b", // amber-500
  "#ef4444", // red-500
  "#8b5cf6", // violet-500
  "#ec4899", // pink-500
  "#f43f5e", // rose-500
];

export const DEFAULT_EVENT_COLOR = "#14b8a6";
