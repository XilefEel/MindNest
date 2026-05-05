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
    <Checkbox
      checked={checked}
      onCheckedChange={(checked) => onSave(checked.toString())}
      className={cn(
        "size-5 border-2 data-[state=checked]:text-white",
        "border-teal-500 data-[state=checked]:border-teal-400 data-[state=checked]:bg-teal-400",
        "dark:border-teal-400 dark:data-[state=checked]:border-teal-500 dark:data-[state=checked]:bg-teal-500",
      )}
    />
  );
}
