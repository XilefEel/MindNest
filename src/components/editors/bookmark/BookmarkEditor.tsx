import { useBookmarkActions, useBookmarks } from "@/stores/useBookmarkStore";
import {
  useActiveNestling,
  useNestlingActions,
} from "@/stores/useNestlingStore";
import { useEffect, useMemo, useState } from "react";
import NestlingTitle from "../NestlingTitle";
import useAutoSave from "@/hooks/useAutoSave";
import BookmarkCard from "./BookmarkCard";
import { cn } from "@/lib/utils/general";
import { toast } from "@/lib/utils/toast";
import BookmarkToolbar from "./BookmarkToolbar";

export default function BookmarkEditor() {
  const activeNestling = useActiveNestling();
  if (!activeNestling) return null;

  const bookmarks = useBookmarks();
  const { getBookmarks, createBookmark } = useBookmarkActions();
  const { updateNestling } = useNestlingActions();

  const [title, setTitle] = useState(activeNestling.title);
  const [url, setUrl] = useState("");

  const [isAdding, setIsAdding] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const [isDragging, setIsDragging] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBookmarks = useMemo(() => {
    if (!searchQuery) return bookmarks;

    const query = searchQuery.toLowerCase();
    return bookmarks.filter(
      (b) =>
        b.title?.toLowerCase().includes(query) ||
        b.description?.toLowerCase().includes(query) ||
        b.url?.toLowerCase().includes(query),
    );
  }, [bookmarks, searchQuery]);

  const nestlingData = useMemo(() => ({ title }), [title]);
  useAutoSave(activeNestling.id!, nestlingData, updateNestling);

  const handleAddBookmark = async (url: string) => {
    if (!url.trim()) return;

    setIsAdding(true);
    try {
      await createBookmark(activeNestling.id!, url.trim());
      setUrl("");
      toast.success("Bookmark added!");
    } catch (error) {
      toast.error("Failed to add bookmark.");
    } finally {
      setIsAdding(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedUrl =
      e.dataTransfer.getData("text/uri-list") ||
      e.dataTransfer.getData("text/plain");

    if (droppedUrl && droppedUrl.startsWith("http")) {
      handleAddBookmark(droppedUrl);
    }
  };

  useEffect(() => {
    getBookmarks(activeNestling.id);
  }, [getBookmarks, activeNestling.id]);

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="space-y-4"
    >
      <NestlingTitle
        title={title}
        setTitle={setTitle}
        nestling={activeNestling}
      />

      <BookmarkToolbar
        title={activeNestling.title}
        bookmarks={bookmarks}
        url={url}
        isAdding={isAdding}
        viewMode={viewMode}
        searchQuery={searchQuery}
        setUrl={setUrl}
        setViewMode={setViewMode}
        handleAddBookmark={handleAddBookmark}
        setSearchQuery={setSearchQuery}
      />

      <div
        className={cn(
          isDragging && "h-full rounded-lg outline-teal-500 outline-dashed",
        )}
      >
        {bookmarks.length === 0 && (
          <div className="py-12 text-center text-gray-400">
            No bookmarks yet. Add one above!
          </div>
        )}

        {filteredBookmarks.length === 0 && searchQuery && (
          <div className="py-12 text-center text-gray-400">
            No bookmarks found for "{searchQuery}"
          </div>
        )}

        <div
          className={cn(
            "gap-4",
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : "flex flex-col",
          )}
        >
          {filteredBookmarks.map((bookmark) => (
            <BookmarkCard
              key={bookmark.id}
              bookmark={bookmark}
              viewMode={viewMode}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
