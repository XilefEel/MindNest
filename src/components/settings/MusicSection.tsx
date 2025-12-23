import { cn } from "@/lib/utils/general";
import {
  useActiveBackgroundId,
  useActiveNestId,
  useMusic,
  useNestActions,
} from "@/stores/useNestStore";
import { convertFileSrc } from "@tauri-apps/api/core";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function MusicSection() {
  const activeNestId = useActiveNestId();
  const activeBackgroundId = useActiveBackgroundId();
  const music = useMusic();
  const { selectMusic } = useNestActions();

  const handleUploadMusic = async () => {
    try {
      const selected = await selectMusic(activeNestId!);
      if (selected) {
        toast.success("Music uploaded successfully!");
      } else {
        toast.error("No music selected");
      }
    } catch (error) {
      console.error("Failed to upload music:", error);
      toast.error("Failed to upload music");
    }
  };
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h1 className="text-base font-semibold text-gray-900 dark:text-gray-100">
          Music
        </h1>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Add background music to your nest
        </p>
      </div>

      <div className="space-y-2">
        <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">
          YOUR MUSIC
        </h3>
        {music.length === 0 && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            No music uploaded
          </p>
        )}
        <div className="grid max-h-46 grid-cols-2 gap-3 overflow-y-auto p-1.5 md:grid-cols-3">
          {music.map((music, index) => (
            <div key={index}>
              <div>{music.orderIndex}</div>
              <button
                className="absolute top-1.5 right-1.5 cursor-pointer rounded-full bg-red-500/90 p-1.5 text-white opacity-0 shadow-lg backdrop-blur-sm transition-all group-hover:opacity-100 hover:bg-red-600"
                onClick={(e) => {
                  e.stopPropagation();
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
          Choose a music track
        </p>
        <div className="flex gap-2">
          <button
            onClick={handleUploadMusic}
            className="rounded-lg bg-purple-500 px-4 py-1.5 text-sm font-medium text-white shadow-sm transition hover:bg-purple-600"
          >
            Browse
          </button>
        </div>
      </div>
    </div>
  );
}
