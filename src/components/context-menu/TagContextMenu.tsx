import { COLORS } from "@/lib/utils/constants";
import * as ContextMenu from "@radix-ui/react-context-menu";
import { Check, Edit3, Palette } from "lucide-react";
import BaseContextMenu from "./BaseContextMenu";
import { useNestlingActions } from "@/stores/useNestlingStore";
import { Tag } from "@/lib/types/tag";
import ContextMenuItem from "./ContextMenuItem";
import { toast } from "@/lib/utils/toast";

export default function TagContextMenu({
  tag,
  children,
}: {
  tag: Tag;
  children: React.ReactNode;
}) {
  const { updateTag } = useNestlingActions();

  const onChangeColor = async (color: string) => {
    try {
      await updateTag(tag.id, tag.name, color);
    } catch (error) {
      toast.error("Failed to update tag color");
      console.error(error);
    }
  };

  return (
    <BaseContextMenu
      content={
        <>
          <ContextMenuItem
            Icon={Edit3}
            text="Rename Tag"
            action={() => updateTag(tag.id, tag.name, tag.color)}
          />

          <ContextMenu.Sub>
            <ContextMenu.SubTrigger className="mx-1 flex cursor-pointer items-center gap-3 rounded px-3 py-2 text-sm transition-colors outline-none hover:bg-gray-100 data-[state=open]:bg-gray-100 dark:hover:bg-gray-700 dark:data-[state=open]:bg-gray-700">
              <Palette className="h-4 w-4" />
              <span>Change Color</span>
              <div
                className="ml-auto h-3 w-3 rounded-full border border-gray-300 dark:border-gray-600"
                style={{ backgroundColor: tag.color }}
              />
            </ContextMenu.SubTrigger>
            <ContextMenu.Portal>
              <ContextMenu.SubContent className="animate-in fade-in-0 zoom-in-95 z-50 min-w-[160px] rounded-lg border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                <div className="grid grid-cols-4 gap-2">
                  {COLORS.map((color) => (
                    <button
                      key={color}
                      className="relative h-8 w-8 rounded-full border-2 border-gray-200 transition-all hover:scale-110 dark:border-gray-600"
                      style={{ backgroundColor: color }}
                      onClick={() => onChangeColor(color)}
                    >
                      {tag.color === color && (
                        <Check className="absolute inset-0 m-auto h-4 w-4 text-white drop-shadow" />
                      )}
                    </button>
                  ))}
                </div>
              </ContextMenu.SubContent>
            </ContextMenu.Portal>
          </ContextMenu.Sub>
        </>
      }
    >
      {children}
    </BaseContextMenu>
  );
}
