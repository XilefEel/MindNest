import { useCurrentEditor, useEditorState } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import { Bold, Italic, Strikethrough, Link, Highlighter } from "lucide-react";
import ToolBarItem from "./ToolBarItem";

export default function CustomBubbleMenu() {
  const { editor } = useCurrentEditor();

  if (!editor) return null;

  const { isBold, isItalic, isStrike, isHighlight } = useEditorState({
    editor,
    selector: (ctx) => ({
      isBold: ctx.editor.isActive("bold"),
      isItalic: ctx.editor.isActive("italic"),
      isStrike: ctx.editor.isActive("strike"),
      isHighlight: ctx.editor.isActive("highlight"),
    }),
  });

  return (
    <BubbleMenu
      editor={editor}
      className="flex gap-1 rounded-lg border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-800"
    >
      <ToolBarItem
        Icon={Bold}
        label="Bold"
        onFormat={() => editor.chain().focus().toggleBold().run()}
        isActive={isBold}
      />
      <ToolBarItem
        Icon={Italic}
        label="Italic"
        onFormat={() => editor.chain().focus().toggleItalic().run()}
        isActive={isItalic}
      />
      <ToolBarItem
        Icon={Strikethrough}
        label="Strikethrough"
        onFormat={() => editor.chain().focus().toggleStrike().run()}
        isActive={isStrike}
      />

      <ToolBarItem
        Icon={Highlighter}
        label="Highlight"
        onFormat={() => editor.chain().focus().toggleHighlight().run()}
        isActive={isHighlight}
      />

      <div className="w-px bg-gray-200 dark:bg-gray-700" />

      <ToolBarItem Icon={Link} label="Link" onFormat={() => {}} />
    </BubbleMenu>
  );
}
