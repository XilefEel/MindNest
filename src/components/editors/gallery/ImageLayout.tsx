import { useMemo, useRef, useState } from "react";
import { convertFileSrc } from "@tauri-apps/api/core";
import { RowsPhotoAlbum, ColumnsPhotoAlbum } from "react-photo-album";
import { Lightbox } from "yet-another-react-lightbox";
import { useNestlingTreeStore } from "@/stores/useNestlingStore";
import { useGalleryStore } from "@/stores/useGalleryStore";
import { Upload, Image, Grid, List } from "lucide-react";
import { cn } from "@/lib/utils";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import "react-photo-album/rows.css";
import "react-photo-album/columns.css";
import "yet-another-react-lightbox/styles.css";
import ImageCard from "./ImageCard";
import { GalleryAlbum } from "@/lib/types";
import { toast } from "sonner";

export default function ImageLayout({
  album,
  layoutMode,
}: {
  album?: GalleryAlbum;
  layoutMode: "row" | "column";
}) {
  const { activeNestling } = useNestlingTreeStore();
  if (!activeNestling) return null;
  const { images, fetchImages, uploadImage, removeImage } = useGalleryStore();

  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [index, setIndex] = useState(-1);

  const dropZoneRef = useRef<HTMLDivElement>(null);

  const PhotoLayout = layoutMode === "row" ? RowsPhotoAlbum : ColumnsPhotoAlbum;

  const photos = useMemo(() => {
    const filtered = album
      ? images.filter((img) => img.album_id == album.id)
      : images;

    const mapped = filtered.map((img) => ({
      id: img.id,
      src: convertFileSrc(img.file_path),
      width: img.width,
      height: img.height,
      title: img.title ?? "Untitled",
      description: img.description ?? "No Description",
      created_at: img.created_at,
    }));

    return mapped;
  }, [images, album]);

  const handleImageDelete = async (id: number) => {
    try {
      await removeImage(id);
      await fetchImages(activeNestling.id);
      toast.success("Image deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete image");
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
      toast.success("Image uploaded successfully!");
    } catch (error) {
      toast.error("Failed to upload image");
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

  return (
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
        <PhotoLayout
          columns={3}
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
              <p className="text-sm font-semibold text-white">{slide.title}</p>
              <p className="text-xs text-white">{slide.description}</p>
            </div>
          ),
        }}
      />
    </div>
  );
}
