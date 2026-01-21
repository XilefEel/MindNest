import { useCurrentEditor, useEditorState } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import {
  Bold,
  Italic,
  Strikethrough,
  Link,
  Highlighter,
  Heading1,
  Heading2,
  Heading3,
} from "lucide-react";
import ToolBarItem from "./ToolBarItem";
import { cn } from "@/lib/utils/general";
import { useActiveBackgroundId } from "@/stores/useNestStore";

export default function CustomBubbleMenu() {
  const activeBackgroundId = useActiveBackgroundId();
  const { editor } = useCurrentEditor();

  if (!editor) return null;

  const { isH1, isH2, isH3, isBold, isItalic, isStrike, isHighlight } =
    useEditorState({
      editor,
      selector: (ctx) => ({
        isH1: ctx.editor.isActive("heading", { level: 1 }),
        isH2: ctx.editor.isActive("heading", { level: 2 }),
        isH3: ctx.editor.isActive("heading", { level: 3 }),
        isBold: ctx.editor.isActive("bold"),
        isItalic: ctx.editor.isActive("italic"),
        isStrike: ctx.editor.isActive("strike"),
        isHighlight: ctx.editor.isActive("highlight"),
      }),
    });

  return (
    <BubbleMenu
      editor={editor}
      className={cn(
        "z-50 flex gap-1 rounded-lg border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-800",
        activeBackgroundId &&
          "border-none bg-white/30 backdrop-blur-sm dark:bg-black/30",
      )}
    >
      <ToolBarItem
        Icon={Heading1}
        label="Heading 1"
        onFormat={() =>
          editor.chain().focus().toggleHeading({ level: 1 }).run()
        }
        isActive={isH1}
      />
      <ToolBarItem
        Icon={Heading2}
        label="Heading 2"
        onFormat={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
        isActive={isH2}
      />
      <ToolBarItem
        Icon={Heading3}
        label="Heading 3"
        onFormat={() =>
          editor.chain().focus().toggleHeading({ level: 3 }).run()
        }
        isActive={isH3}
      />

      <div
        className={cn(
          "w-px rounded-full bg-gray-200 dark:bg-gray-700",
          activeBackgroundId && "bg-gray-900 dark:bg-gray-100",
        )}
      />

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

      <div
        className={cn(
          "w-px rounded-full bg-gray-200 dark:bg-gray-700",
          activeBackgroundId && "bg-gray-900 dark:bg-gray-100",
        )}
      />

      <ToolBarItem Icon={Link} label="Link" onFormat={() => {}} />
    </BubbleMenu>
  );
}
