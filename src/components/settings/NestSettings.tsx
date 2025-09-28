import { cn } from "@/lib/utils/general";
import { useState } from "react";

export default function NestSettings() {
  const [selectedBackground, setSelectedBackground] = useState(0);

  // Placeholder images for demo
  const uploadedImages = [
    "/api/placeholder/150/100",
    "/api/placeholder/150/100",
    "/api/placeholder/150/100",
  ];
  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <h1 className="text-sm font-medium text-gray-900 dark:text-gray-100">
          Background
        </h1>

        <div className="aspect-video overflow-hidden rounded-lg border-gray-200">
          <img
            src={uploadedImages[selectedBackground]}
            alt={`Background ${selectedBackground + 1}`}
            className="h-full w-full object-cover"
          />
        </div>

        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
          Recent Images
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {uploadedImages.map((image, index) => (
            <div
              key={index}
              className={cn(
                "aspect-video cursor-pointer overflow-hidden rounded-lg border-2 transition-all",
                selectedBackground === index
                  ? "border-teal-500 dark:ring-teal-800"
                  : "border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-500",
              )}
              onClick={() => setSelectedBackground(index)}
            >
              <img
                src={image}
                alt={`Background ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>

        <div></div>
        <div className="flex items-center justify-between space-y-2">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Choose a Photo
          </p>
          <button className="rounded-lg border border-gray-300 bg-gray-100 px-4 py-1 text-sm text-gray-700 transition-colors hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
            Browse Photo
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
