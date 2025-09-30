import { cn } from "@/lib/utils/general";
import { useNestStore } from "@/stores/useNestStore";
import { toast } from "sonner";
import { convertFileSrc } from "@tauri-apps/api/core";
import { Trash2 } from "lucide-react";

export default function NestSettings() {
  const {
    activeNestId,
    backgrounds,
    activeBackgroundId,
    setActiveBackgroundId,
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
    <div className="space-y-6">
      <div className="space-y-3">
        <h1 className="text-sm font-medium text-gray-900 dark:text-gray-100">
          Background
        </h1>

        <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">
          Recent Images
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {backgrounds.map((image, index) => (
            <div
              key={index}
              className={cn(
                "aspect-video cursor-pointer overflow-hidden rounded-lg border-2 transition-all",
                activeBackgroundId === image.id
                  ? "border-teal-500 dark:ring-teal-800"
                  : "border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-500",
              )}
            >
              <div className="relative">
                <img
                  src={convertFileSrc(image.file_path)}
                  alt={`Background ${index + 1}`}
                  className="h-full w-full rounded-lg object-cover"
                  onClick={() => handleSelectBackground(image.id)}
                />
                <button
                  className="absolute top-1 right-1 cursor-pointer rounded-full bg-red-500 p-1.5 text-white shadow transition hover:bg-red-600"
                  onClick={(e) => {
                    e.stopPropagation;
                    handleDeleteBackground(image.id);
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between space-y-2">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Choose a Photo
          </p>
          <button
            onClick={handleUploadBackground}
            className="rounded-lg bg-teal-500 px-4 py-1.5 text-sm font-medium text-white shadow-sm transition hover:bg-teal-600 focus:ring-2 focus:ring-teal-400 focus:outline-none"
          >
            Browse
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Reset Settings
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Restore all settings to defaults
          </p>
        </div>
        <button className="rounded-md bg-red-600 px-3 py-1 text-sm text-white transition-colors hover:bg-red-700">
          Reset
        </button>
      </div>
    </div>
  );
}
