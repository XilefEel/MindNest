import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils/general";
import { useNestStore } from "@/stores/useNestStore";

export default function DateSelect({
  currentDate,
  setCurrentDate,
  setDirection,
  years,
  months,
}: {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  setDirection: (direction: number) => void;
  years: number[];
  months: string[];
}) {
  const { activeBackgroundId } = useNestStore();

  const onMonthChange = (value: string) => {
    const monthIndex = Number(value);
    const newDate = new Date(currentDate);
    newDate.setMonth(monthIndex);

    setDirection(monthIndex > currentDate.getMonth() ? 1 : -1);
    setCurrentDate(newDate);
  };

  const onYearChange = (value: string) => {
    const yearIndex = Number(value);
    const newDate = new Date(currentDate);
    newDate.setFullYear(yearIndex);

    setDirection(newDate > currentDate ? 1 : -1);
    setCurrentDate(newDate);
  };
  return (
    <div className="flex items-center space-x-2">
      <Select
        value={String(currentDate.getMonth())}
        onValueChange={onMonthChange}
      >
        <SelectTrigger className="w-[140px] border-0 shadow-none">
          <SelectValue />
        </SelectTrigger>

        <SelectContent
          className={cn(
            "border-0 bg-white dark:bg-gray-800",
            activeBackgroundId &&
              "bg-white/30 backdrop-blur-sm dark:bg-black/30",
          )}
        >
          {months.map((month, i) => (
            <SelectItem
              key={i}
              value={String(i)}
              className={cn(
                "hover:bg-gray-100 dark:hover:bg-gray-700",
                activeBackgroundId &&
                  "hover:bg-white/30 hover:dark:bg-black/30",
              )}
            >
              {month}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={String(currentDate.getFullYear())}
        onValueChange={onYearChange}
      >
        <SelectTrigger className="w-[100px] border-0 shadow-none">
          <SelectValue />
        </SelectTrigger>

        <SelectContent
          className={cn(
            "border-0 bg-white dark:bg-gray-800",
            activeBackgroundId &&
              "bg-white/30 backdrop-blur-sm dark:bg-black/30",
          )}
        >
          {years.map((year) => (
            <SelectItem
              key={year}
              value={String(year)}
              className={cn(
                "hover:bg-gray-100 dark:hover:bg-gray-700",
                activeBackgroundId &&
                  "hover:bg-white/30 hover:dark:bg-black/30",
              )}
            >
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
