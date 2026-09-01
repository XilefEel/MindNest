import { exportBookmarksToJson } from "@/lib/utils/bookmark";
import { cn } from "@/lib/utils/general";
import { useActiveBackgroundId } from "@/stores/useNestStore";
import { openUrl } from "@tauri-apps/plugin-opener";
import { ExternalLink, Download, Search, BookmarkPlus } from "lucide-react";
import ViewToggle from "../gallery/ViewToggle";
import BookmarkPopover from "../../popovers/BookmarkPopover";
import { useState } from "react";
import { useBookmarks } from "@/stores/useBookmarkStore";
import IconButton from "@/components/ui/icon-button";

export default function BookmarkToolbar({
  title,
  viewMode,
  searchQuery,
  setViewMode,
  setSearchQuery,
  handleAddBookmark,
}: {
  title: string;
  viewMode: "grid" | "list";
  searchQuery: string;
  setViewMode: (viewMode: "grid" | "list") => void;
  setSearchQuery: (query: string) => void;
  handleAddBookmark: (url: string) => void;
}) {
  const activeBackgroundId = useActiveBackgroundId();
  const bookmarks = useBookmarks();
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenAll = () => {
    bookmarks.forEach((b) => openUrl(b.url));
  };

  return (
    <div className="flex flex-row items-center justify-between gap-2">
      <div className="flex flex-1 text-sm">
        <div className="relative w-full md:w-87.5">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            placeholder="Search..."
            className={cn(
              "w-full rounded-lg border border-zinc-300 bg-white py-1.5 pr-4 pl-9 shadow-sm focus:ring-2 focus:ring-teal-500 focus:outline-none dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-400 dark:focus:ring-teal-400",
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
            <IconButton
              label="Add Bookmark"
              Icon={BookmarkPlus}
              onClick={() => setIsOpen(true)}
            />
          </div>
        </BookmarkPopover>

        <IconButton
          label={`Open All (${bookmarks.length})`}
          Icon={ExternalLink}
          onClick={handleOpenAll}
          disabled={bookmarks.length === 0}
        />

        <IconButton
          label="Export to JSON"
          Icon={Download}
          onClick={() => exportBookmarksToJson(bookmarks, title)}
          disabled={bookmarks.length === 0}
        />

        <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
      </div>
    </div>
  );
}
