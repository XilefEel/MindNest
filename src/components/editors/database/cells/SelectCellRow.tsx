import BasePopover from "@/components/popovers/BasePopover";
import EditSelectOptionPopover from "@/components/popovers/EditSelectOptionPopover";
import { GripVertical, Check, Ellipsis } from "lucide-react";
import SelectOptionPill from "./SelectOptionPill";
import { DbSelectOption } from "@/lib/types/database";
import { useSortable } from "@dnd-kit/react/sortable";

export default function SelectCellRow({
  option,
  selected,
  index,
  handleSelect,
}: {
  option: DbSelectOption;
  selected: DbSelectOption | null;
  index: number;
  handleSelect: (optionId: number) => void;
}) {
  const { ref, handleRef } = useSortable({ id: `option-${option.id}`, index });

  return (
    <div
      ref={ref}
      onClick={() => handleSelect(option.id)}
      className="flex items-center gap-1 rounded-lg p-1.5 transition-[background] hover:bg-zinc-100 dark:hover:bg-zinc-700/50"
    >
      <div className="flex items-center gap-2">
        <GripVertical
          ref={handleRef}
          onClick={(e) => e.stopPropagation()}
          className="size-4 shrink-0 cursor-grab text-zinc-400 dark:text-zinc-500"
        />

        <SelectOptionPill option={option} />

        {selected?.id === option.id && (
          <Check className="size-4 shrink-0 text-teal-500" />
        )}
      </div>

      <BasePopover
        width="w-60"
        side="right"
        trigger={
          <button
            onClick={(e) => e.stopPropagation()}
            className="ml-auto rounded-lg p-1 transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-700"
          >
            <Ellipsis className="size-4 shrink-0 text-zinc-400 dark:text-zinc-500" />
          </button>
        }
        content={<EditSelectOptionPopover option={option} />}
      />
    </div>
  );
}
