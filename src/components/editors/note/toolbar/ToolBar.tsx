import { Download } from "lucide-react";
import ToolBarItem from "./ToolBarItem.tsx";
import { useCurrentEditor } from "@tiptap/react";
import { exportNoteToHTML } from "@/lib/utils/note";
import NoteTemplatePopover from "@/components/popovers/NoteTemplatePopover.tsx";

export default function ToolBar({ title }: { title: string }) {
  const { editor } = useCurrentEditor();
  if (!editor) return null;

  return (
    <div className="flex flex-row gap-2">
      <NoteTemplatePopover />

      <ToolBarItem
        Icon={Download}
        label="Export as HTML"
        onFormat={() => exportNoteToHTML(editor, title)}
      />
    </div>
  );
}
