import { useEffect, useMemo, useRef, useState } from "react";
import { convertFileSrc } from "@tauri-apps/api/core";
import { RowsPhotoAlbum } from "react-photo-album";
import { Lightbox } from "yet-another-react-lightbox";
import { useNestlingTreeStore } from "@/stores/useNestlingStore";
import { useGalleryStore } from "@/stores/useGalleryStore";
import { Folder, Image, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import useAutoSave from "@/hooks/useAutoSave";
import "react-photo-album/rows.css";
import "yet-another-react-lightbox/styles.css";
import ImageCard from "./ImageCard";
import { GalleryAlbum } from "@/lib/types";

export default function AlbumView({ album }: { album: GalleryAlbum | null }) {
  const { activeNestling } = useNestlingTreeStore();
  if (!activeNestling || !album) return null;

  const [title, setTitle] = useState(album.name);
  const [description, setDescription] = useState(album.description ?? "");
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const { images, fetchImages, uploadImage, editAlbum, removeImage } =
    useGalleryStore();

  const photos = useMemo(
    () =>
      images
        .filter((img) => img.album_id === album.id)
        .map((img) => ({
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
        await uploadImage(
          activeNestling.id,
          {
            name: file.name,
            data: uint8Array,
          },
          album.id,
        );
        fetchImages(activeNestling.id);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    console.log("Dragging over drop zone");
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    console.log("Left drop zone");
    if (!dropZoneRef.current?.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  };

  useAutoSave({
    target: album,
    currentData: useMemo(
      () => ({
        name: title,
        description,
      }),
      [title, description],
    ),
    saveFunction: async (id, data) => {
      await editAlbum({
        id,
        name: data.name,
        description: data.description,
      });
    },
  });

  useEffect(() => {
    setTitle(album.name);
    setDescription(album.description ?? "");
  }, [album]);

  return (
    <div>
      <div className="flex items-center gap-2">
        <Folder size={24} />
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Untitled entry"
          className="w-full bg-transparent text-2xl font-semibold tracking-tight placeholder:text-slate-400 focus:outline-none"
        />
      </div>

      <input
        value={description ?? ""}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Add a description..."
        className="mt-2 w-full resize-none bg-transparent text-base text-slate-600 placeholder:text-slate-400 focus:outline-none dark:text-slate-300"
      />

      <div className="mt-2 mb-6 border-b border-slate-200 dark:border-slate-700" />

      <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
        <Image size={20} />
        Images ({photos.length})
      </h2>

      <div
        ref={dropZoneRef}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
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
                <p className="text-sm text-white">{slide.title}</p>
              </div>
            ),
          }}
        />
      </div>
    </div>
  );
}
