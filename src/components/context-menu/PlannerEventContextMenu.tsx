import { PlannerEventType } from "@/lib/types/calendar";
import { usePlannerActions } from "@/stores/usePlannerStore";
import { Copy, Trash } from "lucide-react";
import ContextMenuItem from "./ContextMenuItem";
import BaseContextMenu from "./BaseContextMenu";
import ContextMenuSeperator from "./ContextMenuSeparator";
import ColorPickerMenu from "./ColorPickerMenu";

export default function PlannerEventContextMenu({
  event,
  children,
}: {
  event: PlannerEventType;
  children: React.ReactNode;
}) {
  const { createEvent, updateEvent, deleteEvent } = usePlannerActions();

  const onDuplicate = () => createEvent(event);

  const onChangeColor = (color: string) => updateEvent(event.id, { color });

  return (
    <BaseContextMenu
      content={
        <>
          <ContextMenuItem
            action={onDuplicate}
            Icon={Copy}
            text="Duplicate Event"
          />

          <ColorPickerMenu element={event} handleChangeColor={onChangeColor} />

          <ContextMenuSeperator />

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
