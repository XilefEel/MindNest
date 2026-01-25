import { Bookmark } from "@/lib/types/bookmark";
import { cn } from "@/lib/utils/general";
import { useActiveBackgroundId } from "@/stores/useNestStore";
import { Star, Trash2 } from "lucide-react";

export default function BookmarkCard({
  bookmark,
  viewMode,
  handleDelete,
  handleToggleFavorite,
}: {
  bookmark: Bookmark;
  viewMode: "list" | "grid";
  handleDelete: (id: number) => void;
  handleToggleFavorite: (id: number) => void;
}) {
  const activeBackgroundId = useActiveBackgroundId();

  if (viewMode === "grid") {
    return (
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
            "absolute top-2 left-2 cursor-pointer rounded-full p-2 shadow-md transition-colors",
            bookmark.isFavorite
              ? "bg-yellow-400 opacity-100"
              : "bg-white/80 opacity-0 group-hover:opacity-100 hover:bg-white/90 dark:bg-gray-900/80 dark:hover:bg-gray-900/90",
          )}
        >
          <Star
            className={cn(
              "h-4 w-4 transition-all",
              bookmark.isFavorite
                ? "fill-white text-white"
                : "text-gray-400 hover:text-yellow-400 dark:text-gray-300",
            )}
          />
        </button>

        <button
          onClick={() => handleDelete(bookmark.id)}
          className="absolute top-2 right-2 cursor-pointer rounded-full bg-white/80 p-2 opacity-0 shadow-md transition-all group-hover:opacity-100 hover:bg-white/90 dark:bg-gray-900/80 dark:hover:bg-gray-900/90"
        >
          <Trash2 className="h-4 w-4 text-gray-500 transition-colors hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400" />
        </button>
      </div>
    );
  }

  return (
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
          "absolute top-3 left-3 cursor-pointer rounded-full p-2 transition-colors",
          bookmark.isFavorite
            ? "bg-yellow-400 opacity-100"
            : cn(
                "opacity-0 group-hover:opacity-100",
                activeBackgroundId
                  ? "border-0 hover:bg-white/30 hover:dark:bg-black/30"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700",
              ),
        )}
      >
        <Star
          className={cn(
            "h-4 w-4 transition-all",
            bookmark.isFavorite
              ? "fill-white text-white"
              : "text-gray-400 hover:text-yellow-400 dark:text-gray-300",
          )}
        />
      </button>

      <button
        onClick={() => handleDelete(bookmark.id)}
        className={cn(
          "absolute top-3 right-3 cursor-pointer rounded-full p-2 opacity-0 transition-all group-hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-700",
          activeBackgroundId &&
            "border-0 hover:bg-white/30 hover:dark:bg-black/30",
        )}
      >
        <Trash2 className="h-4 w-4 text-gray-500 transition-colors hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400" />
      </button>
    </div>
  );
}
