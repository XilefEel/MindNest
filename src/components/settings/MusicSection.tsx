import {
  useActiveBackgroundId,
  useActiveNestId,
  useMusic,
  useNestActions,
} from "@/stores/useNestStore";
import { toast } from "sonner";
import { cn } from "@/lib/utils/general";
import MusicItem from "./MusicItem";

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
        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
          Music
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Add background music to your nest
        </p>
      </div>

      <div
        className={cn(
          "max-h-72 space-y-1 overflow-y-auto rounded-lg bg-gray-50 p-2 dark:bg-gray-700/30",
          activeBackgroundId && "bg-white/30 dark:bg-black/30",
        )}
      >
        {music.length === 0 ? (
          <p className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
            No music yet
          </p>
        ) : (
          music.map((track) => <MusicItem key={track.id} track={track} />)
        )}
      </div>

      <div className="flex items-center justify-between pt-2">
        <div className="flex flex-col">
          <p className="text-sm text-gray-800 dark:text-gray-300">
            Choose a music track
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            MP3, WAV, OGG, or FLAC
          </p>
        </div>

        <button
          onClick={handleUploadMusic}
          className="cursor-pointer rounded-lg bg-purple-500 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-purple-600"
        >
          Upload
        </button>
      </div>
    </div>
  );
}
