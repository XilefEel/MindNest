import { useEffect, useMemo, useState } from "react";
import { convertFileSrc } from "@tauri-apps/api/core";
import { useNestlingTreeStore } from "@/stores/useNestlingStore";
import { useGalleryStore } from "@/stores/useGalleryStore";
import { editNote } from "@/lib/nestlings";
import { Columns3, Folder, Grid, Image, List, Rows3 } from "lucide-react";
import { cn } from "@/lib/utils";
import useAutoSave from "@/hooks/useAutoSave";
import "react-photo-album/rows.css";
import "yet-another-react-lightbox/styles.css";
import AlbumCard from "./AlbumCard";
import * as Tooltip from "@radix-ui/react-tooltip";

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

export default function MainView({
  setCurrentView,
  setAlbumId,
}: {
  setCurrentView: (view: "main" | "album") => void;
  setAlbumId: (id: number | null) => void;
}) {
  const { activeNestling } = useNestlingTreeStore();
  if (!activeNestling) return null;
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

  useAutoSave({
    target: activeNestling,
    currentData: useMemo(() => ({ title }), [title]),
    saveFunction: (id, data) => editNote(id, data.title, ""),
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
      <div className="mb-2 flex items-center justify-between gap-2 text-lg font-semibold">
        <div className="flex items-center gap-2">
          <Folder size={20} />
          Albums ({albums.length})
        </div>

        <div className="flex rounded border border-gray-200 bg-gray-100 p-1 dark:border-gray-700 dark:bg-gray-800">
          <Tooltip.Provider>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
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
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  side="top"
                  sideOffset={8}
                  className="data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 relative z-50 rounded bg-white px-2 py-1 text-sm text-black shadow-md"
                >
                  Grid
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>

          <Tooltip.Provider>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
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
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  side="top"
                  sideOffset={8}
                  className="data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 relative z-50 rounded bg-white px-2 py-1 text-sm text-black shadow-md"
                >
                  List
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
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
          <Tooltip.Provider>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
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
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  side="top"
                  sideOffset={8}
                  className="data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 relative z-50 rounded bg-white px-2 py-1 text-sm text-black shadow-md"
                >
                  Row layout
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>

          <Tooltip.Provider>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
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
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  side="top"
                  sideOffset={8}
                  className="data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 relative z-50 rounded bg-white px-2 py-1 text-sm text-black shadow-md"
                >
                  Column Layout
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        </div>
      </div>

      <ImageLayout layoutMode={layoutMode} />

      <DragOverlay>
        {draggingImage && (
          <div className="pointer-events-none max-w-64 opacity-90">
            <img
              src={convertFileSrc(draggingImage.file_path)}
              alt={draggingImage.title || "Image"}
              className="rounded-lg shadow-lg"
            />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
