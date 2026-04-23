import { useState } from "react";
import NestlingItem from "./NestlingItem";
import { ChevronLeft, Pin } from "lucide-react";
import { useActiveBackgroundId } from "@/stores/useNestStore";
import { cn } from "@/lib/utils/general";
import { Nestling } from "@/lib/types/nestling";

export default function PinnedNestlings({
  pinnedNestlings,
  setIsSidebarOpen,
}: {
  pinnedNestlings: Nestling[];
  setIsSidebarOpen: (isOpen: boolean) => void;
}) {
  const activeBackgroundId = useActiveBackgroundId();

  const [isPinnedOpen, setIsPinnedOpen] = useState(true);

  return (
    <div className={cn("my-1 flex flex-col gap-0.5")}>
      <div
        onClick={() => setIsPinnedOpen((prev) => !prev)}
        onDoubleClick={(e) => {
          e.stopPropagation();
        }}
        className={cn(
          "flex items-center gap-2 rounded px-2 py-1 transition-[background,scale] hover:bg-gray-50 active:scale-[0.98] dark:hover:bg-gray-700/50",
          activeBackgroundId && "hover:bg-black/5 dark:hover:bg-white/5",
        )}
      >
        <div className="rounded-lg bg-linear-to-r from-pink-400 to-pink-500 p-1.5 text-white">
          <Pin className="size-4 flex-shrink-0" />
        </div>

        <span>Pinned</span>

        <div className="ml-auto">
          <ChevronLeft
            className={cn(
              "size-4 flex-shrink-0 transition-transform",
              isPinnedOpen ? "-rotate-90" : "",
            )}
          />
        </div>
      </div>

      {isPinnedOpen && (
        <div className={cn("ml-6 flex flex-col gap-0.5")}>
          {pinnedNestlings.map((nestling) => (
            <NestlingItem
              key={`pinned-${nestling.id}`}
              nestling={nestling}
              setIsSidebarOpen={setIsSidebarOpen}
              isPinnedShortcut={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}
