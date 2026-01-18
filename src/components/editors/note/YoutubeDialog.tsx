import { Check, X, SquareArrowOutUpRight } from "lucide-react";
import { useState } from "react";
import { Editor } from "@tiptap/react";
import { openUrl } from "@tauri-apps/plugin-opener";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function YouTubeLinkDialog({
  editor,
  isOpen,
  setIsOpen,
  children,
}: {
  editor: Editor;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  children: React.ReactNode;
}) {
  const [linkUrl, setLinkUrl] = useState("");

  const handleInsert = () => {
    if (linkUrl.trim()) {
      editor.chain().focus().setYoutubeVideo({ src: linkUrl }).run();
      setIsOpen(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setLinkUrl("");
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="flex w-96 flex-row items-center justify-between rounded-full border border-gray-200 bg-white p-2 px-4 text-sm shadow-lg dark:border-gray-700 dark:bg-gray-800">
        <input
          value={linkUrl}
          onChange={(e) => setLinkUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleInsert();
            else if (e.key === "Escape") handleClose();
          }}
          placeholder="Paste YouTube URL..."
          className="flex-1 bg-transparent outline-none focus:outline-none dark:text-white dark:placeholder-gray-400"
          autoFocus
        />
        <div className="flex flex-row items-center gap-1 pl-3">
          <button
            onClick={handleInsert}
            disabled={!linkUrl.trim()}
            className="rounded p-1 text-gray-500 transition-all duration-150 hover:bg-gray-100 hover:text-teal-500 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-teal-400 dark:disabled:hover:bg-transparent dark:disabled:hover:text-gray-400"
          >
            <Check size={18} />
          </button>

          <div className="h-5 w-px bg-gray-200 dark:bg-gray-600" />

          <button
            onClick={() => linkUrl.trim() && openUrl(linkUrl)}
            disabled={!linkUrl.trim()}
            className="rounded p-1 text-gray-500 transition-all duration-150 hover:bg-gray-100 hover:text-blue-500 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-blue-400 dark:disabled:hover:bg-transparent dark:disabled:hover:text-gray-400"
          >
            <SquareArrowOutUpRight size={16} />
          </button>

          <button
            onClick={handleClose}
            className="rounded p-1 text-gray-500 transition-all duration-150 hover:bg-gray-100 hover:text-red-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-red-400"
          >
            <X size={16} />
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
