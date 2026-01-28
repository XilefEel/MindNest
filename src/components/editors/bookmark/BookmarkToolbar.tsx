import BaseToolTip from "@/components/BaseToolTip";
import { Bookmark } from "@/lib/types/bookmark";
import { exportBookmarksToJson } from "@/lib/utils/bookmark";
import { cn } from "@/lib/utils/general";
import { useActiveBackgroundId } from "@/stores/useNestStore";
import { openUrl } from "@tauri-apps/plugin-opener";
import {
  Plus,
  ExternalLink,
  Download,
  Grid,
  List,
  Search,
  Link,
} from "lucide-react";

export default function BookmarkToolbar({
  title,
  bookmarks,
  url,
  isAdding,
  viewMode,
  searchQuery,
  setUrl,
  setViewMode,
  handleAddBookmark,
  setSearchQuery,
}: {
  title: string;
  bookmarks: Bookmark[];
  url: string;
  isAdding: boolean;
  viewMode: "grid" | "list";
  searchQuery: string;
  setUrl: (url: string) => void;
  setViewMode: (viewMode: "grid" | "list") => void;
  handleAddBookmark: (url: string) => void;
  setSearchQuery: (query: string) => void;
}) {
  const activeBackgroundId = useActiveBackgroundId();

  const handleOpenAll = () => {
    bookmarks.forEach((b) => openUrl(b.url));
  };

  return (
    <div className="flex flex-col flex-wrap gap-2 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-col flex-wrap gap-2 text-sm md:flex-1 md:flex-row md:justify-between">
        <div className="flex gap-2">
          <div className="relative w-full md:w-[300px]">
            <Link className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste a URL..."
              className={cn(
                "w-full rounded-lg border border-gray-300 bg-white py-1.5 pr-4 pl-9 shadow-sm focus:ring-2 focus:ring-teal-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:ring-teal-400",
                activeBackgroundId &&
                  "border-0 bg-white/10 backdrop-blur-sm dark:bg-black/10",
              )}
              disabled={isAdding}
            />
          </div>

          <button
            onClick={() => handleAddBookmark(url)}
            disabled={isAdding || !url.trim()}
            className="flex cursor-pointer items-center justify-center gap-1 rounded-lg bg-teal-400 px-3 text-white shadow-sm transition hover:bg-teal-500 disabled:cursor-default disabled:opacity-50 disabled:hover:bg-teal-400 dark:bg-teal-500 dark:hover:bg-teal-600 disabled:dark:bg-teal-500"
          >
            <Plus className="size-4" />
            {isAdding ? "Adding..." : "Add"}
          </button>
        </div>

        <div className="relative w-full md:w-[200px]">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className={cn(
              "w-full rounded-lg border border-gray-300 bg-white py-1.5 pr-4 pl-9 shadow-sm focus:ring-2 focus:ring-teal-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:ring-teal-400",
              activeBackgroundId &&
                "border-0 bg-white/10 backdrop-blur-sm dark:bg-black/10",
            )}
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-1">
        <BaseToolTip label="Open All">
          <button
            onClick={handleOpenAll}
            disabled={bookmarks.length === 0}
            className={cn(
              "cursor-pointer rounded p-2 transition-all duration-200",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 dark:focus-visible:ring-teal-300",
              "hover:bg-gray-100 hover:text-teal-500 dark:hover:bg-gray-700 dark:hover:text-teal-400",
              "disabled:cursor-default disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-current dark:disabled:cursor-default dark:disabled:opacity-50 dark:disabled:hover:bg-transparent dark:disabled:hover:text-current",
              activeBackgroundId &&
                "hover:bg-white/30 hover:text-black dark:hover:bg-black/30",
            )}
          >
            <ExternalLink className="size-4" />
          </button>
        </BaseToolTip>

        <BaseToolTip label="Export to JSON">
          <button
            onClick={() => exportBookmarksToJson(bookmarks, title)}
            disabled={bookmarks.length === 0}
            className={cn(
              "cursor-pointer rounded p-2 transition-all duration-200",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 dark:focus-visible:ring-teal-300",
              "hover:bg-gray-100 hover:text-teal-500 dark:hover:bg-gray-700 dark:hover:text-teal-400",
              "disabled:cursor-default disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-current dark:disabled:cursor-default dark:disabled:opacity-50 dark:disabled:hover:bg-transparent dark:disabled:hover:text-current",
              activeBackgroundId &&
                "hover:bg-white/30 hover:text-black dark:hover:bg-black/30",
            )}
          >
            <Download className="size-4" />
          </button>
        </BaseToolTip>

        <div className="flex rounded border border-gray-200 bg-gray-100 p-1 dark:border-gray-700 dark:bg-gray-800">
          <BaseToolTip label="Grid View">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "rounded p-2 transition duration-100",
                viewMode === "grid"
                  ? "bg-white text-teal-600 shadow-sm dark:bg-teal-500 dark:text-white"
                  : "text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700",
              )}
            >
              <Grid size={18} />
            </button>
          </BaseToolTip>

          <BaseToolTip label="List View">
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "rounded p-2 transition duration-100",
                viewMode === "list"
                  ? "bg-white text-teal-600 shadow-sm dark:bg-teal-500 dark:text-white"
                  : "text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700",
              )}
            >
              <List size={18} />
            </button>
          </BaseToolTip>
        </div>
      </div>
    </div>
  );
}
