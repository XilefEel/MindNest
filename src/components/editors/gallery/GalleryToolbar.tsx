import BaseToolTip from "@/components/BaseToolTip";
import { cn } from "@/lib/utils/general";
import { useGalleryActions, useImages } from "@/stores/useGalleryStore";
import { useActiveNestling } from "@/stores/useNestlingStore";
import { useActiveBackgroundId } from "@/stores/useNestStore";
import { Download, Loader, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import LayoutToggle from "./LayoutToggle";

export default function GalleryToolbar({
  layoutMode,
  setLayoutMode,
}: {
  layoutMode: "row" | "column";
  setLayoutMode: (mode: "row" | "column") => void;
}) {
  const activeNestling = useActiveNestling();
  if (!activeNestling) return null;

  const images = useImages();
  const activeBackgroundId = useActiveBackgroundId();
  const { selectImages, downloadAll } = useGalleryActions();

  const [isUploading, setIsUploading] = useState(false);

  const handleSelectImage = async () => {
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

  return (
    <>
      <BaseToolTip label="Download All">
        <button
          onClick={() => downloadAll(activeNestling.id!)}
          disabled={images.length === 0}
          className={cn(
            "ml-auto rounded p-2 transition-colors",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 dark:focus-visible:ring-teal-300",
            "hover:bg-gray-100 hover:text-teal-500 dark:hover:bg-gray-700 dark:hover:text-teal-400",
            "disabled:cursor-default disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-current dark:disabled:cursor-default dark:disabled:opacity-50 dark:disabled:hover:bg-transparent dark:disabled:hover:text-current",
            activeBackgroundId &&
              "hover:bg-white/30 hover:text-black dark:hover:bg-black/30",
          )}
        >
          <Download className="size-4 flex-shrink-0" />
        </button>
      </BaseToolTip>

      <BaseToolTip label="Add Images">
        <button
          onClick={handleSelectImage}
          disabled={isUploading}
          className={cn(
            "rounded p-2 transition-colors",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 dark:focus-visible:ring-teal-300",
            "hover:bg-gray-100 hover:text-teal-500 dark:hover:bg-gray-700 dark:hover:text-teal-400",
            "disabled:cursor-default disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-current dark:disabled:cursor-default dark:disabled:opacity-50 dark:disabled:hover:bg-transparent dark:disabled:hover:text-current",
            activeBackgroundId &&
              "hover:bg-white/30 hover:text-black dark:hover:bg-black/30",
          )}
        >
          {isUploading ? (
            <Loader className="size-4 flex-shrink-0 animate-spin" />
          ) : (
            <Upload className="size-4 flex-shrink-0" />
          )}
        </button>
      </BaseToolTip>

      <LayoutToggle layoutMode={layoutMode} setLayoutMode={setLayoutMode} />
    </>
  );
}
