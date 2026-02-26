import BookmarkContextMenu from "@/components/context-menu/BookmarkContextMenu";
import { Bookmark } from "@/lib/types/bookmark";
import { cn } from "@/lib/utils/general";
import { toast } from "@/lib/utils/toast";
import { useBookmarkActions } from "@/stores/useBookmarkStore";
import { useActiveBackgroundId } from "@/stores/useNestStore";
import { Star, Trash2 } from "lucide-react";

export default function BookmarkCard({
  bookmark,
  viewMode,
}: {
  bookmark: Bookmark;
  viewMode: "list" | "grid";
}) {
  const activeBackgroundId = useActiveBackgroundId();

  const { deleteBookmark, toggleBookmarkFavorite } = useBookmarkActions();

  const handleDelete = async (id: number) => {
    try {
      toast.success("Bookmark deleted!");
      await deleteBookmark(id);
    } catch (error) {
      toast.error("Failed to delete bookmark");
      console.error("Failed to delete bookmark:", error);
    }
  };

  const handleToggleFavorite = async (id: number) => {
    try {
      await toggleBookmarkFavorite(id);
    } catch (error) {
      toast.error("Failed to toggle bookmark favorite");
      console.error("Failed to toggle bookmark favorite:", error);
    }
  };

  if (viewMode === "grid") {
    return (
      <BookmarkContextMenu
        bookmark={bookmark}
        handleDelete={handleDelete}
        handleToggleFavorite={handleToggleFavorite}
      >
        <div
          className={cn(
            "group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm hover:border-teal-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-teal-600",
            activeBackgroundId &&
              "border-0 bg-white/30 backdrop-blur-sm dark:bg-black/30",
          )}
        >
          {bookmark.imageUrl ? (
            <div className="aspect-video w-full overflow-hidden bg-gray-100 dark:bg-gray-700">
              <img
                src={bookmark.imageUrl}
                alt={bookmark.title || "Bookmark"}
                loading="lazy"
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            </div>
          ) : (
            <div className="aspect-video w-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800" />
          )}

          <div className="w-full p-4">
            <div className="flex flex-col gap-1.5">
              <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="line-clamp-2 font-semibold text-gray-900 transition hover:text-teal-500 dark:text-gray-100 dark:hover:text-teal-400"
              >
                {bookmark.title || bookmark.url}
              </a>

              {bookmark.description && (
                <p className="line-clamp-3 w-full text-sm text-gray-600 dark:text-gray-400">
                  {bookmark.description}
                </p>
              )}
              <p className="mt-3 truncate text-xs text-gray-400 dark:text-gray-500">
                {new URL(bookmark.url).hostname}
              </p>
            </div>
          </div>

          <button
            onClick={() => handleToggleFavorite(bookmark.id)}
            className={cn(
              "absolute top-2 left-2 rounded-full p-2 shadow-md transition-colors",
              bookmark.isFavorite
                ? "bg-yellow-400 opacity-100"
                : "bg-white/80 text-gray-500 opacity-0 group-hover:opacity-100 hover:bg-yellow-50 hover:text-yellow-400 dark:bg-gray-900/80 dark:text-gray-400 dark:hover:bg-yellow-800 hover:dark:text-yellow-500",
            )}
          >
            <Star
              className={cn(
                "size-4 transition-all",
                bookmark.isFavorite ? "fill-white text-white" : "",
              )}
            />
          </button>

          <button
            onClick={() => handleDelete(bookmark.id)}
            className={cn(
              "absolute top-2 right-2 rounded-full p-2 opacity-0 shadow-md transition-all group-hover:opacity-100",
              "bg-white/80 hover:bg-red-50 dark:bg-gray-900/80 dark:hover:bg-red-950",
              "text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400",
            )}
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </BookmarkContextMenu>
    );
  }

  return (
    <BookmarkContextMenu
      bookmark={bookmark}
      handleDelete={handleDelete}
      handleToggleFavorite={handleToggleFavorite}
    >
      <div
        className={cn(
          "group relative flex gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:border-teal-300 hover:shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:hover:border-teal-600",
          activeBackgroundId &&
            "border-0 bg-white/30 backdrop-blur-sm dark:bg-black/30",
        )}
      >
        {bookmark.imageUrl && (
          <div className="h-32 w-32 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
            <img
              src={bookmark.imageUrl}
              alt={bookmark.title || "Bookmark"}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
          <p className="truncate text-xs text-gray-400 dark:text-gray-500">
            {new URL(bookmark.url).hostname}
          </p>
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="line-clamp-1 text-lg font-bold text-gray-900 transition-colors hover:text-teal-500 dark:text-gray-100 dark:hover:text-teal-400"
          >
            {bookmark.title || bookmark.url}
          </a>
          {bookmark.description && (
            <p className="line-clamp-3 text-sm text-gray-600 dark:text-gray-400">
              {bookmark.description}
            </p>
          )}
        </div>

        <button
          onClick={() => handleToggleFavorite(bookmark.id)}
          className={cn(
            "absolute top-3 left-3 rounded-full p-2 shadow-md transition-colors",
            bookmark.isFavorite
              ? "bg-yellow-400 opacity-100"
              : "bg-white/80 text-gray-500 opacity-0 group-hover:opacity-100 hover:bg-yellow-50 hover:text-yellow-400 dark:bg-gray-900/80 dark:text-gray-400 dark:hover:bg-yellow-800 hover:dark:text-yellow-500",
          )}
        >
          <Star
            className={cn(
              "size-4 transition-all",
              bookmark.isFavorite ? "fill-white text-white" : "",
            )}
          />
        </button>

        <button
          onClick={() => handleDelete(bookmark.id)}
          className={cn(
            "absolute top-3 right-3 rounded-full p-2 opacity-0 transition-all group-hover:opacity-100",
            "bg-white/80 hover:bg-red-50 dark:bg-gray-900/80 dark:hover:bg-red-950",
            "text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400",
          )}
        >
          <Trash2 className="size-4" />
        </button>
      </div>
    </BookmarkContextMenu>
  );
}
