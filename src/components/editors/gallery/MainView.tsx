import { useEffect, useMemo, useState } from "react";
import { convertFileSrc } from "@tauri-apps/api/core";
import { useGalleryStore } from "@/stores/useGalleryStore";
import { Columns3, Folder, Grid, Image, List, Rows3 } from "lucide-react";
import { cn } from "@/lib/utils/general";
import useAutoSave from "@/hooks/useAutoSave";
import AlbumCard from "./AlbumCard";
import "react-photo-album/rows.css";
import "yet-another-react-lightbox/styles.css";

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  rectIntersection,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import ImageLayout from "./ImageLayout";
import { toast } from "sonner";
import useActiveNestling from "@/hooks/useActiveNestling";
import { useNestlingStore } from "@/stores/useNestlingStore";
import BaseToolTip from "@/components/BaseToolTip";

export default function MainView({
  setCurrentView,
  setAlbumId,
}: {
  setCurrentView: (view: "main" | "album") => void;
  setAlbumId: (id: number | null) => void;
}) {
  const { activeNestling } = useActiveNestling();
  const [title, setTitle] = useState(activeNestling.title);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [layoutMode, setLayoutMode] = useState<"row" | "column">("row");

  useEffect(() => {
    setTitle(activeNestling.title);
  }, [activeNestling.title]);

  const {
    images,
    activeDraggingImageId,
    albums,
    handleDragStart,
    handleDragEnd,
  } = useGalleryStore();

  const { updateNestling } = useNestlingStore();
  useAutoSave({
    target: activeNestling,
    currentData: useMemo(() => ({ title }), [title]),
    saveFunction: (id, data) => updateNestling(id, data),
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const onDragStart = (event: DragStartEvent) => {
    handleDragStart(event);
  };

  const onDragEnd = (event: DragEndEvent) => {
    try {
      handleDragEnd(event);
      toast.success("Image moved successfully!");
    } catch (error) {
      toast.error("Failed to move image");
    }
  };

  const draggingImage = activeDraggingImageId
    ? images.find((img) => img.id === parseInt(activeDraggingImageId))
    : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={rectIntersection}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div className="mb-2 flex items-center justify-between gap-2 text-lg">
        <div className="flex items-center gap-2 font-semibold">
          <Folder size={20} />
          Albums ({albums.length})
        </div>

        <div className="flex rounded border border-gray-200 bg-gray-100 p-1 dark:border-gray-700 dark:bg-gray-800">
          <BaseToolTip label="Grid View">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "rounded p-2 transition duration-100",
                viewMode === "grid"
                  ? "bg-white text-teal-600 shadow-sm dark:bg-teal-400 dark:text-white"
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
                  ? "bg-white text-teal-600 shadow-sm dark:bg-teal-400 dark:text-white"
                  : "text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700",
              )}
            >
              <List size={18} />
            </button>
          </BaseToolTip>
        </div>
      </div>
      {albums.length > 0 ? (
        <div
          className={cn(
            "mb-8 overflow-x-auto p-1",
            viewMode === "grid" ? "flex gap-4 pb-5" : "flex flex-col space-y-4",
          )}
        >
          {albums.map((album) => (
            <AlbumCard
              key={album.id}
              album={album}
              viewMode={viewMode}
              setCurrentView={setCurrentView}
              setAlbumId={setAlbumId}
            />
          ))}
        </div>
      ) : (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <div className="flex h-48 flex-col items-center justify-center text-gray-500">
            <p className="text-lg font-medium">No Albums yet</p>
            <p className="text-sm">click "Add Album" to create a new album</p>
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
          <Image size={20} />
          All Images ({images.length})
        </h2>
        <div className="flex rounded border border-gray-200 bg-gray-100 p-1 dark:border-gray-700 dark:bg-gray-800">
          <BaseToolTip label="Row View">
            <button
              onClick={() => setLayoutMode("row")}
              className={cn(
                "rounded p-2 transition duration-100",
                layoutMode === "row"
                  ? "bg-white text-teal-600 shadow-sm dark:bg-teal-400 dark:text-white"
                  : "text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700",
              )}
            >
              <Rows3 size={18} />
            </button>
          </BaseToolTip>

          <BaseToolTip label="Column View">
            <button
              onClick={() => setLayoutMode("column")}
              className={cn(
                "rounded p-2 transition duration-100",
                layoutMode === "column"
                  ? "bg-white text-teal-600 shadow-sm dark:bg-teal-400 dark:text-white"
                  : "text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700",
              )}
            >
              <Columns3 size={18} />
            </button>
          </BaseToolTip>
        </div>
      </div>

      <ImageLayout layoutMode={layoutMode} />

      <DragOverlay>
        {draggingImage && (
          <div className="pointer-events-none max-w-64 opacity-90">
            <img
              src={convertFileSrc(draggingImage.filePath)}
              alt={draggingImage.title || "Image"}
              className="rounded-lg shadow-lg"
            />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
