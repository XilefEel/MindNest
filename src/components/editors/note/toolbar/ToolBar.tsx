import { Download, FilePen } from "lucide-react";
import ToolBarItem from "./ToolBarItem.tsx";
import { useCurrentEditor } from "@tiptap/react";
import { exportNoteToHTML } from "@/lib/utils/note";
import NoteTemplatePopover from "@/components/popovers/NoteTemplatePopover.tsx";
import BasePopover from "@/components/popovers/BasePopover.tsx";

export default function ToolBar({ title }: { title: string }) {
  const { editor } = useCurrentEditor();
  if (!editor) return null;

  return (
    <div className="flex flex-row gap-2">
      <BasePopover
        align="end"
        width="w-60"
        padding="p-2"
        trigger={
          <button>
            <ToolBarItem
              Icon={FilePen}
              label="Use Template"
              onFormat={() => {}}
            />
          </button>
        }
        content={<NoteTemplatePopover />}
      />

      <ToolBarItem
        Icon={Download}
        label="Export as HTML"
        onFormat={() => exportNoteToHTML(editor, title)}
      />
    </div>
  );
}
