import { PlannerEventType } from "@/lib/types/calendar";
import { usePlannerActions } from "@/stores/usePlannerStore";
import { Copy, CopyPlus, Trash } from "lucide-react";
import ContextMenuItem from "./ContextMenuItem";
import BaseContextMenu from "./BaseContextMenu";
import ContextMenuSeperator from "./ContextMenuSeparator";
import ColorPickerMenu from "./ColorPickerMenu";
import { addDaysToDate } from "@/lib/utils/date.ts";

export default function PlannerEventContextMenu({
  event,
  children,
}: {
  event: PlannerEventType;
  children: React.ReactNode;
}) {
  const { createEvent, updateEvent, deleteEvent } = usePlannerActions();

  const onDuplicate = async () => {
    const newEvent = {
      ...event,
      date: addDaysToDate(event.date, 1),
    };

    await createEvent(newEvent);
  };

  const onDuplicateToNextWeek = async () => {
    const newEvent = {
      ...event,
      date: addDaysToDate(event.date, 7),
    };

    await createEvent(newEvent);
  };

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

          <ContextMenuItem
            action={onDuplicateToNextWeek}
            Icon={CopyPlus}
            text="Duplicate to Next Week"
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
