import { useEffect, useMemo, useState } from "react";
import { convertFileSrc } from "@tauri-apps/api/core";
import {
  useAlbums,
  useGalleryActions,
  useGalleryStore,
  useImages,
} from "@/stores/useGalleryStore";
import { Folder, Image } from "lucide-react";
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
import { toast } from "@/lib/utils/toast";
import {
  useActiveNestling,
  useNestlingActions,
} from "@/stores/useNestlingStore";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import ViewToggle from "./ViewToggle";
import LayoutToggle from "./LayoutToggle";

export default function MainView({
  variants,
  direction,
  setCurrentView,
  setAlbumId,
}: {
  variants: any;
  direction: any;
  setCurrentView: (view: "main" | "album") => void;
  setAlbumId: (id: number | null) => void;
}) {
  const activeNestling = useActiveNestling();
  if (!activeNestling) return;

  const [title, setTitle] = useState(activeNestling.title);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [layoutMode, setLayoutMode] = useState<"row" | "column">("row");

  const images = useImages();
  const albums = useAlbums();
  const activeDraggingImageId = useGalleryStore(
    (state) => state.activeDraggingImageId,
  );
  const { handleDragStart, handleDragEnd } = useGalleryActions();

  const { updateNestling } = useNestlingActions();
  const nestlingData = useMemo(() => ({ title }), [title]);
  useAutoSave(activeNestling.id!, nestlingData, updateNestling);

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
      toast.error("Failed to move image.");
    }
  };

  const draggingImage = activeDraggingImageId
    ? images.find((img) => img.id === parseInt(activeDraggingImageId))
    : null;

  useEffect(() => {
    setTitle(activeNestling.title);
  }, [activeNestling.title]);

  return (
    <motion.div
      key="main"
      variants={variants}
      custom={direction}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.3 }}
      className="absolute inset-0"
    >
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
          <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
        </div>

        {albums.length > 0 ? (
          <div
            className={cn(
              "mb-8 flex overflow-x-auto p-1",
              viewMode === "grid" ? "gap-4" : "flex-col space-y-4",
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
              <p className="text-sm">Click "Add Album" to create a new album</p>
            </div>
          </div>
        )}

        <div className="flex justify-between">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
            <Image size={20} />
            All Images ({images.length})
          </h2>
          <LayoutToggle layoutMode={layoutMode} setLayoutMode={setLayoutMode} />
        </div>

        <ImageLayout layoutMode={layoutMode} />

        {createPortal(
          <DragOverlay>
            {draggingImage && (
              <img
                src={convertFileSrc(draggingImage.filePath)}
                alt={draggingImage.title || "Image"}
                className="max-w-64 rounded-lg opacity-50 shadow-lg"
              />
            )}
          </DragOverlay>,
          document.body,
        )}
      </DndContext>
    </motion.div>
  );
}
