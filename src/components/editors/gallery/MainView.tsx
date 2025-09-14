import { useEffect, useMemo, useRef, useState } from "react";
import { convertFileSrc } from "@tauri-apps/api/core";
import { RowsPhotoAlbum } from "react-photo-album";
import { Lightbox } from "yet-another-react-lightbox";
import { useNestlingTreeStore } from "@/stores/useNestlingStore";
import { useGalleryStore } from "@/stores/useGalleryStore";
import { editNote } from "@/lib/nestlings";
import { Folder, Grid, Image, List, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import useAutoSave from "@/hooks/useAutoSave";
import "react-photo-album/rows.css";
import "yet-another-react-lightbox/styles.css";
import ImageCard from "./ImageCard";
import AlbumCard from "./AlbumCard";

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  rectIntersection,
} from "@dnd-kit/core";

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
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    setTitle(activeNestling.title);
  }, [activeNestling.title]);

  const {
    images,
    activeDraggingImageId,
    albums,
    fetchImages,
    uploadImage,
    removeImage,
    handleDragStart,
    handleDragEnd,
  } = useGalleryStore();

  useAutoSave({
    target: activeNestling,
    currentData: useMemo(() => ({ title }), [title]),
    saveFunction: (id, data) => editNote(id, data.title, ""),
  });

  const photos = useMemo(
    () =>
      images.map((img) => ({
        id: img.id,
        src: convertFileSrc(img.file_path),
        width: img.width,
        height: img.height,
        title: img.title ?? "Untitled",
        description: img.description ?? "",
      })),
    [images],
  );

  const [index, setIndex] = useState(-1);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const handleImageDelete = async (id: number) => {
    try {
      await removeImage(id);
      await fetchImages(activeNestling.id);
    } catch (error) {
      console.error("Failed to delete image:", error);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (isUploading) return;

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length === 0) {
      alert("Please drop image files only");
      return;
    }

    setIsUploading(true);

    try {
      for (const file of imageFiles) {
        const uint8Array = new Uint8Array(await file.arrayBuffer());
        await uploadImage(activeNestling.id, {
          name: file.name,
          data: uint8Array,
        });
        fetchImages(activeNestling.id);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDropOver = (e: React.DragEvent) => {
    e.preventDefault();
    console.log("Dragging over drop zone");
    setIsDragOver(true);
  };

  const handleDropLeave = (e: React.DragEvent) => {
    e.preventDefault();
    console.log("Left drop zone");
    if (!dropZoneRef.current?.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const draggingImage = activeDraggingImageId
    ? images.find((img) => img.id === parseInt(activeDraggingImageId))
    : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={rectIntersection}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="mb-2 flex items-center justify-between gap-2 text-lg font-semibold">
        <div className="flex items-center gap-2">
          <Folder size={20} />
          Albums ({albums.length})
        </div>

        <div className="flex rounded border border-gray-200 bg-gray-100 p-1 dark:border-gray-700 dark:bg-gray-800">
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

      <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
        <Image size={20} />
        All Images ({photos.length})
      </h2>

      <div
        ref={dropZoneRef}
        onDrop={handleDrop}
        onDragOver={handleDropOver}
        onDragLeave={handleDropLeave}
        className={cn(
          "p-2",
          isDragOver
            ? "inset-0 border-2 border-dashed border-teal-400 bg-teal-100/80 dark:bg-teal-900/80"
            : "",
        )}
      >
        {photos.length === 0 && !isUploading ? (
          <div className="flex h-48 flex-col items-center justify-center text-gray-500">
            <Upload className="mb-4 size-16" />
            <p className="text-lg font-medium">No images yet</p>
            <p className="text-sm">
              Drag & drop images here or click "Add Images"
            </p>
          </div>
        ) : (
          <RowsPhotoAlbum
            photos={photos}
            onClick={({ index: current }) => setIndex(current)}
            render={{
              image: (imageProps, { photo }) => (
                <ImageCard
                  key={photo.id}
                  imageProps={imageProps}
                  photo={photo}
                  handleImageDelete={handleImageDelete}
                />
              ),
            }}
          />
        )}

        <Lightbox
          index={index}
          slides={photos}
          plugins={[Fullscreen]}
          open={index >= 0}
          close={() => setIndex(-1)}
          render={{
            slideFooter: ({ slide }: { slide: any }) => (
              <div className="absolute inset-x-0 bottom-0 bg-black/50 p-3 text-center">
                <p className="text-sm font-semibold text-white">
                  {slide.title}
                </p>
                <p className="text-xs text-white">{slide.description}</p>
              </div>
            ),
          }}
        />
      </div>
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
