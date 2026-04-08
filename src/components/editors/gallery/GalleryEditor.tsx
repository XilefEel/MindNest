import useAutoSave from "@/hooks/useAutoSave";
import { useGalleryActions, useImages } from "@/stores/useGalleryStore";
import {
  useActiveNestling,
  useNestlingActions,
} from "@/stores/useNestlingStore";
import { Image } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import "react-photo-album/rows.css";
import "yet-another-react-lightbox/styles.css";
import NestlingTitle from "../NestlingTitle";
import GalleryToolbar from "./GalleryToolbar";
import ImageLayout from "./ImageLayout";

export default function GalleryEditor() {
  const activeNestling = useActiveNestling();
  if (!activeNestling) return;

  const images = useImages();
  const { getImages } = useGalleryActions();
  const { updateNestling } = useNestlingActions();

  const [title, setTitle] = useState(activeNestling.title);
  const nestlingData = useMemo(() => ({ title }), [title]);
  useAutoSave(activeNestling.id!, nestlingData, updateNestling);

  const [layoutMode, setLayoutMode] = useState<"row" | "column">("row");

  useEffect(() => {
    setTitle(activeNestling.title);
  }, [activeNestling.title]);

  useEffect(() => {
    getImages(activeNestling.id);
  }, [getImages, activeNestling.id]);

  return (
    <div className="flex flex-col gap-4">
      <NestlingTitle
        title={title}
        setTitle={setTitle}
        nestling={activeNestling}
      />

      <div className="flex flex-col">
        <div className="mb-1 flex flex-row items-center gap-1">
          <h2 className="flex items-center gap-2 font-semibold text-gray-800 dark:text-gray-200">
            <Image size={20} />
            Your Images ({images.length})
          </h2>

          <GalleryToolbar
            layoutMode={layoutMode}
            setLayoutMode={setLayoutMode}
          />
        </div>

        <ImageLayout layoutMode={layoutMode} />
      </div>
    </div>
  );
}
