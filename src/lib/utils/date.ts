import { addDays, endOfWeek, format, parseISO, startOfWeek } from "date-fns";

export const getDayFromDate = (date: string) => {
  return new Date(date).getDay(); // 0 = Sunday, 6 = Saturday
};

export const getWeekRange = (selectedDate: Date) => {
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 0 });

  return {
    start: format(weekStart, "yyyy-MM-dd"),
    end: format(weekEnd, "yyyy-MM-dd"),
  };
};

export const addDaysToDate = (date: string, days: number) => {
  return format(addDays(parseISO(date), days), "yyyy-MM-dd");
};
