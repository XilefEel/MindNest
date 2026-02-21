import { cn } from "@/lib/utils/general";
import { useDroppable } from "@dnd-kit/core";
import NestlingItem from "./NestlingItem";
import { Nestling } from "@/lib/types/nestling";

export default function LooseNestlings({
  looseNestlings,
  setIsSidebarOpen,
}: {
  looseNestlings: Nestling[];
  setIsSidebarOpen: (isOpen: boolean) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: "loose-null",
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex flex-1 flex-col gap-1 rounded py-1 font-medium",
        isOver && "bg-teal-100 dark:bg-teal-400",
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
