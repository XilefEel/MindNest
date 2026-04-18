import { BackgroundMusic } from "@/lib/types/background-music";
import { cn } from "@/lib/utils/general";
import {
  useActiveBackgroundId,
  useActiveMusicId,
  useAudioCurrentTime,
  useAudioIsPaused,
  useNestActions,
} from "@/stores/useNestStore";
import { useSortable } from "@dnd-kit/sortable";
import { Music, Pause, Play, Trash2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { toast } from "@/lib/utils/toast";

export default function MusicItem({ track }: { track: BackgroundMusic }) {
  const { deleteMusic, setActiveMusicId, setAudioIsPaused, updateMusic } =
    useNestActions();
  const activeMusicId = useActiveMusicId();
  const activeBackgroundId = useActiveBackgroundId();
  const audioIsPaused = useAudioIsPaused();
  const audioCurrentTime = useAudioCurrentTime();

  const [title, setTitle] = useState(track.title);
  const [isEditing, setIsEditing] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const shouldSaveRef = useRef(true);

  const isActive = activeMusicId === track.id;
  const isPlaying = isActive && !audioIsPaused;
  const currentTime = isActive ? audioCurrentTime : 0;
  const progress = (currentTime / track.durationSeconds) * 100;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: track.id,
    data: { type: "music", music: track },
  });

  const style = {
    transform: transform ? `translateY(${transform.y}px)` : undefined,
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = String(Math.floor(seconds % 60)).padStart(2, "0");
    return `${mins}:${secs}`;
  };

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

  const handleDeleteMusic = async () => {
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
      ref={setNodeRef}
      style={style}
      className={cn(
        "group rounded-md p-2 transition-colors",
        isActive
          ? activeBackgroundId
            ? "bg-teal-200/50 dark:bg-teal-900/50"
            : "bg-teal-100 dark:bg-teal-900/50"
          : activeBackgroundId
            ? "hover:bg-white/30 dark:hover:bg-black/30"
            : "hover:bg-gray-100 dark:hover:bg-gray-700",
      )}
    >
      <div className="flex items-center gap-2" {...listeners} {...attributes}>
        <button
          onClick={handlePlayMusic}
          className="flex size-11 items-center justify-center rounded-md bg-teal-500 text-white transition hover:bg-teal-600"
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </button>

        <div className="flex flex-1 items-center gap-2">
          <Music size={16} className="text-gray-400" />

          <div className="flex flex-col" onDoubleClick={handleDoubleClick}>
            <div
              className={cn(
                "truncate rounded text-sm font-medium text-gray-900 transition-all duration-200 dark:text-gray-100",
                isActive && "text-teal-600 dark:text-teal-400",
                isEditing &&
                  cn(
                    "px-2 py-0.5 shadow ring-2 ring-teal-500",
                    activeBackgroundId
                      ? "bg-white/10 backdrop-blur-sm dark:bg-black/10"
                      : "bg-white dark:bg-gray-800",
                  ),
              )}
            >
              <input
                ref={inputRef}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                readOnly={!isEditing}
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                className={cn(
                  "w-full truncate bg-transparent focus:outline-none",
                  !isEditing && "pointer-events-none",
                )}
              />
            </div>
            <span className="text-xs text-gray-500 tabular-nums dark:text-gray-400">
              {formatTime(track.durationSeconds)}
            </span>
          </div>
        </div>

        <button
          onClick={handleDeleteMusic}
          className="rounded-md p-1.5 text-gray-400 opacity-0 transition group-hover:opacity-100 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {isActive && (
        <div className="flex items-center gap-2 p-2 pb-1">
          <span className="text-xs text-gray-500 tabular-nums dark:text-gray-400">
            {formatTime(currentTime)}
          </span>
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className="h-full rounded-full bg-teal-500 transition-all duration-100 dark:bg-teal-400"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-gray-500 tabular-nums dark:text-gray-400">
            {formatTime(track.durationSeconds)}
          </span>
        </div>
      )}
    </div>
  );
}
