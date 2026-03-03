import { COLORS } from "@/lib/utils/constants";
import { cn } from "@/lib/utils/general";
import { useActiveBackgroundId } from "@/stores/useNestStore";
import { Check, Palette } from "lucide-react";
import { ElementType } from "react";
import ContextSubMenu from "./ContextSubMenu";

export default function ColorPickerMenu<T extends { color: string }>({
  element,
  handleChangeColor,
  label = "Change Color",
  Icon = Palette,
}: {
  element: T;
  handleChangeColor: (color: string) => void;
  label?: string;
  Icon?: ElementType;
}) {
  const activeBackgroundId = useActiveBackgroundId();
  return (
    <ContextSubMenu
      width="min-w-[160px]"
      trigger={
        <>
          <Icon size={16} />
          <span>{label}</span>
          <div
            className="ml-auto h-3 w-3 rounded-full border border-gray-300 dark:border-gray-600"
            style={{ backgroundColor: element.color }}
          />
        </>
      }
      content={
        <div className="grid grid-cols-4 gap-2 px-2">
          {COLORS.map((color) => (
            <button
              key={color}
              className={cn(
                "relative h-8 w-8 rounded-full border-2 border-gray-200 transition-all hover:scale-110 dark:border-gray-600",
                activeBackgroundId && "border-black/20 dark:border-white/20",
              )}
              style={{ backgroundColor: color }}
              onClick={() => handleChangeColor(color)}
            >
              {element.color === color && (
                <Check className="absolute inset-0 m-auto h-4 w-4 text-white drop-shadow" />
              )}
            </button>
          ))}
        </div>
      }
    />
  );
}
