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
