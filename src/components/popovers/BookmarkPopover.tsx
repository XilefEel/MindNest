import { Check, Link, X } from "lucide-react";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useActiveBackgroundId } from "@/stores/useNestStore";
import { cn } from "@/lib/utils/general";

export default function BookmarkPopover({
  isOpen,
  setIsOpen,
  handleAddBookmark,
  children,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  handleAddBookmark: (url: string) => void;
  children: React.ReactNode;
}) {
  const activeBackgroundId = useActiveBackgroundId();

  const [url, setUrl] = useState("");

  const handleAdd = () => {
    handleAddBookmark(url);
    handleClose();
  };

  const handleClose = () => {
    setIsOpen(false);
    setUrl("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleAdd();
    else if (e.key === "Escape") handleClose();
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        align="end"
        className={cn(
          "flex w-90 flex-row items-center justify-between rounded-full border border-gray-200 bg-white p-2 px-4 text-sm shadow-lg dark:border-zinc-700 dark:bg-zinc-800",
          activeBackgroundId &&
            "border-none bg-white/30 backdrop-blur-sm dark:bg-black/30",
        )}
      >
        <Link className="size-4 flex-shrink-0 text-gray-400" />

        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e)}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          placeholder="Paste a URL..."
          className="flex-1 bg-transparent pl-3 outline-none focus:outline-none dark:text-white dark:placeholder-gray-400"
          autoFocus
        />

        <div className="flex flex-row items-center gap-1 pl-3">
          <button
            onClick={handleAdd}
            disabled={!url.trim()}
            className={cn(
              "rounded p-1 text-gray-500 transition-colors hover:bg-teal-50 hover:text-teal-500 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-500 dark:text-zinc-400 dark:hover:bg-teal-900/30 dark:hover:text-teal-400 dark:disabled:hover:bg-transparent dark:disabled:hover:text-gray-400",
              activeBackgroundId && "hover:bg-black/5 dark:hover:bg-white/5",
            )}
          >
            <Check className="size-4 flex-shrink-0" />
          </button>

          <button
            onClick={handleClose}
            className={cn(
              "rounded p-1 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-500 dark:text-zinc-400 dark:hover:bg-red-900/30 dark:hover:text-red-400",
              activeBackgroundId && "hover:bg-black/5 dark:hover:bg-white/5",
            )}
          >
            <X className="size-4 flex-shrink-0" />
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
