import { useEffect, useMemo, useState } from "react";
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
import { Plus, Trash2 } from "lucide-react";

export default function GalleryEditor() {
  const { activeNestling } = useNestlingTreeStore();
  if (!activeNestling) return null;

  const [title, setTitle] = useState(activeNestling.title);

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

  const handleImageSelect = async () => {
    try {
      const selected = await open({
        multiple: false,
        filters: [
          {
            name: "Image",
            extensions: ["png", "jpeg", "jpg", "gif", "webp", "bmp"],
          },
        ],
      });

      if (selected && typeof selected === "string") {
        await uploadImage(activeNestling.id, selected);
        console.log(activeNestling);
      }
    } catch (error) {
      console.error("Failed to select file:", error);
    }
  };

  const handleImageDelete = async (id: number) => {
    try {
      await removeImage(id);
    } catch (error) {
      console.error("Failed to delete image:", error);
    }
  };

  return (
    <div className="space-y-4 p-4">
      <NestlingTitle title={title} setTitle={setTitle} />

      <button
        onClick={handleImageSelect}
        className="flex items-center gap-2 rounded-lg bg-teal-500 px-4 py-2 text-white shadow transition hover:bg-teal-700"
      >
        <Plus className="h-5 w-5" />
        <span>Add Image</span>
      </button>

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
  );
}
