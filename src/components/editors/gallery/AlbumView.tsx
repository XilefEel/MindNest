import { useEffect, useMemo, useState } from "react";
import { useGalleryActions, useImages } from "@/stores/useGalleryStore";
import { Download, Folder, Image } from "lucide-react";
import useAutoSave from "@/hooks/useAutoSave";
import "react-photo-album/rows.css";
import "yet-another-react-lightbox/styles.css";
import { GalleryAlbum } from "@/lib/types/gallery";
import { toast } from "@/lib/utils/toast";
import ImageLayout from "./ImageLayout";
import { motion } from "framer-motion";
import { useActiveNestling } from "@/stores/useNestlingStore";
import LayoutToggle from "./LayoutToggle";

export default function AlbumView({
  album,
  variants,
  direction,
}: {
  album: GalleryAlbum | null;
  variants: any;
  direction: any;
}) {
  const activeNestling = useActiveNestling();
  if (!activeNestling || !album) return null;

  const [title, setTitle] = useState(album.name);
  const [description, setDescription] = useState(album.description ?? "");
  const [layoutMode, setLayoutMode] = useState<"row" | "column">("row");

  const { downloadAlbum, updateAlbum } = useGalleryActions();
  const images = useImages();

  const handleDownloadAlbum = async (id: number) => {
    try {
      await downloadAlbum(id);
      toast.success("Album downloaded successfully!");
    } catch (error) {
      toast.error("Failed to download album");
    }
  };

  const albumData = useMemo(
    () => ({
      name: title,
      description,
    }),
    [title, description],
  );

  useAutoSave(album.id, albumData, updateAlbum);

  useEffect(() => {
    setTitle(album.name);
    setDescription(album.description ?? "");
  }, [album]);

  return (
    <motion.div
      key="album"
      variants={variants}
      custom={direction}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.3 }}
      className="absolute inset-0"
    >
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
        <div className="flex items-center gap-3">
          <LayoutToggle layoutMode={layoutMode} setLayoutMode={setLayoutMode} />

          <button
            onClick={() => handleDownloadAlbum(album.id)}
            className="flex items-center gap-2 rounded-lg bg-purple-500 px-3 py-1.5 text-sm text-white shadow transition-colors hover:bg-purple-600"
          >
            <Download size={16} />
            Download All
          </button>
        </div>
      </div>
      <ImageLayout album={album} layoutMode={layoutMode} />
    </motion.div>
  );
}
