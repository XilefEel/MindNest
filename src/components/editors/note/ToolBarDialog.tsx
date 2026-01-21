import { Check, X, SquareArrowOutUpRight } from "lucide-react";
import { useState } from "react";
import { Editor } from "@tiptap/react";
import { openUrl } from "@tauri-apps/plugin-opener";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useActiveBackgroundId } from "@/stores/useNestStore";
import { cn } from "@/lib/utils/general";

export default function YouTubeLinkDialog({
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
    if (linkUrl.trim()) {
      if (type === "image")
        editor.chain().focus().setImage({ src: linkUrl }).run();
      if (type === "youtube")
        editor.chain().focus().setYoutubeVideo({ src: linkUrl }).run();

      handleClose();
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setLinkUrl("");
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
        <input
          value={linkUrl}
          onChange={(e) => setLinkUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleInsert();
            else if (e.key === "Escape") handleClose();
          }}
          placeholder={`Enter ${type === "image" ? "Image" : "YouTube"} Url...`}
          className="flex-1 bg-transparent outline-none focus:outline-none dark:text-white dark:placeholder-gray-400"
          autoFocus
        />
        <div className="flex flex-row items-center gap-1 pl-3">
          <button
            onClick={handleInsert}
            disabled={!linkUrl.trim()}
            className={cn(
              "rounded p-1 text-gray-500 transition-all duration-150 hover:bg-gray-100 hover:text-teal-500 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-teal-400 dark:disabled:hover:bg-transparent dark:disabled:hover:text-gray-400",
              activeBackgroundId && "hover:bg-white/30 hover:dark:bg-black/30",
            )}
          >
            <Check size={18} />
          </button>

          <div className="h-5 w-px bg-gray-200 dark:bg-gray-600" />

          <button
            onClick={() => linkUrl.trim() && openUrl(linkUrl)}
            disabled={!linkUrl.trim()}
            className={cn(
              "rounded p-1 text-gray-500 transition-all duration-150 hover:bg-gray-100 hover:text-blue-500 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-blue-400 dark:disabled:hover:bg-transparent dark:disabled:hover:text-gray-400",
              activeBackgroundId && "hover:bg-white/30 hover:dark:bg-black/30",
            )}
          >
            <SquareArrowOutUpRight size={16} />
          </button>

          <button
            onClick={handleClose}
            className={cn(
              "rounded p-1 text-gray-500 transition-all duration-150 hover:bg-gray-100 hover:text-red-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-red-400",
              activeBackgroundId && "hover:bg-white/30 hover:dark:bg-black/30",
            )}
          >
            <X size={16} />
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
