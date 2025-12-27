import { BackgroundMusic } from "@/lib/types/background-music";
import { cn } from "@/lib/utils/general";
import {
  useActiveBackgroundId,
  useActiveMusicId,
  useNestActions,
} from "@/stores/useNestStore";
import { Music, Pause, Play, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function MusicItem({ track }: { track: BackgroundMusic }) {
  const { deleteMusic, setActiveMusicId } = useNestActions();
  const activeMusicId = useActiveMusicId();
  const activeBackgroundId = useActiveBackgroundId();

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
        "group flex items-center gap-3 rounded-md p-2 transition-colors duration-200",
        activeMusicId === track.id
          ? activeBackgroundId
            ? "bg-purple-100/80 dark:bg-purple-900/40"
            : "bg-purple-100 dark:bg-purple-900/40"
          : activeBackgroundId
            ? "hover:bg-white/40 dark:hover:bg-black/40"
            : "hover:bg-gray-100 dark:hover:bg-gray-700",
      )}
    >
      <button
        onClick={() => handlePlayMusic(track)}
        className="flex size-10 cursor-pointer items-center justify-center rounded-md bg-purple-500 text-white transition hover:bg-purple-600"
      >
        {activeMusicId === track.id ? <Pause size={18} /> : <Play size={18} />}
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
        className="cursor-pointer rounded-md p-1.5 text-gray-400 opacity-0 transition group-hover:opacity-100 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
