import { cn } from "@/lib/utils/general";
import { useActiveBackgroundId } from "@/stores/useNestStore";
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
  const activeBackgroundId = useActiveBackgroundId();

  return (
    <div className="flex flex-col gap-1">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        className={cn(
          "w-full rounded-md border px-3 py-2 text-sm transition-colors",
          "bg-white dark:bg-gray-800",
          "shadow-sm focus:shadow-md",
          "text-gray-900 placeholder-gray-500 dark:text-gray-100 dark:placeholder-gray-400",
          "focus:ring-teal-500 dark:focus:ring-teal-400",
          "border-gray-300 focus:border-teal-50 dark:border-gray-600 dark:focus:border-teal-400",
          activeBackgroundId &&
            "border-transparent bg-white/10 backdrop-blur-sm dark:border-transparent dark:bg-black/10",
        )}
      />
    </div>
  );
}
