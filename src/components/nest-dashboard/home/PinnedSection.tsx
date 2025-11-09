import { findFolderPath } from "@/lib/utils/folders";
import { cn } from "@/lib/utils/general";
import { getNestlingIcon } from "@/lib/utils/nestlings";
import { useNestlingStore } from "@/stores/useNestlingStore";
import { useNestStore } from "@/stores/useNestStore";
import { ArrowRight, Folder, Pin } from "lucide-react";

export default function PinnedSection() {
  const { activeBackgroundId } = useNestStore();
  const { nestlings, folders, setActiveNestlingId } = useNestlingStore();

  const pinnedNestlings = nestlings.filter((n) => n.isPinned === true);

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
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No pinned nestlings
          </p>
        )}

        {pinnedNestlings.map((nestling, i) => {
          const Icon = getNestlingIcon(nestling.nestlingType);
          return (
            <div
              key={i}
              onClick={() => setActiveNestlingId(nestling.id)}
              className={cn(
                "group cursor-pointer rounded-xl border border-l-4 p-4 hover:shadow-md",
                "bg-white dark:bg-gray-800",
                "border-gray-200 border-l-pink-500 hover:border-pink-500 dark:border-gray-800 dark:border-l-pink-500 dark:hover:hover:border-pink-500",
                "transition hover:scale-105",
                activeBackgroundId &&
                  "border-t-0 border-r-0 border-b-0 bg-white/10 backdrop-blur-sm dark:bg-black/10",
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1 font-semibold">
                    <div className="flex w-6 items-center justify-center">
                      {nestling.icon ? (
                        <p>{nestling.icon}</p>
                      ) : (
                        <Icon className="size-4 flex-shrink-0" />
                      )}
                    </div>

                    <span>{nestling.title}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                    <Folder className="h-4 w-6" />
                    <span>{findFolderPath(nestling.folderId, folders)}</span>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-300 transition" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
