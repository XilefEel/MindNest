import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  return (
    <div className="flex items-center space-x-2">
      <Select
        value={String(currentDate.getMonth())}
        onValueChange={(value) => {
          const monthIndex = Number(value);
          const newDate = new Date(currentDate);
          newDate.setMonth(monthIndex);

          setDirection(monthIndex > currentDate.getMonth() ? 1 : -1);
          setCurrentDate(newDate);
        }}
      >
        <SelectTrigger className="w-[140px] border-0 shadow-none">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-white">
          {months.map((month, i) => (
            <SelectItem key={i} value={String(i)}>
              {month}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={String(currentDate.getFullYear())}
        onValueChange={(value) => {
          const yearIndex = Number(value);
          const newDate = new Date(currentDate);
          newDate.setFullYear(yearIndex);

          setDirection(newDate > currentDate ? 1 : -1);
          setCurrentDate(newDate);
        }}
      >
        <SelectTrigger className="w-[100px] border-0 shadow-none">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-white">
          {years.map((year) => (
            <SelectItem key={year} value={String(year)}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
