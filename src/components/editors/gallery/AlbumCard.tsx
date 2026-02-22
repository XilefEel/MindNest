import { GalleryAlbum } from "@/lib/types/gallery";
import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils/general";
import AlbumContextMenu from "@/components/context-menu/AlbumContextMenu";
import { useImages } from "@/stores/useGalleryStore";
import { useActiveBackgroundId } from "@/stores/useNestStore";

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
  const images = useImages();
  const albumImages = images.filter((img) => img.albumId === album.id);
  const activeBackgroundId = useActiveBackgroundId();

  const { setNodeRef, isOver } = useDroppable({
    id: album.id.toString(),
    data: {
      type: "album",
      album,
    },
  });

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
              "w-64 flex-shrink-0 overflow-hidden rounded-lg border shadow-sm",
              "bg-white dark:bg-gray-800",
              "border-gray-200 hover:border-teal-300 dark:border-gray-700 dark:hover:border-teal-500",
              isOver && "ring-2 ring-teal-400",
              activeBackgroundId &&
                "border-0 bg-white/30 backdrop-blur-sm dark:bg-black/30",
            )}
          >
            <div className="relative flex aspect-video items-center justify-center bg-gradient-to-br from-purple-200 to-pink-200 dark:from-purple-700 dark:to-pink-600">
              <div className="text-4xl">📁</div>

              <div className="absolute top-2 right-2 rounded-full bg-black/50 px-2 py-1 text-xs text-white">
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
              "w-full overflow-hidden rounded-lg border shadow-sm",
              "bg-white dark:bg-gray-800",
              "border-gray-200 hover:border-teal-300 dark:border-gray-700 dark:hover:border-teal-500",
              isOver && "ring-2 ring-teal-400",
              activeBackgroundId &&
                "border-0 bg-white/30 backdrop-blur-sm dark:bg-black/30",
            )}
          >
            <div className="flex items-center gap-3 p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gradient-to-br from-purple-200 to-pink-200 text-teal-600 dark:from-purple-700 dark:to-pink-600 dark:text-teal-300">
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

              <span
                className={cn(
                  "ml-auto rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300",
                  activeBackgroundId && "bg-white/30 dark:bg-black/30",
                )}
              >
                {albumImages.length} photos
              </span>
            </div>
          </div>
        )}
      </div>
    </AlbumContextMenu>
  );
}
