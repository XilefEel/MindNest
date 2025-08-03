import { Folder, Nestling } from "@/lib/types";
import { ChevronDown, Folder as LucideFolder } from "lucide-react";
import NestlingItem from "./NestlingItem";
import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";

export default function FolderTree({
  folder,
  nestlings,
  isOpen,
  onToggle,
  setActiveNestling,
}: {
  folder: Folder;
  nestlings: Nestling[];
  isOpen: boolean;
  onToggle: () => void;
  setActiveNestling: (nestling: Nestling) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `folder-${folder.id}`,
  });
  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex cursor-pointer flex-col gap-1 rounded px-2 py-1 font-medium",
        isOver && "bg-gray-200 dark:bg-gray-700",
      )}
    >
      <div
        onClick={onToggle}
        className="flex cursor-pointer items-center gap-1 rounded px-2 py-1 font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <ChevronDown
          className={`size-4 transition-transform duration-200 ${isOpen ? "rotate-0" : "-rotate-90"}`}
        />
        <LucideFolder className="size-4" />
        <span>{folder.name}</span>
      </div>
      {isOpen && (
        <div className="ml-6">
          {nestlings.map((nestling) => (
            <NestlingItem
              key={nestling.id}
              nestling={nestling}
              setActiveNestling={setActiveNestling}
            />
          ))}
        </div>
      )}
    </div>
  );
}
