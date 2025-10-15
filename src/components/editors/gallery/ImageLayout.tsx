import { useMemo, useRef, useState } from "react";
import { convertFileSrc } from "@tauri-apps/api/core";
import { RowsPhotoAlbum, ColumnsPhotoAlbum } from "react-photo-album";
import { Lightbox } from "yet-another-react-lightbox";
import { useGalleryStore } from "@/stores/useGalleryStore";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils/general";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import "react-photo-album/rows.css";
import "react-photo-album/columns.css";
import "yet-another-react-lightbox/styles.css";
import ImageCard from "./ImageCard";
import { GalleryAlbum } from "@/lib/types/gallery";
import { toast } from "sonner";
import useActiveNestling from "@/hooks/useActiveNestling";

export default function ImageLayout({
  album,
  layoutMode,
}: {
  album?: GalleryAlbum;
  layoutMode: "row" | "column";
}) {
  const { activeNestling } = useActiveNestling();
  if (!activeNestling) return null;
  const { images, editImage, uploadImage, removeImage } = useGalleryStore();

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
      album_id: img.album_id,
      src: convertFileSrc(img.file_path),
      title: img.title ?? "Untitled",
      description: img.description ?? "No Description",
      is_favorite: img.is_favorite!,
      width: img.width,
      height: img.height,
      created_at: img.created_at,
    }));

    // Sort by favorite and then by date
    mapped.sort((a, b) => {
      if (a.is_favorite === b.is_favorite) {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      } else return b.is_favorite ? 1 : -1;
    });

    return mapped;
  }, [images, album]);

  const handleImageDelete = async (id: number) => {
    try {
      await removeImage(id);
      toast.success("Image deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete image");
    }
  };

  const handleAddToFavorites = async (photo: any) => {
    try {
      const newFavoriteState = !photo.is_favorite;
      console.log(photo);
      await editImage({
        id: photo.id,
        albumId: photo.album_id,
        title: photo.title,
        description: photo.description,
        is_favorite: newFavoriteState,
      });

      newFavoriteState
        ? toast.success("Image added to favorites!")
        : toast.success("Image removed from favorites!");
    } catch (error) {
      toast.error("Failed to add image to favorites");
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
        await uploadImage({
          nestlingId: activeNestling.id,
          file: { name: file.name, data: uint8Array },
        });
      }
      toast.success("Image uploaded successfully!");
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDropOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDropLeave = (e: React.DragEvent) => {
    e.preventDefault();
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
                handleAddToFavorites={handleAddToFavorites}
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
