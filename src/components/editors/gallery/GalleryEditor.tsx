import useAutoSave from "@/hooks/useAutoSave";
import { toast } from "@/lib/utils/toast";
import { useGalleryActions, useImages } from "@/stores/useGalleryStore";
import {
  useActiveNestling,
  useNestlingActions,
} from "@/stores/useNestlingStore";
import { Image, Loader, Upload } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import "react-photo-album/rows.css";
import "yet-another-react-lightbox/styles.css";
import NestlingTitle from "../NestlingTitle";
import ImageLayout from "./ImageLayout";
import LayoutToggle from "./LayoutToggle";

export default function GalleryEditor() {
  const activeNestling = useActiveNestling();
  if (!activeNestling) return;

  const images = useImages();
  const { getImages } = useGalleryActions();
  const { updateNestling } = useNestlingActions();
  const { selectImages } = useGalleryActions();

  const [title, setTitle] = useState(activeNestling.title);
  const nestlingData = useMemo(() => ({ title }), [title]);
  useAutoSave(activeNestling.id!, nestlingData, updateNestling);

  const [layoutMode, setLayoutMode] = useState<"row" | "column">("row");
  const [isUploading, setIsUploading] = useState(false);

  const handleSelectImage = async () => {
    try {
      setIsUploading(true);
      await selectImages(activeNestling.id!);
      toast.success("Image uploaded successfully!");
      setIsUploading(false);
    } catch (error) {
      toast.error("Failed to upload image.");
    }
  };

  useEffect(() => {
    setTitle(activeNestling.title);
  }, [activeNestling.title]);

  useEffect(() => {
    getImages(activeNestling.id);
  }, [getImages, activeNestling.id]);

  // const [albumId, setAlbumId] = useState<number | null>(null);
  // const [isUploading, setIsUploading] = useState(false);
  // const [currentView, setCurrentView] = useState<"main" | "album">("main");

  // const currentAlbum = albums.find((album) => album.id === albumId) ?? null;

  // const direction = currentView === "album" ? 1 : -1;
  // const viewVariants = {
  //   enter: (direction: number) => ({
  //     x: direction > 0 ? "150%" : "-150%",
  //   }),
  //   center: { x: 0 },
  //   exit: (direction: number) => ({
  //     x: direction > 0 ? "-150%" : "150%",
  //   }),
  // };

  // const handleSelectImage = async () => {
  //   try {
  //     setIsUploading(true);
  //     const selected = await selectImages(activeNestling.id, albumId);
  //     if (selected) {
  //       toast.success("Image uploaded successfully!");
  //     } else {
  //       toast.error("No image selected.");
  //     }
  //     setIsUploading(false);
  //   } catch (error) {
  //     toast.error("Failed to upload image.");
  //   }
  // };

  // const activeDraggingImageId = useGalleryStore(
  //   (state) => state.activeDraggingImageId,
  // );

  // const sensors = useSensors(
  //   useSensor(PointerSensor, {
  //     activationConstraint: {
  //       distance: 8,
  //     },
  //   }),
  // );

  // const onDragStart = (event: DragStartEvent) => {
  //   handleDragStart(event);
  // };

  // const onDragEnd = (event: DragEndEvent) => {
  //   try {
  //     handleDragEnd(event);
  //     toast.success("Image moved successfully!");
  //   } catch (error) {
  //     toast.error("Failed to move image.");
  //   }
  // };

  // const draggingImage = activeDraggingImageId
  //   ? images.find((img) => img.id === parseInt(activeDraggingImageId))
  //   : null;

  return (
    <div className="flex flex-col gap-2">
      <NestlingTitle
        title={title}
        setTitle={setTitle}
        nestling={activeNestling}
      />

      <div className="flex flex-col">
        <div className="mb-1 flex flex-row items-center gap-2">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Image size={20} />
            Your Images ({images.length})
          </h2>

          <button
            onClick={handleSelectImage}
            disabled={isUploading}
            className="ml-auto flex items-center gap-2 rounded-lg bg-blue-500 px-3 py-1.5 text-sm text-white shadow transition-colors hover:bg-blue-600"
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

          <LayoutToggle layoutMode={layoutMode} setLayoutMode={setLayoutMode} />
        </div>

        <ImageLayout layoutMode={layoutMode} />
      </div>

      {/*<div className="flex gap-3">
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
        </div>*/}
    </div>
  );
}
