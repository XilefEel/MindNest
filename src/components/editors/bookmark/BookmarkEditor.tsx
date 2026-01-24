import { useBookmarkActions, useBookmarks } from "@/stores/useBookmarkStore";
import {
  useActiveNestling,
  useNestlingActions,
} from "@/stores/useNestlingStore";
import { useEffect, useMemo, useState } from "react";
import NestlingTitle from "../NestlingTitle";
import useAutoSave from "@/hooks/useAutoSave";
import { Grid, List, Plus } from "lucide-react";
import BookmarkCard from "./BookmarkCard";
import { cn } from "@/lib/utils/general";
import BaseToolTip from "@/components/BaseToolTip";

export default function BookmarkEditor() {
  const activeNestling = useActiveNestling();
  if (!activeNestling) return null;

  const bookmarks = useBookmarks();
  const { getBookmarks, createBookmark, deleteBookmark } = useBookmarkActions();
  const { updateNestling } = useNestlingActions();

  const [title, setTitle] = useState(activeNestling.title);
  const [url, setUrl] = useState("");

  const [isAdding, setIsAdding] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");

  const nestlingData = useMemo(() => ({ title }), [title]);
  useAutoSave(activeNestling.id!, nestlingData, updateNestling);

  useEffect(() => {
    getBookmarks(activeNestling.id!);
  }, [getBookmarks, activeNestling]);

  const handleAddBookmark = async () => {
    if (!url.trim()) return;

    setIsAdding(true);
    try {
      await createBookmark(activeNestling.id!, url.trim());
      setUrl("");
    } catch (error) {
      console.error("Failed to add bookmark:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteBookmark(id);
    } catch (error) {
      console.error("Failed to delete bookmark:", error);
    }
  };

  return (
    <div className="space-y-4">
      <NestlingTitle
        title={title}
        setTitle={setTitle}
        nestling={activeNestling}
      />

      <div className="flex flex-row items-center justify-between">
        <div className="flex gap-2 text-sm">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste a URL..."
            className="w-100 rounded-lg border border-gray-300 bg-white px-4 py-1.5 focus:ring-2 focus:ring-teal-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:ring-teal-400"
            disabled={isAdding}
          />

          <button
            onClick={handleAddBookmark}
            disabled={isAdding || !url.trim()}
            className="flex cursor-pointer items-center justify-center gap-1 rounded-lg bg-teal-400 px-3 text-white transition hover:bg-teal-500 disabled:opacity-50 disabled:hover:bg-teal-400 dark:bg-teal-500 dark:hover:bg-teal-600 disabled:dark:bg-teal-500"
          >
            <Plus className="size-4" />
            {isAdding ? "Adding..." : "Add"}
          </button>
        </div>

        <div className="flex rounded border border-gray-200 bg-gray-100 p-1 dark:border-gray-700 dark:bg-gray-800">
          <BaseToolTip label="Grid View">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "rounded p-2 transition duration-100",
                viewMode === "grid"
                  ? "bg-white text-teal-600 shadow-sm dark:bg-teal-600 dark:text-white"
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
                  ? "bg-white text-teal-600 shadow-sm dark:bg-teal-600 dark:text-white"
                  : "text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700",
              )}
            >
              <List size={18} />
            </button>
          </BaseToolTip>
        </div>
      </div>

      {bookmarks.length === 0 && (
        <div className="py-12 text-center text-gray-400">
          No bookmarks yet. Add one above!
        </div>
      )}

      <div
        className={cn(
          "gap-4",
          viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-3"
            : "flex flex-col",
        )}
      >
        {bookmarks.map((bookmark) => (
          <BookmarkCard
            key={bookmark.id}
            bookmark={bookmark}
            viewMode={viewMode}
            handleDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
