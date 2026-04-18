import BaseToolTip from "@/components/BaseToolTip";
import { Bookmark } from "@/lib/types/bookmark";
import { exportBookmarksToJson } from "@/lib/utils/bookmark";
import { cn } from "@/lib/utils/general";
import { useActiveBackgroundId } from "@/stores/useNestStore";
import { openUrl } from "@tauri-apps/plugin-opener";
import { ExternalLink, Download, Search, BookmarkPlus } from "lucide-react";
import ViewToggle from "../gallery/ViewToggle";
import BookmarkPopover from "./BookmarkPopover";
import { useState } from "react";

export default function BookmarkToolbar({
  title,
  bookmarks,
  viewMode,
  searchQuery,
  setViewMode,
  setSearchQuery,
  handleAddBookmark,
}: {
  title: string;
  bookmarks: Bookmark[];
  viewMode: "grid" | "list";
  searchQuery: string;
  setViewMode: (viewMode: "grid" | "list") => void;
  setSearchQuery: (query: string) => void;
  handleAddBookmark: (url: string) => void;
}) {
  const activeBackgroundId = useActiveBackgroundId();
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenAll = () => {
    bookmarks.forEach((b) => openUrl(b.url));
  };

  return (
    <div className="flex flex-row items-center justify-between gap-2">
      <div className="flex flex-1 text-sm">
        <div className="relative w-full md:w-[350px]">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            placeholder="Search..."
            className={cn(
              "w-full rounded-lg border border-gray-300 bg-white py-1.5 pr-4 pl-9 shadow-sm focus:ring-2 focus:ring-teal-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:ring-teal-400",
              activeBackgroundId &&
                "border-transparent bg-white/10 backdrop-blur-sm dark:border-transparent dark:bg-black/10",
            )}
          />
        </div>
      </div>

      <div className="flex flex-row items-center gap-1">
        <BookmarkPopover
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          handleAddBookmark={handleAddBookmark}
        >
          <div>
            <BaseToolTip label="Add Bookmark">
              <button
                className={cn(
                  "rounded p-2 transition-colors",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 dark:focus-visible:ring-teal-300",
                  "hover:bg-gray-100 hover:text-teal-500 dark:hover:bg-gray-700 dark:hover:text-teal-400",
                  "disabled:cursor-default disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-current dark:disabled:cursor-default dark:disabled:opacity-50 dark:disabled:hover:bg-transparent dark:disabled:hover:text-current",
                  activeBackgroundId &&
                    "hover:bg-white/30 hover:text-black dark:hover:bg-black/30",
                )}
              >
                <BookmarkPlus className="size-4 flex-shrink-0" />
              </button>
            </BaseToolTip>
          </div>
        </BookmarkPopover>

        <BaseToolTip label={`Open All (${bookmarks.length})`}>
          <button
            onClick={handleOpenAll}
            disabled={bookmarks.length === 0}
            className={cn(
              "rounded p-2 transition-colors",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 dark:focus-visible:ring-teal-300",
              "hover:bg-gray-100 hover:text-teal-500 dark:hover:bg-gray-700 dark:hover:text-teal-400",
              "disabled:cursor-default disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-current dark:disabled:cursor-default dark:disabled:opacity-50 dark:disabled:hover:bg-transparent dark:disabled:hover:text-current",
              activeBackgroundId &&
                "hover:bg-white/30 hover:text-black dark:hover:bg-black/30",
            )}
          >
            <ExternalLink className="size-4 flex-shrink-0" />
          </button>
        </BaseToolTip>

        <BaseToolTip label="Export to JSON">
          <button
            onClick={() => exportBookmarksToJson(bookmarks, title)}
            disabled={bookmarks.length === 0}
            className={cn(
              "rounded p-2 transition-colors",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 dark:focus-visible:ring-teal-300",
              "hover:bg-gray-100 hover:text-teal-500 dark:hover:bg-gray-700 dark:hover:text-teal-400",
              "disabled:cursor-default disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-current dark:disabled:cursor-default dark:disabled:opacity-50 dark:disabled:hover:bg-transparent dark:disabled:hover:text-current",
              activeBackgroundId &&
                "hover:bg-white/30 hover:text-black dark:hover:bg-black/30",
            )}
          >
            <Download className="size-4 flex-shrink-0" />
          </button>
        </BaseToolTip>

        <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
      </div>
    </div>
  );
}
