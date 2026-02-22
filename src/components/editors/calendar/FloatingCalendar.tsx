import { useEffect, useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  addDays,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/general";
import { useActiveNestlingId } from "@/stores/useNestlingStore";
import { usePlannerActions } from "@/stores/usePlannerStore";
import { createPortal } from "react-dom";
import * as calendarApi from "@/lib/api/calendar";
import BasePopover from "@/components/popovers/BasePopover";
import { getWeekRange } from "@/lib/utils/date";

export default function FloatingCalendar({
  selectedDate,
  onDateSelect,
}: {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [monthEvents, setMonthEvents] = useState<Set<string>>(new Set());

  const activeNestlingId = useActiveNestlingId();
  const { getEvents } = usePlannerActions();

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

  const days: Date[] = [];
  for (let day = startDate; day <= endDate; day = addDays(day, 1)) {
    days.push(day);
  }

  const isInCurrentWeek = (date: Date) => {
    const today = new Date();
    const weekStart = startOfWeek(today);
    const weekEnd = endOfWeek(today);
    return date >= weekStart && date <= weekEnd;
  };

  const handleDateClick = async (date: Date) => {
    onDateSelect(date);
    setIsOpen(false);

    const { start, end } = getWeekRange(date);

    await getEvents({
      nestlingId: activeNestlingId!,
      start,
      end,
    });
  };

  useEffect(() => {
    if (!isOpen || !activeNestlingId) return;

    const fetch = async () => {
      const events = await calendarApi.getPlannerEvents({
        id: activeNestlingId,
        start: format(monthStart, "yyyy-MM-dd"),
        end: format(monthEnd, "yyyy-MM-dd"),
      });

      setMonthEvents(new Set(events.map((e) => e.date)));
    };

    fetch();
  }, [isOpen, currentMonth, activeNestlingId]);

  return createPortal(
    <BasePopover
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      side="top"
      align="end"
      trigger={
        <button className="fixed right-6 bottom-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-teal-500 text-white shadow-lg transition hover:bg-teal-600">
          <Calendar className="h-5 w-5" />
        </button>
      }
      content={
        <>
          <div className="flex flex-row items-center justify-between">
            <h3 className="text-lg font-semibold">
              {format(currentMonth, "MMMM yyyy")}
            </h3>

            <div className="flex flex-row items-center gap-1">
              <button
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                className="rounded-full p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-400"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                className="rounded-full p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-400"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="mt-4 mb-2 grid grid-cols-7 gap-2">
            {weekDays.map((day) => (
              <div
                key={day}
                className="flex h-8 items-center justify-center text-xs font-medium text-gray-500"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {days.map((day) => {
              return (
                <div className="relative flex flex-col items-center">
                  <button
                    key={day.toString()}
                    onClick={() => handleDateClick(day)}
                    className={cn(
                      "flex size-8 items-center justify-center rounded-full text-sm transition-colors",
                      "hover:bg-gray-100 dark:hover:bg-gray-700",
                      isInCurrentWeek(day) &&
                        !isSameDay(day, new Date()) &&
                        "bg-teal-100 text-teal-700 hover:bg-teal-200/70 dark:bg-teal-700/20 dark:text-teal-300 dark:hover:bg-teal-700/30",
                      isSameDay(day, new Date()) &&
                        "bg-teal-500 text-white hover:bg-teal-600 dark:bg-teal-400 dark:hover:bg-teal-500",
                      !isSameMonth(day, currentMonth) &&
                        "text-gray-300 dark:text-gray-600",
                      isSameDay(day, selectedDate) && "border border-teal-500",
                    )}
                  >
                    {format(day, "d")}
                  </button>
                  {monthEvents.has(format(day, "yyyy-MM-dd")) && (
                    <div className="absolute -bottom-0.5 h-1 w-1 rounded-full bg-teal-500" />
                  )}
                </div>
              );
            })}
          </div>
        </>
      }
    />,
    document.body,
  );
}
