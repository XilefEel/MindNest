import { Download, EllipsisVertical, FilePen } from "lucide-react";
import ToolBarItem from "./ToolBarItem.tsx";
import { useCurrentEditor } from "@tiptap/react";
import { exportNoteToHTML } from "@/lib/utils/note";
import NoteTemplatePopover from "@/components/popovers/NoteTemplatePopover.tsx";
import BasePopover from "@/components/popovers/BasePopover.tsx";
import { cn } from "@/lib/utils/general.ts";
import { useActiveBackgroundId } from "@/stores/useNestStore.tsx";

export default function ToolBar({ title }: { title: string }) {
  const activeBackgroundId = useActiveBackgroundId();
  const { editor } = useCurrentEditor();
  if (!editor) return null;

  return (
    <BasePopover
      align="end"
      width="w-60"
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
          <BasePopover
            side="left"
            align="start"
            width="w-60"
            padding="p-2"
            trigger={
              <button
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-zinc-50 disabled:opacity-40 dark:hover:bg-zinc-700/50",
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
