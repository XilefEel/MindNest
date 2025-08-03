import { cn } from "@/lib/utils";
import { useDroppable } from "@dnd-kit/core";

export default function LooseNestlings({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: "loose-null", // Unique ID for the "loose" drop zone
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex h-full cursor-pointer flex-col gap-1 rounded px-2 py-1 font-medium",
        isOver && "bg-gray-200 dark:bg-gray-700",
      )}
    >
      {children}
    </div>
  );
}
