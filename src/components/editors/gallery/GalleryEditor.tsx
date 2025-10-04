import { useEffect, useMemo, useState } from "react";
import { useNestlingStore } from "@/stores/useNestlingStore";
import { useGalleryStore } from "@/stores/useGalleryStore";
import { editNote } from "@/lib/api/note";
import { ArrowLeft, Plus, Upload } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import NestlingTitle from "../NestlingTitle";
import useAutoSave from "@/hooks/useAutoSave";
import "react-photo-album/rows.css";
import "yet-another-react-lightbox/styles.css";
import MainView from "./MainView";
import AlbumView from "./AlbumView";
import { cn } from "@/lib/utils/general";
import AddAlbumModal from "@/components/modals/AddAlbumModal";
import { toast } from "sonner";

export default function GalleryEditor() {
  const { activeNestling } = useNestlingStore();
  if (!activeNestling) return null;
  const { albums } = useGalleryStore();

  const [title, setTitle] = useState(activeNestling.title);
  const [isUploading, setIsUploading] = useState(false);
  const [currentView, setCurrentView] = useState<"main" | "album">("main");
  const [albumId, setAlbumId] = useState<number | null>(null);
  const currentAlbum = albums.find((album) => album.id === albumId) ?? null;

  const direction = currentView === "album" ? 1 : -1;
  const viewVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "150%" : "-150%",
    }),
    center: { x: 0 },
    exit: (direction: number) => ({
      x: direction > 0 ? "-150%" : "150%",
    }),
  };

  useEffect(() => {
    setTitle(activeNestling.title);
  }, [activeNestling.title]);

  const { fetchImages, fetchAlbums, selectImages } = useGalleryStore();

  useAutoSave({
    target: activeNestling,
    currentData: useMemo(() => ({ title }), [title]),
    saveFunction: (id, data) => editNote(id, data.title, ""),
  });

  useEffect(() => {
    fetchAlbums(activeNestling.id);
    fetchImages(activeNestling.id);
    console.log("Fetching images for nestling:", activeNestling.id);
  }, [fetchImages, activeNestling.id]);

  const handleSelectImage = async () => {
    try {
      const selected = await selectImages(activeNestling.id, albumId);
      if (selected) {
        toast.success("Image uploaded successfully!");
      } else {
        toast.error("No image selected");
      }
    } catch (error) {
      toast.error("Failed to upload image");
    }
  };

  return (
    <div className="relative space-y-4 p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-4">
          {currentView === "album" && (
            <div
              onClick={() => {
                setCurrentView("main");
                setAlbumId(null);
              }}
              className="cursor-pointer"
            >
              <ArrowLeft />
            </div>
          )}
          <NestlingTitle title={title} setTitle={setTitle} />
        </div>

        <div className="flex gap-3 text-sm">
          <button
            onClick={() => {
              handleSelectImage();
            }}
            disabled={isUploading}
            className="flex items-center gap-2 rounded-lg bg-blue-500 px-3 py-1.5 text-white transition-colors hover:bg-blue-600"
          >
            {isUploading ? (
              <div className="size-4 animate-spin rounded-full border-2 border-white"></div>
            ) : (
              <Upload className="size-4" />
            )}
            <span className="hidden md:block">
              {isUploading ? "Uploading..." : "Add Images"}
            </span>
          </button>
          <AddAlbumModal nestling_id={activeNestling.id}>
            <button
              className={cn(
                "flex items-center gap-2 rounded-lg bg-teal-500 px-3 py-1.5 text-white transition-colors hover:bg-teal-600",
                albumId !== null ? "hidden" : "",
              )}
            >
              <Plus className="size-4" />
              <span className="hidden md:block">Add Album</span>
            </button>
          </AddAlbumModal>
        </div>
      </div>

      <div className="relative">
        <AnimatePresence mode="sync" initial={false} custom={direction}>
          {currentView === "main" ? (
            <motion.div
              key="main"
              variants={viewVariants}
              custom={direction}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <MainView
                setCurrentView={setCurrentView}
                setAlbumId={setAlbumId}
              />
            </motion.div>
          ) : (
            <motion.div
              key="album"
              variants={viewVariants}
              custom={direction}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <AlbumView album={currentAlbum} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
