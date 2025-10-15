import { cn } from "@/lib/utils/general";
import { useNestStore } from "@/stores/useNestStore";
import { Input } from "../ui/input";

export function TextField({
  label,
  placeholder,
  text,
  setText,
}: {
  label: string;
  placeholder?: string;
  text: string;
  setText: (text: string) => void;
}) {
  const { activeBackgroundId } = useNestStore();

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <Input
        value={text}
        autoFocus
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full rounded-md border px-3 py-2 text-sm",
          "border-gray-300 bg-white text-black placeholder-gray-400",
          "focus:border-teal-500 focus:ring-teal-500",
          "dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-500",
          "dark:focus:border-teal-400 dark:focus:ring-teal-400",
          activeBackgroundId && "bg-white/10 backdrop-blur-sm dark:bg-black/10",
        )}
      />
    </div>
  );
}
