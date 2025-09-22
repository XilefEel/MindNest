import { useEffect, useMemo, useState } from "react";
import { useNestlingTreeStore } from "@/stores/useNestlingStore";
import { useGalleryStore } from "@/stores/useGalleryStore";
import { Columns3, Download, Folder, Image, Rows3 } from "lucide-react";
import useAutoSave from "@/hooks/useAutoSave";
import "react-photo-album/rows.css";
import "yet-another-react-lightbox/styles.css";
import { GalleryAlbum } from "@/lib/types";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import ImageLayout from "./ImageLayout";
import { cn } from "@/lib/utils";

export default function AlbumView({ album }: { album: GalleryAlbum | null }) {
  const { activeNestling } = useNestlingTreeStore();
  if (!activeNestling || !album) return null;

  const [title, setTitle] = useState(album.name);
  const [description, setDescription] = useState(album.description ?? "");
  const [layoutMode, setLayoutMode] = useState<"row" | "column">("row");

  const { images, downloadAlbum, editAlbum } = useGalleryStore();

  const handleDownloadAlbum = async (id: number) => {
    await downloadAlbum(id);
    toast.success("Album downloaded successfully!");
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

      <div className="mb-3 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <Image size={20} />
          Images ({images.length})
        </h2>
        <div className="flex items-center gap-2">
          <div className="flex rounded border border-gray-200 bg-gray-100 p-1 dark:border-gray-700 dark:bg-gray-800">
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
          </div>
          <Button
            className="cursor-pointer bg-teal-400 text-white transition duration-200 hover:bg-teal-600"
            onClick={() => handleDownloadAlbum(album.id)}
          >
            <Download />
            Download All
          </Button>
        </div>
      </div>
      <ImageLayout album={album} layoutMode={layoutMode} />
    </div>
  );
}
