import { cn } from "@/lib/utils/general";
import { useNestlingStore } from "@/stores/useNestlingStore";
import { useNestStore } from "@/stores/useNestStore";
import { ArrowRight, Folder, Pin } from "lucide-react";

export default function PinnedSection() {
  const { activeBackgroundId } = useNestStore();
  const { nestlings, setActiveNestlingId } = useNestlingStore();
  const pinnedNestlings = nestlings.filter((n) => n.is_pinned === true);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-gradient-to-br from-pink-400 to-pink-500 p-2 shadow-md">
          <Pin className="h-5 w-5 text-white" />
        </div>
        <h2 className="text-xl font-bold md:text-2xl">Pinned Nestlings</h2>
      </div>

      <div className="space-y-3">
        {pinnedNestlings.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400">
            No pinned nestlings
          </p>
        )}
        {pinnedNestlings.map((nestling, i) => (
          <div
            key={i}
            onClick={() => {
              setActiveNestlingId(nestling.id);
            }}
            className={cn(
              "group cursor-pointer rounded-xl border border-l-4 p-4 hover:shadow-md",
              "bg-white dark:bg-gray-800",
              "border-gray-200 border-l-pink-500 hover:border-pink-500 dark:border-gray-800 dark:border-l-pink-500 dark:hover:hover:border-pink-500",
              "transition hover:scale-105",
              activeBackgroundId &&
                "bg-white/10 backdrop-blur-sm dark:bg-black/10",
            )}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {nestling.title}
                </p>
                <div className="mt-1 flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                  <Folder className="h-4 w-4" />
                  <span>{nestling.folder_id}</span>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-300 transition" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
