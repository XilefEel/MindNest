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

export const formatTime = (time: number) => {
  const hours = Math.floor(time);
  const minutes = Math.round((time % 1) * 60);
  return format(
    new Date(0, 0, 0, hours, minutes),
    minutes === 0 ? "h a" : "h:mm a",
  );
};

export const formatDuration = (duration: number) => {
  const hours = Math.floor(duration);
  const minutes = Math.round((duration % 1) * 60);
  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
};
