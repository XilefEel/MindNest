import { cn } from "@/lib/utils/general";
import { useDroppable } from "@dnd-kit/core";
import NestlingItem from "./NestlingItem";
import { Nestling } from "@/lib/types/nestling";
import { useActiveBackgroundId } from "@/stores/useNestStore";
import { useLargeSidebarText } from "@/stores/useSettingsStore";

export default function LooseNestlings({
  looseNestlings,
  setIsSidebarOpen,
}: {
  looseNestlings: Nestling[];
  setIsSidebarOpen: (isOpen: boolean) => void;
}) {
  const activeBackgroundId = useActiveBackgroundId();
  const largeSidebarText = useLargeSidebarText();

  const { setNodeRef, isOver } = useDroppable({
    id: "loose-null",
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex flex-1 flex-col gap-0.5 rounded pt-0.5",
        largeSidebarText && "gap-1 pt-1",
        isOver &&
          cn(
            activeBackgroundId
              ? "bg-teal-200/50 dark:bg-teal-300/50"
              : "bg-gray-100/80 dark:bg-gray-700/80",
          ),
      )}
    >
      {looseNestlings.map((nestling) => (
        <NestlingItem
          key={nestling.id}
          nestling={nestling}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      ))}
    </div>
  );
}
