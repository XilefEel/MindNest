import { Check, Link, X } from "lucide-react";
import { useState } from "react";
import { Editor } from "@tiptap/react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useActiveBackgroundId } from "@/stores/useNestStore";
import { cn } from "@/lib/utils/general";

export default function NoteToolbarPopover({
  editor,
  type = "image",
  isOpen,
  setIsOpen,
  children,
}: {
  editor: Editor;
  type?: "image" | "youtube";
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  children: React.ReactNode;
}) {
  const activeBackgroundId = useActiveBackgroundId();

  const [linkUrl, setLinkUrl] = useState("");

  const handleInsert = () => {
    if (type === "image")
      editor.chain().focus().setImage({ src: linkUrl }).run();
    if (type === "youtube")
      editor.chain().focus().setYoutubeVideo({ src: linkUrl }).run();

    handleClose();
  };

  const handleClose = () => {
    setIsOpen(false);
    setLinkUrl("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleInsert();
    else if (e.key === "Escape") handleClose();
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        className={cn(
          "flex w-96 flex-row items-center justify-between rounded-full border border-gray-200 bg-white p-2 px-4 text-sm shadow-lg dark:border-gray-700 dark:bg-gray-800",
          activeBackgroundId &&
            "border-none bg-white/30 backdrop-blur-sm dark:bg-black/30",
        )}
      >
        <Link className="size-4 flex-shrink-0 text-gray-400" />

        <input
          value={linkUrl}
          onChange={(e) => setLinkUrl(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e)}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          placeholder={`Enter ${type === "image" ? "Image" : "YouTube"} Url...`}
          className="flex-1 bg-transparent pl-3 outline-none focus:outline-none dark:text-white dark:placeholder-gray-400"
          autoFocus
        />

        <div className="flex flex-row items-center gap-1 pl-3">
          <button
            onClick={handleInsert}
            disabled={
              !linkUrl.trim() ||
              (type === "image"
                ? !editor.can().setImage({ src: linkUrl })
                : !editor.can().setYoutubeVideo({ src: linkUrl }))
            }
            className={cn(
              "rounded p-1 text-gray-500 transition-colors hover:bg-teal-50 hover:text-teal-500 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-500 dark:text-gray-400 dark:hover:bg-teal-900/30 dark:hover:text-teal-400 dark:disabled:hover:bg-transparent dark:disabled:hover:text-gray-400",
              activeBackgroundId && "hover:bg-white/30 hover:dark:bg-black/30",
            )}
          >
            <Check className="size-4 flex-shrink-0" />
          </button>

          <button
            onClick={handleClose}
            className={cn(
              "rounded p-1 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-500 dark:text-gray-400 dark:hover:bg-red-900/30 dark:hover:text-red-400",
              activeBackgroundId && "hover:bg-white/30 hover:dark:bg-black/30",
            )}
          >
            <X className="size-4 flex-shrink-0" />
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
