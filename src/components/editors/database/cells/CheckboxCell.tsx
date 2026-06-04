import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils/general";

export default function CheckboxCell({
  value,
  onSave,
}: {
  value: string | null;
  onSave: (value: string) => void;
}) {
  const checked = value === "true";

  return (
    <div className="flex items-center justify-center">
      <Checkbox
        checked={checked}
        onCheckedChange={(checked) => onSave(checked.toString())}
        className={cn(
          "size-5 border transition-colors",
          "border-zinc-300 hover:border-zinc-400",
          "dark:border-zinc-600 dark:hover:border-zinc-500",
          "data-[state=checked]:border-teal-500 data-[state=checked]:bg-teal-500 data-[state=checked]:text-white",
          "dark:data-[state=checked]:border-teal-400 dark:data-[state=checked]:bg-teal-400",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-400",
        )}
      />
    </div>
  );
}
