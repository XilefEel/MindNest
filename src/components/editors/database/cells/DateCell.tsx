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
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/general";
import BasePopover from "@/components/popovers/BasePopover";
import { useActiveBackgroundId } from "@/stores/useNestStore";

export default function DateCell({
  value,
  onSave,
}: {
  value: string | null;
  onSave: (value: string | null) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(
    value ? new Date(value) : new Date(),
  );

  const activeBackgroundId = useActiveBackgroundId();

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

  const days: Date[] = [];
  for (let day = startDate; day <= endDate; day = addDays(day, 1)) {
    days.push(day);
  }

  const selectedDate = value ? new Date(value) : null;

  const handleSelectDay = (day: Date) => {
    onSave(format(day, "yyyy-MM-dd"));
    setIsOpen(false);
  };

  return (
    <BasePopover
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      side="bottom"
      align="center"
      width="w-72"
      trigger={
        <button className="w-full text-left text-sm">
          {selectedDate ? (
            format(selectedDate, "MMM d, yyyy")
          ) : (
            <span
              className={cn(
                "text-zinc-400 dark:text-zinc-500",
                activeBackgroundId && "text-zinc-500 dark:text-zinc-400",
              )}
            >
              Pick a date
            </span>
          )}
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
                className="rounded-full p-1 text-zinc-500 transition hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                className="rounded-full p-1 text-zinc-500 transition hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="mt-4 mb-2 grid grid-cols-7 gap-2">
            {weekDays.map((day, i) => (
              <div
                key={i}
                className="flex h-8 items-center justify-center text-xs font-medium text-zinc-500"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {days.map((day) => (
              <button
                key={day.toString()}
                onClick={() => handleSelectDay(day)}
                className={cn(
                  "flex size-8 items-center justify-center rounded-full text-sm transition-[background]",
                  "hover:bg-zinc-100 dark:hover:bg-zinc-700",
                  activeBackgroundId &&
                    "hover:bg-black/5 dark:hover:bg-white/5",
                  isSameDay(day, new Date()) &&
                    "bg-teal-500 text-white hover:bg-teal-600 dark:bg-teal-400 dark:hover:bg-teal-500",
                  selectedDate &&
                    isSameDay(day, selectedDate) &&
                    !isSameDay(day, new Date()) &&
                    "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300",
                  !isSameMonth(day, currentMonth) &&
                    "text-zinc-400 dark:text-zinc-500",
                )}
              >
                {format(day, "d")}
              </button>
            ))}
          </div>
        </>
      }
    />
  );
}
