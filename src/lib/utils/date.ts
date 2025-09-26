import { endOfWeek, format, startOfWeek } from "date-fns";

export function getDayFromDate(date: string): number {
  return new Date(date).getDay(); // 0 = Sunday, 6 = Saturday
}

export function getDateFromWeekDay(baseWeekDate: Date, day: number): string {
  const result = new Date(baseWeekDate);
  result.setDate(baseWeekDate.getDate() + day);
  return format(result, "yyyy-MM-dd"); // YYYY-MM-DD
}

export function getWeekRange(selectedDate: Date): {
  start: string;
  end: string;
} {
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 0 });

  return {
    start: format(weekStart, "yyyy-MM-dd"),
    end: format(weekEnd, "yyyy-MM-dd"),
  };
}

export const PLANNER_EVENT_COLORS = [
  "#2DD4BF", // teal-400
  "#F87171", // red-400
  "#60A5FA", // blue-400
  "#FBBF24", // amber-400
  "#FB923C", // orange-400
  "#A78BFA", // violet-400
  "#FB7185", // rose-400
  "#E879F9", // fuchsia-400
  "#34D399", // emerald-400
  "#F472B6", // pink-400
];
