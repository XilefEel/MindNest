import { cn } from "@/lib/utils/general";
import {
  useNestActions,
  useActiveMusicId,
  useAudioIsPaused,
  useAudioCurrentTime,
  useMusic,
} from "@/stores/useNestStore";
import { Music, Pause, Play, X } from "lucide-react";
import { useState } from "react";

export default function FloatingMusicPlayer() {
  const { setActiveMusicId, setAudioIsPaused } = useNestActions();
  const music = useMusic();
  const activeMusicId = useActiveMusicId();
  const audioIsPaused = useAudioIsPaused();
  const audioCurrentTime = useAudioCurrentTime();

  const [isLowered, setIsLowered] = useState(false);

  const handleLower = () => setIsLowered(!isLowered);

  const activeMusic = music.find((m) => m.id === activeMusicId);
  if (!activeMusic) return null;

  const progress = (audioCurrentTime / activeMusic.durationSeconds) * 100;

  const handlePlayPause = () => {
    setAudioIsPaused(!audioIsPaused);
  };

  const handleClose = () => {
    setActiveMusicId(null);
  };

  return (
    <div
      onDoubleClick={handleLower}
      className={cn(
        "fixed right-5 bottom-5 z-50 w-96 rounded-xl bg-white/30 p-4 shadow-lg backdrop-blur-md transition-all duration-200 dark:bg-black/30",
        isLowered && "translate-y-18",
      )}
    >
      <div className="flex items-center gap-3">
        <div className="flex size-12 items-center justify-center rounded-lg bg-purple-500 text-white">
          <Music size={20} />
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
            {activeMusic.title}
          </p>
          <span className="text-xs text-gray-500 tabular-nums dark:text-gray-400">
            {Math.floor(audioCurrentTime / 60)}:
            {String(Math.floor(audioCurrentTime % 60)).padStart(2, "0")} /{" "}
            {Math.floor(activeMusic.durationSeconds / 60)}:
            {String(activeMusic.durationSeconds % 60).padStart(2, "0")}
          </span>
        </div>

        <button
          onClick={handlePlayPause}
          onDoubleClick={(e) => {
            e.stopPropagation();
          }}
          className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-purple-500 text-white transition hover:bg-purple-600"
        >
          {audioIsPaused ? <Play size={16} /> : <Pause size={16} />}
        </button>

        <button
          onClick={handleClose}
          className="flex cursor-pointer items-center justify-center text-gray-400 transition hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X size={16} />
        </button>
      </div>

      <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-600">
        <div
          className="h-full rounded-full bg-purple-500 transition-all duration-100 dark:bg-purple-400"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
