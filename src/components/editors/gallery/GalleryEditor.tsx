import { useEffect, useMemo, useState } from "react";
import { useAlbums, useGalleryActions } from "@/stores/useGalleryStore";
import { ArrowLeft, Plus, Upload } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import NestlingTitle from "../NestlingTitle";
import useAutoSave from "@/hooks/useAutoSave";
import "react-photo-album/rows.css";
import "yet-another-react-lightbox/styles.css";
import MainView from "./MainView";
import AlbumView from "./AlbumView";
import { cn } from "@/lib/utils/general";
import AlbumModal from "@/components/modals/AlbumModal";
import { toast } from "sonner";
import {
  useActiveNestling,
  useNestlingActions,
} from "@/stores/useNestlingStore";

export default function GalleryEditor() {
  const activeNestling = useActiveNestling();
  if (!activeNestling) return;

  const albums = useAlbums();
  const { getImages, getAlbums, selectImages } = useGalleryActions();

  const [title, setTitle] = useState(activeNestling.title);
  const [albumId, setAlbumId] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [currentView, setCurrentView] = useState<"main" | "album">("main");

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

  const { updateNestling } = useNestlingActions();
  const nestlingData = useMemo(() => ({ title }), [title]);
  useAutoSave(activeNestling.id!, nestlingData, updateNestling);

  useEffect(() => {
    setTitle(activeNestling.title);
  }, [activeNestling.title]);

  useEffect(() => {
    getAlbums(activeNestling.id);
    getImages(activeNestling.id);
  }, [getImages, activeNestling.id]);

  return (
    <div className="relative space-y-4">
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
          <NestlingTitle
            title={title}
            setTitle={setTitle}
            nestling={activeNestling}
          />
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
          <AlbumModal nestlingId={activeNestling.id}>
            <button
              className={cn(
                "flex items-center gap-2 rounded-lg bg-teal-500 px-3 py-1.5 text-white transition-colors hover:bg-teal-600",
                albumId !== null ? "hidden" : "",
              )}
            >
              <Plus className="size-4" />
              <span className="hidden md:block">Add Album</span>
            </button>
          </AlbumModal>
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
