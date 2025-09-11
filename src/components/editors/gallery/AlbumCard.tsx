import { GalleryAlbum } from "@/lib/types";
import { EllipsisVertical } from "lucide-react";
import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";

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
  return (
    <div
      ref={setNodeRef}
      onClick={() => {
        setCurrentView("album");
        setAlbumId(album.id);
      }}
      className={cn(
        "w-1/4 flex-shrink-0 cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition hover:shadow-md",
        isOver && "ring-2 ring-teal-400",
      )}
    >
      <div className="relative flex aspect-video items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
        <div className="text-4xl opacity-50">📁</div>
        <div className="absolute top-2 left-2 rounded-full px-2 py-1 text-gray-500 hover:text-gray-400">
          <EllipsisVertical size={16} />
        </div>
        <div className="absolute top-2 right-2 rounded-full bg-black/70 px-2 py-1 text-xs text-white">
          0
        </div>
      </div>
      <div className="p-3">
        <h3 className="truncate text-sm font-medium text-gray-900">
          {album.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs text-gray-500">
          {album.description || "No description"}
        </p>
      </div>
    </div>
  );
}
