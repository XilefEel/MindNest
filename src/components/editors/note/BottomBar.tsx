import { cn } from "@/lib/utils/general";
import { useActiveBackgroundId } from "@/stores/useNestStore";
import { Loader2, Check, AlertCircle, ListCheck } from "lucide-react";

export default function BottomBar({
  autoSaveStatus,
  wordCount,
  taskStats,
}: {
  autoSaveStatus: "idle" | "saving" | "saved" | "error";
  wordCount: number;
  taskStats: {
    total: number;
    completed: number;
  };
}) {
  const activeBackgroundId = useActiveBackgroundId();

  return (
    <div
      className={cn(
        "flex w-full items-center gap-6 rounded-lg bg-zinc-50/80 px-3 py-2 text-xs backdrop-blur-sm dark:bg-zinc-900/80",
        activeBackgroundId && "bg-white/50 dark:bg-black/50",
      )}
    >
      <div className="mr-auto flex items-center gap-2">
        {autoSaveStatus === "saving" && (
          <>
            <Loader2 className="h-3 w-3 animate-spin text-blue-500" />
            <span className="text-blue-600 dark:text-blue-400">Saving...</span>
          </>
        )}
        {autoSaveStatus === "saved" && (
          <>
            <Check className="h-3 w-3 text-green-500" />
            <span className="text-green-600 dark:text-green-400">
              All changes saved
            </span>
          </>
        )}
        {autoSaveStatus === "error" && (
          <>
            <AlertCircle className="h-3 w-3 text-red-500" />
            <span className="text-red-600 dark:text-red-400">
              Failed to save
            </span>
          </>
        )}
        {autoSaveStatus === "idle" && (
          <span className="text-zinc-500 dark:text-zinc-400">Ready</span>
        )}
      </div>

      {taskStats.total > 0 && (
        <div className="flex items-center gap-1.5">
          <ListCheck className="size-4 text-zinc-500 opacity-0 md:opacity-100 dark:text-zinc-400" />

          <div className="h-1.5 w-20 overflow-hidden rounded-full bg-zinc-200 md:w-24 dark:bg-zinc-700">
            <div
              className="h-full rounded-full bg-teal-500 transition-all"
              style={{
                width: `${(taskStats.completed / taskStats.total) * 100}%`,
              }}
            />
          </div>

          <span className="font-medium text-zinc-500 dark:text-zinc-400">
            {taskStats.completed}/{taskStats.total}
          </span>
        </div>
      )}

      <div className="flex items-center gap-4">
        <span className="font-medium">
          {wordCount.toLocaleString()} {wordCount === 1 ? "word" : "words"}
        </span>
      </div>
    </div>
  );
}
