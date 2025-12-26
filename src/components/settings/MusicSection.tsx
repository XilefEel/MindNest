import {
  useActiveMusicId,
  useActiveNestId,
  useMusic,
  useNestActions,
} from "@/stores/useNestStore";
import { Music, Pause, Play, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { BackgroundMusic } from "@/lib/types/background-music";
import { cn } from "@/lib/utils/general";

export default function MusicSection() {
  const activeNestId = useActiveNestId();
  const activeMusicId = useActiveMusicId();
  const music = useMusic();
  const { selectMusic, deleteMusic, setActiveMusicId } = useNestActions();

  const handlePlayMusic = async (music: BackgroundMusic) => {
    try {
      if (activeMusicId === music.id) {
        setActiveMusicId(null);
      } else {
        setActiveMusicId(music.id);
      }
    } catch (error) {
      console.error("Failed to play music:", error);
    }
  };

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

  const handleDeleteMusic = async (musicId: number) => {
    try {
      await deleteMusic(musicId);
      toast.success("Music deleted successfully!");
    } catch (error) {
      console.error("Failed to delet music:", error);
      toast.error("Failed to delet music");
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

      <div className="max-h-72 space-y-1 overflow-y-auto rounded-lg bg-gray-50 p-2 dark:bg-gray-700/30">
        {music.length === 0 ? (
          <p className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
            No music yet
          </p>
        ) : (
          music.map((track) => (
            <div
              key={track.id}
              className={cn(
                "group flex items-center gap-3 rounded-md p-2 transition-colors duration-150",
                activeMusicId === track.id
                  ? "bg-purple-100 dark:bg-purple-900/40"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700",
              )}
            >
              <button
                onClick={() => handlePlayMusic(track)}
                className="flex size-10 items-center justify-center rounded-md bg-purple-500 text-white transition hover:bg-purple-600"
              >
                {activeMusicId === track.id ? (
                  <Pause size={18} />
                ) : (
                  <Play size={18} />
                )}
              </button>

              <div className="flex flex-1 items-center gap-2">
                <Music size={16} className="text-gray-400" />
                <span
                  className={cn(
                    "text-sm font-medium",
                    activeMusicId === track.id &&
                      "text-purple-700 dark:text-purple-400",
                  )}
                >
                  Track {track.id}
                </span>
              </div>

              <button
                onClick={() => handleDeleteMusic(track.id)}
                className="rounded-md p-1.5 text-gray-400 opacity-0 transition group-hover:opacity-100 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
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
