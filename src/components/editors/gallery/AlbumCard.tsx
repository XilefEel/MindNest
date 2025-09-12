import { GalleryAlbum } from "@/lib/types";
import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import AlbumContextMenu from "@/components/context-menu/AlbumContextMenu";
import { useGalleryStore } from "@/stores/useGalleryStore";

export default function AlbumCard({
  album,
  setAlbumId,
  setCurrentView,
}: {
  album: GalleryAlbum;
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
    <AlbumContextMenu>
      <div
        ref={setNodeRef}
        onClick={() => {
          setCurrentView("album");
          setAlbumId(album.id);
        }}
        className={cn(
          "w-64 flex-shrink-0 cursor-pointer overflow-hidden rounded-lg border bg-white shadow-sm transition hover:shadow-md",
          "border-gray-200 dark:border-gray-700 dark:bg-gray-900",
          isOver && "ring-2 ring-teal-400",
        )}
      >
        <div className="relative flex aspect-video items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-800 dark:to-pink-800">
          <div className="text-4xl opacity-50">📁</div>

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
    </AlbumContextMenu>
  );
}
