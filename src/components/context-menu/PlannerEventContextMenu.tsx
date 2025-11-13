import { PlannerEventType } from "@/lib/types/calendar";
import { COLORS } from "@/lib/utils/constants";
import { usePlannerStore } from "@/stores/usePlannerStore";
import * as ContextMenu from "@radix-ui/react-context-menu";
import { Copy, Trash, Check, Palette } from "lucide-react";
import ContextMenuItem from "./ContextMenuItem";
import BaseContextMenu from "./BaseContextMenu";

export default function PlannerEventContextMenu({
  event,
  children,
}: {
  event: PlannerEventType;
  children: React.ReactNode;
}) {
  const { createEvent, updateEvent, deleteEvent } = usePlannerStore();

  const onDuplicate = () => {
    createEvent(event);
  };
  const onChangeColor = (color: string) => {
    updateEvent(event.id, { color });
  };
  return (
    <BaseContextMenu
      content={
        <>
          <ContextMenuItem
            action={onDuplicate}
            Icon={Copy}
            text="Duplicate Event"
          />

          <ContextMenu.Sub>
            <ContextMenu.SubTrigger className="mx-1 flex cursor-pointer items-center gap-3 rounded px-3 py-2 text-sm transition-colors duration-200 outline-none hover:bg-gray-100 data-[state=open]:bg-gray-100 dark:hover:bg-gray-700 dark:data-[state=open]:bg-gray-700">
              <Palette className="h-4 w-4" />
              <span>Change Color</span>
              <div
                className="ml-auto h-3 w-3 rounded-full border border-gray-300 dark:border-gray-600"
                style={{
                  backgroundColor: event.color || COLORS[0],
                }}
              />
            </ContextMenu.SubTrigger>
            <ContextMenu.Portal>
              <ContextMenu.SubContent className="animate-in fade-in-0 zoom-in-95 z-50 min-w-[160px] rounded-lg border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                <div className="grid grid-cols-4 gap-2">
                  {COLORS.map((color) => (
                    <button
                      key={color}
                      className="relative h-8 w-8 rounded-full border-2 border-gray-200 transition-all duration-200 hover:scale-110 dark:border-gray-600"
                      style={{ backgroundColor: color }}
                      title={color}
                      onClick={() => onChangeColor(color)}
                    >
                      {event.color === color && (
                        <Check className="absolute inset-0 m-auto h-4 w-4 text-white drop-shadow" />
                      )}
                    </button>
                  ))}
                </div>
              </ContextMenu.SubContent>
            </ContextMenu.Portal>
          </ContextMenu.Sub>

          <ContextMenu.Separator className="mx-2 my-1 h-px bg-gray-200 dark:bg-gray-700" />

          <ContextMenuItem
            action={() => deleteEvent(event.id)}
            Icon={Trash}
            text="Delete Event"
            isDelete
          />
        </>
      }
    >
      {children}
    </BaseContextMenu>
  );
}
