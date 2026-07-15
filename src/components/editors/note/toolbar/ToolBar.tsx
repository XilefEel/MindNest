import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  ChevronDown,
  Code2,
  Download,
  Heading,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Highlighter,
  ImagePlus,
  Italic,
  List,
  ListOrdered,
  ListTodo,
  Redo2,
  Strikethrough,
  TextQuote,
  Underline,
  Undo2,
  Youtube,
} from "lucide-react";
import ToolBarItem from "./ToolBarItem.tsx";
import { useCurrentEditor, useEditorState } from "@tiptap/react";
import { exportNoteToHTML } from "@/lib/utils/note";
import { useState } from "react";
import NoteToolbarPopover from "../../../popovers/NoteToolbarPopover.tsx";
import { useActiveBackgroundId } from "@/stores/useNestStore";
import { cn } from "@/lib/utils/general";
import NoteTemplatePopover from "@/components/popovers/NoteTemplatePopover.tsx";
import BasePopover from "@/components/popovers/BasePopover.tsx";
import ToolBarPopoverItem from "./ToolbarPopoverItem.tsx";
import ToolbarSeparator from "./ToolbarSeparator.tsx";

export default function ToolBar({ title }: { title: string }) {
  const activeBackgroundId = useActiveBackgroundId();

  const [showYoutubeDialog, setShowYoutubeDialog] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);

  const { editor } = useCurrentEditor();
  if (!editor) return null;

  const state = useEditorState({
    editor,
    selector: (ctx) => ({
      isBold: ctx.editor.isActive("bold"),
      isItalic: ctx.editor.isActive("italic"),
      isStrike: ctx.editor.isActive("strike"),
      isCode: ctx.editor.isActive("codeBlock"),
      isH1: ctx.editor.isActive("heading", { level: 1 }),
      isH2: ctx.editor.isActive("heading", { level: 2 }),
      isH3: ctx.editor.isActive("heading", { level: 3 }),
      isH4: ctx.editor.isActive("heading", { level: 4 }),
      isBlockquote: ctx.editor.isActive("blockquote"),
      isBulletList: ctx.editor.isActive("bulletList"),
      isOrderedList: ctx.editor.isActive("orderedList"),
      isTaskList: ctx.editor.isActive("taskList"),
      isAlignLeft: ctx.editor.isActive({ textAlign: "left" }),
      isAlignCenter: ctx.editor.isActive({ textAlign: "center" }),
      isAlignRight: ctx.editor.isActive({ textAlign: "right" }),
      isAlignJustify: ctx.editor.isActive({ textAlign: "justify" }),
    }),
  });

  return (
    <div
      className={cn(
        "sticky top-0 z-10 flex w-full flex-wrap gap-2 rounded-md bg-zinc-50/80 px-2 py-1 backdrop-blur-sm dark:bg-zinc-900/80",
        activeBackgroundId && "bg-white/50 dark:bg-black/50",
      )}
    >
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

      <ToolbarSeparator />

      <BasePopover
        width="w-36"
        padding="p-2"
        trigger={
          <button className="flex items-center rounded p-1 hover:text-teal-500 dark:hover:bg-zinc-700 dark:hover:text-white">
            <Heading className="size-4 shrink-0" />
            <ChevronDown className="size-3 shrink-0" />
          </button>
        }
        content={
          <div className="flex flex-col gap-0.5">
            <ToolBarPopoverItem
              Icon={Heading1}
              label="Heading 1"
              onFormat={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              isActive={state.isH1}
            />
            <ToolBarPopoverItem
              Icon={Heading2}
              label="Heading 2"
              onFormat={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              isActive={state.isH2}
            />
            <ToolBarPopoverItem
              Icon={Heading3}
              label="Heading 3"
              onFormat={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              isActive={state.isH3}
            />
            <ToolBarPopoverItem
              Icon={Heading4}
              label="Heading 4"
              onFormat={() =>
                editor.chain().focus().toggleHeading({ level: 4 }).run()
              }
              isActive={state.isH4}
            />
          </div>
        }
      />

      <BasePopover
        width="w-40"
        padding="p-2"
        trigger={
          <button className="flex items-center rounded p-1 hover:text-teal-500 dark:hover:bg-zinc-700 dark:hover:text-white">
            <List className="size-4 shrink-0" />
            <ChevronDown className="size-3 shrink-0" />
          </button>
        }
        content={
          <div className="flex flex-col gap-0.5">
            <ToolBarPopoverItem
              Icon={List}
              label="Unordered List"
              onFormat={() => editor.chain().focus().toggleBulletList().run()}
              isActive={state.isBulletList}
            />
            <ToolBarPopoverItem
              Icon={ListOrdered}
              label="Ordered List"
              onFormat={() => editor.chain().focus().toggleOrderedList().run()}
              isActive={state.isOrderedList}
            />
            <ToolBarPopoverItem
              Icon={ListTodo}
              label="Task List"
              onFormat={() => editor.chain().focus().toggleTaskList().run()}
              isActive={state.isTaskList}
            />
          </div>
        }
      />

      <ToolBarItem
        Icon={TextQuote}
        label="Quote"
        onFormat={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={state.isBlockquote}
      />

      <ToolBarItem
        Icon={Code2}
        label="Code"
        onFormat={() => editor.chain().focus().toggleCodeBlock().run()}
        isActive={state.isCode}
      />

      <ToolbarSeparator />

      <ToolBarItem
        Icon={Bold}
        label="Bold"
        onFormat={() => editor.chain().focus().toggleBold().run()}
        isActive={state.isBold}
      />
      <ToolBarItem
        Icon={Italic}
        label="Italic"
        onFormat={() => editor.chain().focus().toggleItalic().run()}
        isActive={state.isItalic}
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
        isActive={state.isStrike}
      />
      <ToolBarItem
        Icon={Highlighter}
        label="Highlight"
        onFormat={() => editor.chain().focus().toggleHighlight().run()}
      />

      <ToolbarSeparator />

      <BasePopover
        width="w-40"
        padding="p-2"
        trigger={
          <button className="flex items-center rounded p-1 hover:text-teal-500 dark:hover:bg-zinc-700 dark:hover:text-white">
            <AlignLeft className="size-4 shrink-0" />
            <ChevronDown className="size-3 shrink-0" />
          </button>
        }
        content={
          <div className="flex flex-col gap-0.5">
            <ToolBarPopoverItem
              Icon={AlignLeft}
              label="Align Left"
              onFormat={() => editor.chain().focus().setTextAlign("left").run()}
              isActive={state.isAlignLeft}
            />
            <ToolBarPopoverItem
              Icon={AlignCenter}
              label="Align Center"
              onFormat={() =>
                editor.chain().focus().setTextAlign("center").run()
              }
              isActive={state.isAlignCenter}
            />
            <ToolBarPopoverItem
              Icon={AlignRight}
              label="Align Right"
              onFormat={() =>
                editor.chain().focus().setTextAlign("right").run()
              }
              isActive={state.isAlignRight}
            />
            <ToolBarPopoverItem
              Icon={AlignJustify}
              label="Justify"
              onFormat={() =>
                editor.chain().focus().setTextAlign("justify").run()
              }
              isActive={state.isAlignJustify}
            />
          </div>
        }
      />

      <ToolbarSeparator />

      <NoteToolbarPopover
        editor={editor}
        type="image"
        isOpen={showImageDialog}
        setIsOpen={setShowImageDialog}
      >
        <button>
          <ToolBarItem Icon={ImagePlus} label="Add Image" />
        </button>
      </NoteToolbarPopover>

      <NoteToolbarPopover
        editor={editor}
        type="youtube"
        isOpen={showYoutubeDialog}
        setIsOpen={setShowYoutubeDialog}
      >
        <button>
          <ToolBarItem Icon={Youtube} label="Insert YouTube Link" />
        </button>
      </NoteToolbarPopover>

      <NoteTemplatePopover />

      <ToolbarSeparator />

      <ToolBarItem
        Icon={Download}
        label="Export as HTML"
        onFormat={() => exportNoteToHTML(editor, title)}
      />
    </div>
  );
}
