import { GalleryAlbum } from "@/lib/types/gallery";
import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils/general";
import AlbumContextMenu from "@/components/context-menu/AlbumContextMenu";
import { useGalleryStore } from "@/stores/useGalleryStore";

export default function AlbumCard({
  album,
  viewMode,
  setAlbumId,
  setCurrentView,
}: {
  album: GalleryAlbum;
  viewMode: "grid" | "list";
  setAlbumId: (id: number | null) => void;
  setCurrentView: (view: "main" | "album") => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: album.id.toString(),
    data: {
      type: "album",
      album,
    },
  });
  const { images } = useGalleryStore();
  const albumImages = images.filter((img) => img.album_id === album.id);

  return (
    <AlbumContextMenu album={album}>
      <div
        ref={setNodeRef}
        onClick={() => {
          setCurrentView("album");
          setAlbumId(album.id);
        }}
      >
        {viewMode === "grid" ? (
          <div
            className={cn(
              "w-64 flex-shrink-0 cursor-pointer overflow-hidden rounded-lg border bg-white shadow-sm transition hover:shadow-md",
              "border-gray-200 hover:border-teal-300 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-teal-500",
              isOver && "ring-2 ring-teal-400",
            )}
          >
            <div className="relative flex aspect-video items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-700 dark:to-pink-600">
              <div className="text-4xl">📁</div>

              <div className="absolute top-2 right-2 rounded-full bg-black/70 px-2 py-1 text-xs text-white">
                {albumImages.length} Photos
              </div>
            </div>
            <div className="p-3">
              <h3 className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                {album.name}
              </h3>
              <p className="mt-1 line-clamp-2 text-xs text-gray-500 dark:text-gray-400">
                {album.description || "No description"}
              </p>
            </div>
          </div>
        ) : (
          <div
            className={cn(
              "w-full cursor-pointer overflow-hidden rounded-lg border bg-white shadow-sm transition hover:shadow-md dark:hover:bg-gray-800",
              "border-gray-100 hover:border-teal-300 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-teal-500",
              isOver && "ring-2 ring-teal-400",
            )}
          >
            <div className="flex items-center gap-3 p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gradient-to-br from-purple-100 to-pink-100 text-teal-600 dark:bg-teal-900 dark:from-purple-700 dark:to-pink-600 dark:text-teal-300">
                📁
              </div>

              <div className="flex flex-1 flex-col">
                <h3 className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {album.name}
                </h3>
                <p className="line-clamp-1 text-xs text-gray-500 dark:text-gray-400">
                  {album.description || "No description"}
                </p>
              </div>

              <span className="ml-auto rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                {albumImages.length} photos
              </span>
            </div>
          </div>
        )}
      </div>
    </AlbumContextMenu>
  );
}
