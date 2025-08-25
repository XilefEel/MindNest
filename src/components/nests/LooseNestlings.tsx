import { cn } from "@/lib/utils";
import { useDroppable } from "@dnd-kit/core";

export default function LooseNestlings({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: "loose-null",
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex h-full cursor-pointer flex-col gap-1 rounded px-2 py-1 font-medium",
        isOver && "bg-teal-100 dark:bg-teal-400",
      )}
    >
      {children}
    </div>
  );
}
