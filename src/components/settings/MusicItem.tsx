import { BackgroundMusic } from "@/lib/types/background-music";
import { cn } from "@/lib/utils/general";
import {
  useActiveBackgroundId,
  useActiveMusicId,
  useAudioCurrentTime,
  useAudioIsPaused,
  useNestActions,
} from "@/stores/useNestStore";
import { Music, Pause, Play, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function MusicItem({ track }: { track: BackgroundMusic }) {
  const { deleteMusic, setActiveMusicId, setAudioIsPaused } = useNestActions();
  const activeMusicId = useActiveMusicId();
  const activeBackgroundId = useActiveBackgroundId();
  const audioIsPaused = useAudioIsPaused();
  const audioCurrentTime = useAudioCurrentTime();

  const isActive = activeMusicId === track.id;
  const isPlaying = isActive && !audioIsPaused;

  const currentTime = isActive ? audioCurrentTime : 0;
  const progress = (currentTime / track.durationSeconds) * 100;

  const handlePlayMusic = () => {
    if (activeMusicId === track.id) {
      setAudioIsPaused(!audioIsPaused);
    } else {
      setActiveMusicId(track.id);
      setAudioIsPaused(false);
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
    <div
      key={track.id}
      className={cn(
        "group rounded-md p-2 transition-colors duration-200",
        activeMusicId === track.id
          ? activeBackgroundId
            ? "bg-purple-100/80 dark:bg-purple-900/40"
            : "bg-purple-100 dark:bg-purple-900/40"
          : activeBackgroundId
            ? "hover:bg-white/40 dark:hover:bg-black/40"
            : "hover:bg-gray-100 dark:hover:bg-gray-700",
      )}
    >
      <div className="flex items-center gap-2">
        <button
          onClick={() => handlePlayMusic()}
          className="flex size-11 cursor-pointer items-center justify-center rounded-md bg-purple-500 text-white transition hover:bg-purple-600"
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
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
            <div className="flex flex-col">
              <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                {track.title}
              </p>
              <span className="text-xs text-gray-500 tabular-nums dark:text-gray-400">
                {Math.floor(track.durationSeconds / 60)}:
                {String(Math.floor(track.durationSeconds % 60)).padStart(
                  2,
                  "0",
                )}
              </span>
            </div>
          </span>
        </div>

        <button
          onClick={() => handleDeleteMusic(track.id)}
          className="cursor-pointer rounded-md p-1.5 text-gray-400 opacity-0 transition group-hover:opacity-100 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {isActive && (
        <div className="flex items-center gap-2 p-2 pb-1">
          <span className="text-xs text-gray-500 tabular-nums dark:text-gray-400">
            {Math.floor(currentTime / 60)}:
            {String(Math.floor(currentTime % 60)).padStart(2, "0")}
          </span>
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className="h-full bg-purple-500 transition-all duration-100 dark:bg-purple-400"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-gray-500 tabular-nums dark:text-gray-400">
            {Math.floor(track.durationSeconds / 60)}:
            {String(Math.floor(track.durationSeconds % 60)).padStart(2, "0")}
          </span>
        </div>
      )}
    </div>
  );
}
