import {
  useActiveBackgroundId,
  useActiveNestId,
  useMusic,
  useMusicVolume,
  useNestActions,
} from "@/stores/useNestStore";
import { toast } from "@/lib/utils/toast";
import { cn } from "@/lib/utils/general";
import MusicItem from "./MusicItem";
import {
  DndContext,
  PointerSensor,
  rectIntersection,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { AnimatePresence } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { Slider } from "@/components/ui/slider";

export default function MusicSection() {
  const activeNestId = useActiveNestId();
  const activeBackgroundId = useActiveBackgroundId();
  const music = useMusic();
  const volume = useMusicVolume();
  const { selectMusic, handleDragStart, handleDragEnd, setMusicVolume } =
    useNestActions();

  const musicIds = music.map((m) => m.id);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

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

      <DndContext
        sensors={sensors}
        collisionDetection={rectIntersection}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div
          className={cn(
            "max-h-72 overflow-y-auto rounded-lg bg-gray-50 p-2 dark:bg-gray-700/30",
            activeBackgroundId && "bg-white/30 dark:bg-black/30",
          )}
        >
          <SortableContext
            items={musicIds}
            strategy={verticalListSortingStrategy}
          >
            <AnimatePresence mode="popLayout">
              {music.length === 0 ? (
                <p className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  No music yet
                </p>
              ) : (
                music.map((track) => <MusicItem key={track.id} track={track} />)
              )}
            </AnimatePresence>
          </SortableContext>
        </div>
      </DndContext>

      <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-700/30">
        {volume > 0 ? (
          <Volume2 className="h-4 w-4 text-gray-600 dark:text-gray-400" />
        ) : (
          <VolumeX className="h-4 w-4 text-gray-300 dark:text-gray-500" />
        )}
        <Slider
          value={[volume * 100]}
          onValueChange={(value) => setMusicVolume(value[0] / 100)}
          max={100}
          step={1}
          className="flex-1"
        />
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {Math.round(volume * 100)}%
        </span>
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
          className="rounded-lg bg-purple-500 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-purple-600"
        >
          Upload
        </button>
      </div>
    </div>
  );
}
