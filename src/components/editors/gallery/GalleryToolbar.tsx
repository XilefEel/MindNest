import IconButton from "@/components/ui/icon-button";
import { openAppFolder } from "@/lib/utils/general";
import { toast } from "@/lib/utils/toast";
import { useGalleryActions, useImages } from "@/stores/useGalleryStore";
import { useActiveNestling } from "@/stores/useNestlingStore";
import { Download, FolderOpen, Loader, Upload } from "lucide-react";
import { useState } from "react";
import LayoutToggle from "./LayoutToggle";

export default function GalleryToolbar({
  layoutMode,
  setLayoutMode,
}: {
  layoutMode: "row" | "column";
  setLayoutMode: (mode: "row" | "column") => void;
}) {
  const activeNestling = useActiveNestling();

  const images = useImages();
  const { selectImages, downloadAll } = useGalleryActions();

  const [isUploading, setIsUploading] = useState(false);

  const handleDownloadAll = async () => {
    if (!activeNestling) return;
    try {
      const selected = await downloadAll(activeNestling.id!);
      if (selected) {
        toast.success("Gallery downloaded successfully!");
      }
    } catch (error) {
      toast.error("Failed to download gallery.");
    }
  };

  const handleSelectImage = async () => {
    if (!activeNestling) return;
    try {
      setIsUploading(true);
      const selected = await selectImages(activeNestling.id!);
      if (selected) {
        toast.success("Image uploaded successfully!");
      }
      setIsUploading(false);
    } catch (error) {
      toast.error("Failed to upload image.");
    }
  };

  if (!activeNestling) return null;

  return (
    <>
      <IconButton
        label="Open Gallery Folder"
        onClick={() =>
          openAppFolder({ location: "roaming", subfolder: "gallery" })
        }
        Icon={FolderOpen}
        className="ml-auto"
      />

      <IconButton
        label="Download All"
        onClick={handleDownloadAll}
        disabled={images.length === 0}
        Icon={Download}
      />

      <IconButton
        label="Add Images"
        onClick={handleSelectImage}
        disabled={isUploading}
        Icon={isUploading ? Loader : Upload}
        className={isUploading ? "animate-spin" : undefined}
      />

      <LayoutToggle layoutMode={layoutMode} setLayoutMode={setLayoutMode} />
    </>
  );
}
