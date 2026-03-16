import { cn, openAppFolder } from "@/lib/utils/general";
import {
  useActiveBackgroundId,
  useActiveNestId,
  useBackgroundBrightness,
  useBackgrounds,
  useNestActions,
} from "@/stores/useNestStore";
import { convertFileSrc } from "@tauri-apps/api/core";
import { FolderOpen, Sun, SunDim, SunMedium, Trash2 } from "lucide-react";
import { toast } from "@/lib/utils/toast";
import { Slider } from "@/components/ui/slider";
import BaseToolTip from "@/components/BaseToolTip";

export default function BackgroundSection() {
  const activeNestId = useActiveNestId();
  const backgrounds = useBackgrounds();
  const activeBackgroundId = useActiveBackgroundId();
  const {
    setActiveBackgroundId,
    clearActiveBackgroundId,
    selectBackground,
    deleteBackground,
    setBackgroundBrightness,
  } = useNestActions();

  const brightness = useBackgroundBrightness();

  const handleUploadBackground = async () => {
    try {
      const selected = await selectBackground(activeNestId!);
      if (selected) {
        toast.success("Image uploaded successfully!");
      }
    } catch (error) {
      toast.error("Failed to upload image.");
    }
  };

  const handleSelectBackground = async (id: number) => {
    try {
      if (activeBackgroundId === id) {
        clearActiveBackgroundId();
      } else {
        setActiveBackgroundId(id);
      }
    } catch (error) {
      toast.error("Failed to select image.");
    }
  };

  const handleDeleteBackground = async (id: number) => {
    try {
      await deleteBackground(id);
      toast.success("Image deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete image.");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            Background
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Customize your nest background
          </p>
        </div>

        <BaseToolTip label="Open Backgrounds Folder">
          <button
            onClick={() =>
              openAppFolder({ location: "roaming", subfolder: "backgrounds" })
            }
            className={cn(
              "ml-auto rounded p-2 transition-colors",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 dark:focus-visible:ring-teal-300",
              "hover:bg-gray-50 hover:text-teal-500 dark:hover:bg-gray-700 dark:hover:text-teal-400",
              "disabled:cursor-default disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-current dark:disabled:cursor-default dark:disabled:opacity-50 dark:disabled:hover:bg-transparent dark:disabled:hover:text-current",
              activeBackgroundId &&
                "hover:bg-white/30 hover:text-black dark:hover:bg-black/30",
            )}
          >
            <FolderOpen className="size-4 flex-shrink-0" />
          </button>
        </BaseToolTip>
      </div>

      <div className="max-h-72 overflow-y-auto">
        <div className="grid grid-cols-2 gap-3 p-1 sm:grid-cols-3">
          {backgrounds.length === 0 ? (
            <p className="col-span-full text-sm text-gray-500 dark:text-gray-400">
              No images yet
            </p>
          ) : (
            backgrounds.map((image) => (
              <div
                key={image.id}
                onClick={() => handleSelectBackground(image.id)}
                className={cn(
                  "group relative aspect-video overflow-hidden rounded-lg ring-2 transition-all",
                  activeBackgroundId === image.id
                    ? "ring-teal-500 dark:ring-teal-400"
                    : activeBackgroundId
                      ? "ring-black/10 hover:ring-black/20 dark:ring-white/10 dark:hover:ring-white/20"
                      : "ring-gray-200 hover:ring-gray-300 dark:ring-gray-700 dark:hover:ring-gray-600",
                )}
              >
                <img
                  src={convertFileSrc(image.filePath)}
                  alt="Background"
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  loading="lazy"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteBackground(image.id);
                  }}
                  className={cn(
                    "absolute top-2 right-2 rounded-full p-1.5 opacity-0 shadow-md transition-all group-hover:opacity-100",
                    "bg-white/80 hover:bg-red-50 dark:bg-gray-900/80 dark:hover:bg-red-950",
                    "text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400",
                  )}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div
        className={cn(
          "flex items-center gap-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-700/30",
          activeBackgroundId && "bg-white/30 dark:bg-black/30",
        )}
      >
        {brightness > 1.33 ? (
          <Sun className="h-4 w-4 text-gray-600 dark:text-gray-400" />
        ) : brightness > 0.67 ? (
          <SunMedium className="h-4 w-4 text-gray-600 dark:text-gray-400" />
        ) : (
          <SunDim className="h-4 w-4 text-gray-600 dark:text-gray-400" />
        )}
        <Slider
          value={[brightness * 100]}
          onValueChange={(value) => setBackgroundBrightness(value[0] / 100)}
          max={200}
          step={1}
          className="flex-1"
        />
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {Math.round(brightness * 100)}%
        </span>
      </div>

      <div className="flex items-center justify-between pt-2">
        <div className="flex flex-col">
          <p className="text-sm text-gray-800 dark:text-gray-300">
            Choose a photo
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            PNG, JPEG, GIF, WebP, or BMP
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleUploadBackground}
            className="rounded-lg bg-teal-500 px-4 py-1.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-teal-600"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
}
