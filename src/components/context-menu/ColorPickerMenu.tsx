import { COLORS } from "@/lib/utils/constants";
import { cn } from "@/lib/utils/general";
import { useActiveBackgroundId } from "@/stores/useNestStore";
import * as ContextMenu from "@radix-ui/react-context-menu";
import { Check, Palette } from "lucide-react";
import { ElementType } from "react";

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
    <ContextMenu.Sub>
      <ContextMenu.SubTrigger
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        className={cn(
          "mx-1 flex cursor-pointer items-center gap-3 rounded px-3 py-2 text-sm transition-colors outline-none hover:bg-gray-100 dark:hover:bg-gray-700",
          activeBackgroundId && "hover:bg-white/30 dark:hover:bg-black/30",
        )}
      >
        <Icon size={16} />
        <span>{label}</span>
        <div
          className="ml-auto h-3 w-3 rounded-full border border-gray-300 dark:border-gray-600"
          style={{ backgroundColor: element.color }}
        />
      </ContextMenu.SubTrigger>
      <ContextMenu.Portal>
        <ContextMenu.SubContent
          className={cn(
            "animate-in fade-in-0 zoom-in-95 z-50 min-w-[160px] rounded-lg border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-gray-800",
            activeBackgroundId &&
              "border-0 bg-white/30 backdrop-blur-sm hover:bg-white/30 dark:bg-black/30 dark:hover:bg-black/30",
          )}
        >
          <div className="grid grid-cols-4 gap-2">
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
        </ContextMenu.SubContent>
      </ContextMenu.Portal>
    </ContextMenu.Sub>
  );
}
