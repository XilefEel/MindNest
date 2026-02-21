import { useState } from "react";
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
import { useActiveBackgroundId } from "@/stores/useNestStore";
import { getWeekRange } from "@/lib/utils/date";
import { useActiveNestlingId } from "@/stores/useNestlingStore";
import { usePlannerActions } from "@/stores/usePlannerStore";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { createPortal } from "react-dom";

interface FloatingCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export default function FloatingCalendar({
  selectedDate,
  onDateSelect,
}: FloatingCalendarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const activeBackgroundId = useActiveBackgroundId();
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

  const handleDateClick = (date: Date) => {
    onDateSelect(date);
    setIsOpen(false);

    const { start, end } = getWeekRange(date);
    getEvents({
      nestlingId: activeNestlingId!,
      start,
      end,
    });
  };

  return createPortal(
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button className="fixed right-6 bottom-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-teal-500 text-white shadow-lg transition hover:bg-teal-600">
          <Calendar className="h-5 w-5" />
        </button>
      </PopoverTrigger>

      <PopoverContent
        side="top"
        align="end"
        className={cn(
          "w-80 border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800",
          activeBackgroundId &&
            "border-0 bg-white/90 backdrop-blur-md dark:bg-black/90",
        )}
      >
        <div className="flex flex-row items-center justify-between">
          <h3 className="text-lg font-semibold">
            {format(currentMonth, "MMMM yyyy")}
          </h3>

          <div className="flex flex-row items-center gap-1">
            <button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="rounded-full p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-600"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="rounded-full p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-600"
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

        <div className="grid grid-cols-7 gap-2 space-y-1">
          {days.map((day) => {
            return (
              <button
                key={day.toString()}
                onClick={() => handleDateClick(day)}
                className={cn(
                  "flex size-8 items-center justify-center rounded-full text-sm transition-colors",
                  "hover:bg-gray-100 dark:hover:bg-gray-700",
                  isSameDay(day, new Date()) &&
                    "bg-teal-500 text-white hover:bg-teal-600",
                  isSameDay(day, selectedDate) && "border border-teal-500",
                  !isSameMonth(day, currentMonth) && "text-gray-300",
                )}
              >
                {format(day, "d")}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>,
    document.body,
  );
}
