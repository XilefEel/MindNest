import { cn } from "@/lib/utils/general";
import { useNestStore } from "@/stores/useNestStore";
import { convertFileSrc } from "@tauri-apps/api/core";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function BackgroundSection() {
  const {
    activeNestId,
    backgrounds,
    activeBackgroundId,
    setActiveBackgroundId,
    clearActiveBackgroundId,
    selectBackground,
    deleteBackground,
  } = useNestStore();

  const handleUploadBackground = async () => {
    try {
      const selected = await selectBackground(activeNestId!);
      if (selected) {
        toast.success("Image uploaded successfully!");
      } else {
        toast.error("No image selected");
      }
    } catch (error) {
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
        <h1 className="text-base font-semibold text-gray-900 dark:text-gray-100">
          Background
        </h1>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Customize your nest background
        </p>
      </div>

      <div className="space-y-2">
        <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">
          RECENT IMAGES
        </h3>

        <div className="grid max-h-46 grid-cols-2 gap-3 overflow-y-auto p-1.5 md:grid-cols-3">
          {backgrounds.length === 0 && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              No recent images
            </p>
          )}
          {backgrounds.map((image, index) => (
            <div
              key={index}
              className={cn(
                "group relative aspect-video cursor-pointer overflow-hidden rounded-xl transition-all duration-200",
                "ring-2 ring-offset-1",
                activeBackgroundId === image.id
                  ? "ring-teal-500 ring-offset-teal-100 dark:ring-teal-400 dark:ring-offset-teal-900/20"
                  : "ring-gray-200 ring-offset-transparent hover:ring-gray-300 dark:ring-gray-700 dark:hover:ring-gray-600",
              )}
            >
              <img
                src={convertFileSrc(image.filePath)}
                alt={`Background ${index + 1}`}
                className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                onClick={() => handleSelectBackground(image.id)}
                loading="lazy"
              />
              <button
                className="absolute top-1.5 right-1.5 cursor-pointer rounded-full bg-red-500/90 p-1.5 text-white opacity-0 shadow-lg backdrop-blur-sm transition-all group-hover:opacity-100 hover:bg-red-600"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteBackground(image.id);
                }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Choose a Photo
        </p>
        <div className="flex gap-2">
          {activeBackgroundId && (
            <button
              onClick={() => clearActiveBackgroundId()}
              className="rounded-lg bg-blue-500 px-4 py-1.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-600"
            >
              Clear
            </button>
          )}
          <button
            onClick={handleUploadBackground}
            className="rounded-lg bg-teal-500 px-4 py-1.5 text-sm font-medium text-white shadow-sm transition hover:bg-teal-600"
          >
            Browse
          </button>
        </div>
      </div>
    </div>
  );
}
