import { Download, EllipsisVertical, FilePen } from "lucide-react";
import ToolBarItem from "./ToolBarItem.tsx";
import { useCurrentEditor } from "@tiptap/react";
import { exportNoteToHTML } from "@/lib/utils/note";
import NoteTemplatePopover from "@/components/popovers/NoteTemplatePopover.tsx";
import BasePopover from "@/components/popovers/BasePopover.tsx";
import { cn } from "@/lib/utils/general.ts";
import { useActiveBackgroundId } from "@/stores/useNestStore.tsx";
import {
  useNoteFontSize,
  useNoteWidth,
  useSettingsActions,
} from "@/stores/useSettingsStore.tsx";

const TEXT_SIZES = [
  { label: "S", value: "sm" },
  { label: "M", value: "base" },
  { label: "L", value: "lg" },
];

const NOTE_WIDTHS = [
  { label: "Narrow", value: "narrow" },
  { label: "Normal", value: "normal" },
  { label: "Wide", value: "wide" },
];

export default function ToolBar({ title }: { title: string }) {
  const activeBackgroundId = useActiveBackgroundId();
  const { editor } = useCurrentEditor();

  const { setSetting } = useSettingsActions();
  const noteFontSize = useNoteFontSize();
  const noteWidth = useNoteWidth();

  if (!editor) return null;

  return (
    <BasePopover
      align="end"
      width="w-75"
      padding="p-2"
      trigger={
        <div>
          <ToolBarItem
            Icon={EllipsisVertical}
            label="More Options"
            onFormat={() => {}}
          />
        </div>
      }
      content={
        <div className="flex flex-col text-zinc-800 dark:text-zinc-200">
          <ButtonGroup
            label="Font Size"
            options={TEXT_SIZES}
            value={noteFontSize}
            onChange={(value) =>
              setSetting("noteFontSize", value as "sm" | "base" | "lg")
            }
          />

          <ButtonGroup
            label="Note Width"
            options={NOTE_WIDTHS}
            value={noteWidth}
            onChange={(value) =>
              setSetting("noteWidth", value as "narrow" | "normal" | "wide")
            }
          />

          <div className="my-2 border-t border-zinc-200 dark:border-zinc-700" />

          <BasePopover
            side="left"
            align="start"
            width="w-60"
            padding="p-2"
            trigger={
              <button
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-2 py-1 text-sm transition-colors hover:bg-zinc-50 disabled:opacity-40 dark:hover:bg-zinc-700/50",
                  activeBackgroundId &&
                    "hover:bg-black/5 dark:hover:bg-white/5",
                )}
              >
                <FilePen className="size-4 shrink-0" />
                <span className="text-sm leading-tight">Use Template</span>
              </button>
            }
            content={<NoteTemplatePopover />}
          />

          <button
            onClick={() => exportNoteToHTML(editor, title)}
            className={cn(
              "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-zinc-50 disabled:opacity-40 dark:hover:bg-zinc-700/50",
              activeBackgroundId && "hover:bg-black/5 dark:hover:bg-white/5",
            )}
          >
            <Download className="size-4 shrink-0" />
            <span className="text-sm leading-tight">Export as HTML</span>
          </button>
        </div>
      }
    />
  );
}

function ButtonGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex items-center justify-between px-2 py-1">
      <span className="text-sm leading-tight">{label}</span>

      <div className="flex overflow-hidden rounded-md border border-zinc-200 dark:border-zinc-700">
        {options.map(({ label, value: optionValue }) => (
          <button
            key={optionValue}
            onClick={() => onChange(optionValue)}
            className={cn(
              "px-2 py-1 text-xs transition-colors",
              value === optionValue
                ? "bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400"
                : "hover:bg-zinc-50 dark:hover:bg-zinc-700/50",
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
