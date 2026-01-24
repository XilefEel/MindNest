import { Bookmark } from "@/lib/types/bookmark";
import { Trash2 } from "lucide-react";

export default function BookmarkCard({
  bookmark,
  viewMode,
  handleDelete,
}: {
  bookmark: Bookmark;
  viewMode: "list" | "grid";
  handleDelete: (id: number) => void;
}) {
  if (viewMode === "grid") {
    return (
      <div className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white hover:border-teal-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-teal-600">
        {bookmark.image_url ? (
          <div className="aspect-video w-full overflow-hidden bg-gray-100 dark:bg-gray-700">
            <img
              src={bookmark.image_url}
              alt={bookmark.title || "Bookmark"}
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
              className="line-clamp-2 font-semibold text-gray-900 transition hover:text-teal-600 dark:text-gray-100 dark:hover:text-teal-400"
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
          onClick={() => handleDelete(bookmark.id)}
          className="absolute top-2 right-2 cursor-pointer rounded-full bg-white/90 p-2 opacity-0 shadow-md transition-all group-hover:opacity-100 hover:bg-white dark:bg-gray-900/90 dark:hover:bg-gray-900"
        >
          <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400" />
        </button>
      </div>
    );
  }

  return (
    <div className="group relative flex gap-4 rounded-lg border border-gray-200 bg-white p-4 hover:border-teal-300 hover:shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:hover:border-teal-600">
      {bookmark.image_url && (
        <div className="h-32 w-32 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
          <img
            src={bookmark.image_url}
            alt={bookmark.title || "Bookmark"}
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
          className="line-clamp-1 text-lg font-bold text-gray-900 hover:text-teal-600 dark:text-gray-100 dark:hover:text-teal-400"
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
        onClick={() => handleDelete(bookmark.id)}
        className="absolute top-3 right-3 cursor-pointer rounded-full p-2 opacity-0 transition-all group-hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400" />
      </button>
    </div>
  );
}
