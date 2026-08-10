import { Editor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Highlighter,
  LinkIcon,
  Check,
  Trash2,
} from "lucide-react";
import ToolBarItem from "./ToolBarItem";
import { useActiveBackgroundId } from "@/stores/useNestStore";
import { cn } from "@/lib/utils/general";
import { useEffect, useState } from "react";

export default function SelectionBubbleMenu({ editor }: { editor: Editor }) {
  const activeBackgroundId = useActiveBackgroundId();
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  const openLinkInput = () => {
    const existing = editor.getAttributes("link").href;
    setLinkUrl(existing || "");
    setShowLinkInput(true);
  };

  const applyLink = () => {
    if (linkUrl.trim() === "") {
      editor.chain().focus().unsetLink().run();
    } else {
      editor.chain().focus().setLink({ href: linkUrl.trim() }).run();
    }
    setShowLinkInput(false);
    setLinkUrl("");
  };

  useEffect(() => {
    if (!editor) return;
    const resetLinkInput = () => setShowLinkInput(false);

    editor.on("selectionUpdate", resetLinkInput);
    return () => {
      editor.off("selectionUpdate", resetLinkInput);
    };
  }, [editor]);

  return (
    <BubbleMenu
      editor={editor}
      options={{ offset: 6, placement: "top" }}
      shouldShow={({ editor, state }) => {
        const { from, to } = state.selection;
        return from !== to && !editor.isActive("codeBlock");
      }}
      className={cn(
        "flex items-center gap-1 rounded-md border border-zinc-200 bg-white p-1 shadow-md dark:border-zinc-700 dark:bg-zinc-800",
        activeBackgroundId &&
          "border-0 bg-white/50 backdrop-blur-sm dark:bg-black/30",
      )}
    >
      {showLinkInput ? (
        <div className="flex items-center gap-1 px-1">
          <input
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") applyLink();
              if (e.key === "Escape") setShowLinkInput(false);
            }}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            placeholder="Paste a link..."
            className="w-48 px-2 py-1 text-sm outline-none"
            autoFocus
          />

          <div className="flex flex-row items-center gap-1">
            <button
              onClick={applyLink}
              className={cn(
                "rounded p-1 text-zinc-500 transition-colors hover:bg-teal-50 hover:text-teal-500 dark:text-zinc-400 dark:hover:bg-teal-900/30 dark:hover:text-teal-400",
                activeBackgroundId && "hover:bg-black/5 dark:hover:bg-white/5",
              )}
            >
              <Check className="size-4 shrink-0" />
            </button>

            <button
              onClick={() => {
                editor.chain().focus().unsetLink().run();
                setShowLinkInput(false);
              }}
              className={cn(
                "rounded p-1 text-zinc-500 transition-colors hover:bg-red-50 hover:text-red-500 dark:text-zinc-400 dark:hover:bg-red-900/30 dark:hover:text-red-400",
                activeBackgroundId && "hover:bg-black/5 dark:hover:bg-white/5",
              )}
            >
              <Trash2 className="size-4 shrink-0" />
            </button>
          </div>
        </div>
      ) : (
        <>
          <ToolBarItem
            Icon={Bold}
            label="Bold"
            onFormat={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
          />
          <ToolBarItem
            Icon={Italic}
            label="Italic"
            onFormat={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
          />
          <ToolBarItem
            Icon={Underline}
            label="Underline"
            onFormat={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive("underline")}
          />
          <ToolBarItem
            Icon={Strikethrough}
            label="Strikethrough"
            onFormat={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive("strike")}
          />
          <ToolBarItem
            Icon={Highlighter}
            label="Highlight"
            onFormat={() => editor.chain().focus().toggleHighlight().run()}
            isActive={editor.isActive("highlight")}
          />
          <ToolBarItem
            Icon={LinkIcon}
            label="Link"
            onFormat={openLinkInput}
            isActive={editor.isActive("link")}
          />
        </>
      )}
    </BubbleMenu>
  );
}
