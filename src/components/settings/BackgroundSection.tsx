import { cn } from "@/lib/utils/general";
import {
  useActiveBackgroundId,
  useActiveNestId,
  useBackgrounds,
  useNestActions,
} from "@/stores/useNestStore";
import { convertFileSrc } from "@tauri-apps/api/core";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function BackgroundSection() {
  const activeNestId = useActiveNestId();
  const backgrounds = useBackgrounds();
  const activeBackgroundId = useActiveBackgroundId();
  const {
    setActiveBackgroundId,
    clearActiveBackgroundId,
    selectBackground,
    deleteBackground,
  } = useNestActions();

  const handleUploadBackground = async () => {
    try {
      const selected = await selectBackground(activeNestId!);
      if (selected) {
        toast.success("Image uploaded successfully!");
      } else {
        toast.error("No image selected");
      }
    } catch (error) {
      console.error("Failed to upload image:", error);
      toast.error("Failed to upload image");
    }
  };

  const handleSelectBackground = async (id: number) => {
    try {
      setActiveBackgroundId(id);
      toast.success("Image selected successfully!");
    } catch (error) {
      toast.error("Failed to select image");
    }
  };

  const handleDeleteBackground = async (id: number) => {
    try {
      await deleteBackground(id);
      toast.success("Image deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete image");
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
          Background
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Customize your nest background
        </p>
      </div>

      <div className="grid max-h-72 grid-cols-2 gap-3 overflow-y-auto p-1 md:grid-cols-3">
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
                "group relative aspect-video cursor-pointer overflow-hidden rounded-lg ring-2 transition-all duration-150",
                activeBackgroundId === image.id
                  ? "ring-teal-500 dark:ring-teal-400"
                  : "ring-gray-200 hover:ring-gray-300 dark:ring-gray-700 dark:hover:ring-gray-600",
              )}
            >
              <img
                src={convertFileSrc(image.filePath)}
                alt="Background"
                className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                loading="lazy"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteBackground(image.id);
                }}
                className="absolute top-2 right-2 cursor-pointer rounded-full bg-red-500/90 p-1.5 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 hover:bg-red-600"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))
        )}
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
          {activeBackgroundId && (
            <button
              onClick={() => clearActiveBackgroundId()}
              className="cursor-pointer rounded-lg bg-blue-500 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-blue-600"
            >
              Clear
            </button>
          )}
          <button
            onClick={handleUploadBackground}
            className="cursor-pointer rounded-lg bg-teal-500 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-teal-600"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
}
