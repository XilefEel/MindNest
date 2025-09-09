import { useEffect, useMemo, useRef, useState } from "react";
import { open } from "@tauri-apps/plugin-dialog";
import { convertFileSrc } from "@tauri-apps/api/core";
import { RowsPhotoAlbum } from "react-photo-album";
import "react-photo-album/rows.css";
import { Lightbox } from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import NestlingTitle from "../NestlingTitle";
import { useNestlingTreeStore } from "@/stores/useNestlingStore";
import { useGalleryStore } from "@/stores/useGalleryStore";
import useAutoSave from "@/hooks/useAutoSave";
import { editNote } from "@/lib/nestlings";
import { Plus, Trash2, Upload } from "lucide-react";

export default function GalleryEditor() {
  const { activeNestling } = useNestlingTreeStore();
  if (!activeNestling) return null;

  const [title, setTitle] = useState(activeNestling.title);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setTitle(activeNestling.title);
  }, [activeNestling.title]);

  const { images, fetchImages, uploadImage, removeImage } = useGalleryStore();

  useAutoSave({
    target: activeNestling,
    currentData: useMemo(() => ({ title }), [title]),
    saveFunction: (id, data) => editNote(id, data.title, ""),
  });

  useEffect(() => {
    fetchImages(activeNestling.id);
    console.log("Fetching images for nestling:", activeNestling.id);
  }, [fetchImages, activeNestling.id]);

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

  const handleImageSelect = async () => {
    setIsUploading(true);
    try {
      const selected = await open({
        multiple: true,
        filters: [
          {
            name: "Image",
            extensions: ["png", "jpeg", "jpg", "gif", "webp", "bmp"],
          },
        ],
      });

      if (selected) {
        const files = Array.isArray(selected) ? selected : [selected];
        for (const filePath of files) {
          await uploadImage(activeNestling.id, { path: filePath });
        }
      }
    } catch (error) {
      console.error("Failed to select file:", error);
    } finally {
      setIsUploading(false);
    }
  };

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

  return (
    <div className="space-y-4 p-4">
      <NestlingTitle title={title} setTitle={setTitle} />

      <div className="flex items-center gap-4">
        <button
          onClick={handleImageSelect}
          disabled={isUploading}
          className="flex items-center gap-2 rounded-lg bg-teal-500 px-4 py-2 text-white shadow transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isUploading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
          ) : (
            <Plus className="h-5 w-5" />
          )}
          <span>{isUploading ? "Uploading..." : "Add Images"}</span>
        </button>

        {isUploading && (
          <span className="text-sm text-gray-600">Processing files...</span>
        )}
      </div>

      <div
        ref={dropZoneRef}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {isDragOver && (
          <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-teal-100/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-2 text-teal-700">
              <Upload className="h-8 w-8" />
              <p className="text-lg font-medium">Drop images here</p>
            </div>
          </div>
        )}

        {photos.length === 0 && !isUploading ? (
          <div className="flex h-48 flex-col items-center justify-center text-gray-500">
            <Upload className="mb-4 h-12 w-12" />
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
                <div className="group relative overflow-hidden rounded-xl shadow-md transition duration-300 hover:shadow-lg">
                  <img
                    {...imageProps}
                    className="h-full w-full transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 transition-all duration-200 group-hover:opacity-100">
                    <div className="absolute top-2 right-2">
                      <button
                        className="rounded-full bg-red-500 p-1.5 text-white shadow transition hover:bg-red-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log("Removing image:", photo.id);
                          handleImageDelete(photo.id);
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="absolute right-2 bottom-2 left-2 truncate text-sm text-white">
                      {photo.title}
                    </div>
                  </div>
                </div>
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
