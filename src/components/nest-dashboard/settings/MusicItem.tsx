import { BackgroundMusic } from "@/lib/types/background-music";
import { cn } from "@/lib/utils/general";
import {
  useActiveMusicId,
  useAudioCurrentTime,
  useAudioIsPaused,
  useNestActions,
} from "@/stores/useNestStore";
import { Music, Pause, Play, Trash2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { toast } from "@/lib/utils/toast";

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = String(Math.floor(seconds % 60)).padStart(2, "0");
  return `${mins}:${secs}`;
};

export default function MusicItem({ track }: { track: BackgroundMusic }) {
  const { deleteMusic, setActiveMusicId, setAudioIsPaused, updateMusic } =
    useNestActions();
  const activeMusicId = useActiveMusicId();
  const audioIsPaused = useAudioIsPaused();
  const audioCurrentTime = useAudioCurrentTime();

  const [title, setTitle] = useState(track.title);
  const [isEditing, setIsEditing] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const shouldSaveRef = useRef(true);

  const isActive = activeMusicId === track.id;
  const isPlaying = isActive && !audioIsPaused;
  const currentTime = isActive ? audioCurrentTime : 0;
  const progress = Math.min(
    100,
    (currentTime / track.durationSeconds) * 100 || 0,
  );

  const handlePlayMusic = () => {
    if (activeMusicId === track.id) {
      setAudioIsPaused(!audioIsPaused);
    } else {
      setActiveMusicId(track.id);
      setAudioIsPaused(false);
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleBlur = async () => {
    setIsEditing(false);
    if (!shouldSaveRef.current) {
      shouldSaveRef.current = true;
      return;
    }
    if (title.trim() === "") {
      setTitle(track.title);
      return;
    }
    if (title !== track.title) {
      try {
        await updateMusic(track.id, title, track.orderIndex);
        toast.success("Music title updated successfully!");
      } catch (error) {
        toast.error("Failed to update music title.");
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      shouldSaveRef.current = true;
      e.currentTarget.blur();
    }
    if (e.key === "Escape") {
      shouldSaveRef.current = false;
      setTitle(track.title);
      e.currentTarget.blur();
    }
  };

  const handleDeleteMusic = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteMusic(track.id);
      toast.success("Music deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete music.");
    }
  };

  useEffect(() => setTitle(track.title), [track.title]);

  useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);

  return (
    <div
      onClick={handlePlayMusic}
      className={cn(
        "group relative flex aspect-square w-full cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border p-3 transition-colors",
        isActive
          ? "border-teal-400 bg-teal-50 dark:border-teal-500/60 dark:bg-teal-950/40"
          : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700/50",
      )}
    >
      <button
        onClick={handleDeleteMusic}
        className={cn(
          "absolute top-2 right-2 rounded-full p-1.5 opacity-0 shadow-md transition-all group-hover:opacity-100",
          "bg-white/80 hover:bg-red-50 dark:bg-zinc-900/80 dark:hover:bg-red-950",
          "text-zinc-500 hover:text-red-500 dark:text-zinc-400 dark:hover:text-red-400",
        )}
      >
        <Trash2 className="size-3.5 shrink-0" />
      </button>

      <div
        className={cn(
          "flex size-12 items-center justify-center rounded-full transition-colors",
          isActive
            ? "bg-teal-500 text-white"
            : "bg-zinc-100 text-zinc-500 group-hover:bg-teal-500 group-hover:text-white dark:bg-zinc-700 dark:text-zinc-300",
        )}
      >
        {isPlaying ? (
          <Pause size={20} fill="currentColor" />
        ) : isActive ? (
          <Play size={20} fill="currentColor" className="ml-0.5" />
        ) : (
          <>
            <Music size={18} className="group-hover:hidden" />
            <Play
              size={18}
              fill="currentColor"
              className="ml-0.5 hidden group-hover:block"
            />
          </>
        )}
      </div>

      <div
        className="flex w-full flex-col items-center"
        onDoubleClick={handleDoubleClick}
      >
        <div
          className={cn(
            "max-w-full truncate rounded text-center text-sm font-medium text-zinc-700 dark:text-zinc-200",
            isActive && "text-teal-700 dark:text-teal-300",
            isEditing &&
              "bg-white px-2 py-0.5 shadow ring-2 ring-teal-500 dark:bg-zinc-900",
          )}
          onClick={(e) => isEditing && e.stopPropagation()}
        >
          <input
            ref={inputRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onClick={(e) => e.stopPropagation()}
            readOnly={!isEditing}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            className={cn(
              "w-full truncate bg-transparent text-center focus:outline-none",
              !isEditing && "pointer-events-none",
            )}
          />
        </div>

        <span className="text-xs text-zinc-400 tabular-nums dark:text-zinc-500">
          {formatTime(track.durationSeconds)}
        </span>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-1 bg-zinc-100 dark:bg-zinc-700">
        <div
          style={isActive ? { width: `${progress}%` } : undefined}
          className={cn(
            "h-full bg-teal-500 transition-all duration-100 dark:bg-teal-400",
            !isActive && "w-0",
          )}
        />
      </div>
    </div>
  );
}
