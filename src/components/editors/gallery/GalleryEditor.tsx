import { useEffect, useMemo, useState } from "react";
import { useAlbums, useGalleryActions } from "@/stores/useGalleryStore";
import { ArrowLeft, Loader, Plus, Upload } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import NestlingTitle from "../NestlingTitle";
import useAutoSave from "@/hooks/useAutoSave";
import "react-photo-album/rows.css";
import "yet-another-react-lightbox/styles.css";
import MainView from "./MainView";
import AlbumView from "./AlbumView";
import { cn } from "@/lib/utils/general";
import { toast } from "@/lib/utils/toast";
import {
  useActiveNestling,
  useNestlingActions,
} from "@/stores/useNestlingStore";
import { useAlbumModal } from "@/stores/useModalStore";

export default function GalleryEditor() {
  const activeNestling = useActiveNestling();
  if (!activeNestling) return;

  const albums = useAlbums();
  const { getImages, getAlbums, selectImages } = useGalleryActions();

  const [title, setTitle] = useState(activeNestling.title);
  const [albumId, setAlbumId] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [currentView, setCurrentView] = useState<"main" | "album">("main");

  const { updateNestling } = useNestlingActions();
  const { openAlbumModal } = useAlbumModal();

  const nestlingData = useMemo(() => ({ title }), [title]);
  useAutoSave(activeNestling.id!, nestlingData, updateNestling);

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

  const handleSelectImage = async () => {
    try {
      setIsUploading(true);
      const selected = await selectImages(activeNestling.id, albumId);
      if (selected) {
        toast.success("Image uploaded successfully!");
      } else {
        toast.error("No image selected");
      }
      setIsUploading(false);
    } catch (error) {
      toast.error("Failed to upload image");
    }
  };

  useEffect(() => {
    setTitle(activeNestling.title);
  }, [activeNestling.title]);

  useEffect(() => {
    getImages(activeNestling.id);
    getAlbums(activeNestling.id);
  }, [getImages, getAlbums, activeNestling.id]);

  return (
    <div className="relative space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-4">
          {currentView === "album" && (
            <button
              onClick={() => {
                setCurrentView("main");
                setAlbumId(null);
              }}
              className="text-gray-500 transition hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <NestlingTitle
            title={title}
            setTitle={setTitle}
            nestling={activeNestling}
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSelectImage}
            disabled={isUploading}
            className="flex items-center gap-2 rounded-lg bg-blue-500 px-3 py-1.5 text-sm text-white shadow transition-colors hover:bg-blue-600"
          >
            {isUploading ? (
              <Loader size={16} className="flex-shrink-0 animate-spin" />
            ) : (
              <Upload size={16} className="flex-shrink-0" />
            )}
            <span className="hidden md:block">
              {isUploading ? "Uploading..." : "Add Images"}
            </span>
          </button>

          <button
            onClick={() => openAlbumModal(activeNestling.id)}
            className={cn(
              "flex items-center gap-2 rounded-lg bg-teal-500 px-3 py-1.5 text-sm text-white shadow transition-colors hover:bg-teal-600",
              albumId !== null ? "hidden" : "",
            )}
          >
            <Plus size={16} className="flex-shrink-0" />
            <span className="hidden md:block">Add Album</span>
          </button>
        </div>
      </div>

      <div className="relative">
        <AnimatePresence mode="sync" initial={false} custom={direction}>
          {currentView === "main" ? (
            <MainView
              variants={viewVariants}
              direction={direction}
              setCurrentView={setCurrentView}
              setAlbumId={setAlbumId}
            />
          ) : (
            <AlbumView
              key="album"
              album={currentAlbum}
              variants={viewVariants}
              direction={direction}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
