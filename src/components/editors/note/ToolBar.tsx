import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Code2,
  Download,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  ImagePlus,
  Italic,
  Link,
  List,
  ListOrdered,
  Redo2,
  Strikethrough,
  TextQuote,
  Underline,
  Undo2,
  Youtube,
} from "lucide-react";
import ToolBarItem from "./ToolBarItem";
import { useCurrentEditor, useEditorState } from "@tiptap/react";
import { exportNoteToHTML } from "@/lib/utils/note";
import { useState } from "react";
import YouTubeLinkDialog from "./YoutubeDialog";
import BaseToolTip from "@/components/BaseToolTip";

export default function ToolBar({ title }: { title: string }) {
  const [showURLDialog, setShowURLDialog] = useState(false);

  const { editor } = useCurrentEditor();
  if (!editor) return null;

  const {
    isBold,
    isItalic,
    isStrike,
    isCode,
    isH1,
    isH2,
    isH3,
    isBlockquote,
    isBulletList,
    isOrderedList,
    isAlignLeft,
    isAlignCenter,
    isAlignRight,
    isAlignJustify,
  } = useEditorState({
    editor,
    selector: (ctx) => ({
      isBold: ctx.editor.isActive("bold"),
      isItalic: ctx.editor.isActive("italic"),
      isStrike: ctx.editor.isActive("strike"),
      isCode: ctx.editor.isActive("codeBlock"),
      isH1: ctx.editor.isActive("heading", { level: 1 }),
      isH2: ctx.editor.isActive("heading", { level: 2 }),
      isH3: ctx.editor.isActive("heading", { level: 3 }),
      isBlockquote: ctx.editor.isActive("blockquote"),
      isBulletList: ctx.editor.isActive("bulletList"),
      isOrderedList: ctx.editor.isActive("orderedList"),
      isAlignLeft: ctx.editor.isActive({ textAlign: "left" }),
      isAlignCenter: ctx.editor.isActive({ textAlign: "center" }),
      isAlignRight: ctx.editor.isActive({ textAlign: "right" }),
      isAlignJustify: ctx.editor.isActive({ textAlign: "justify" }),
    }),
  });

  return (
    <div className="flex gap-2 overflow-x-scroll md:overflow-x-hidden">
      <ToolBarItem
        Icon={Undo2}
        label="Undo"
        onFormat={() => editor.chain().focus().undo().run()}
      />
      <ToolBarItem
        Icon={Redo2}
        label="Redo"
        onFormat={() => editor.chain().focus().redo().run()}
      />

      <div className="w-px rounded-full bg-gray-200 dark:bg-gray-700" />

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
      <ToolBarItem
        Icon={TextQuote}
        label="Quote"
        onFormat={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={isBlockquote}
      />
      <ToolBarItem
        Icon={List}
        label="Unordered List"
        onFormat={() => editor.chain().focus().toggleBulletList().run()}
        isActive={isBulletList}
      />
      <ToolBarItem
        Icon={ListOrdered}
        label="Ordered List"
        onFormat={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={isOrderedList}
      />

      <div className="w-px rounded-full bg-gray-200 dark:bg-gray-700" />

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
        Icon={Underline}
        label="Underline"
        onFormat={() => editor.chain().focus().toggleUnderline().run()}
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
      />
      <ToolBarItem Icon={Link} label="Link" onFormat={() => {}} />
      <ToolBarItem
        Icon={Code2}
        label="Code"
        onFormat={() => editor.chain().focus().toggleCodeBlock().run()}
        isActive={isCode}
      />

      <div className="w-px rounded-full bg-gray-200 dark:bg-gray-700" />

      <ToolBarItem
        Icon={AlignLeft}
        label="Align Left"
        onFormat={() => editor.chain().focus().setTextAlign("left").run()}
        isActive={isAlignLeft}
      />
      <ToolBarItem
        Icon={AlignCenter}
        label="Align Center"
        onFormat={() => editor.chain().focus().setTextAlign("center").run()}
        isActive={isAlignCenter}
      />
      <ToolBarItem
        Icon={AlignRight}
        label="Align Right"
        onFormat={() => editor.chain().focus().setTextAlign("right").run()}
        isActive={isAlignRight}
      />
      <ToolBarItem
        Icon={AlignJustify}
        label="Justify"
        onFormat={() => editor.chain().focus().setTextAlign("justify").run()}
        isActive={isAlignJustify}
      />

      <div className="w-px rounded-full bg-gray-200 dark:bg-gray-700" />

      <ToolBarItem Icon={ImagePlus} label="Image" onFormat={() => {}} />

      <YouTubeLinkDialog
        editor={editor}
        isOpen={showURLDialog}
        setIsOpen={setShowURLDialog}
      >
        <button aria-label="Insert YouTube Link">
          <BaseToolTip label="Insert YouTube Link">
            <Youtube className="cursor-pointer rounded p-1 transition-all duration-200 hover:text-teal-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-teal-300" />
          </BaseToolTip>
        </button>
      </YouTubeLinkDialog>

      <ToolBarItem
        Icon={Download}
        label="Export as HTML"
        onFormat={() => exportNoteToHTML(editor, title)}
      />
    </div>
  );
}
