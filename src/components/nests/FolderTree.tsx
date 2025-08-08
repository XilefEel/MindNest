import { Folder, Nestling } from "@/lib/types";
import { ChevronDown, Folder as LucideFolder } from "lucide-react";
import NestlingItem from "./NestlingItem";
import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { ContextTarget } from "./Sidebar";

export default function FolderTree({
  folder,
  nestlings,
  isOpen,
  setIsSidebarOpen,
  onToggle,
  onContextMenu,
  setContextTarget,
}: {
  folder: Folder;
  nestlings: Nestling[];
  isOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  onToggle: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
  setContextTarget: React.Dispatch<React.SetStateAction<ContextTarget>>;
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
      onContextMenu={onContextMenu}
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
              setIsSidebarOpen={setIsSidebarOpen}
              onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
                alert("Nestling context menu");
                setContextTarget({ type: "nestling", id: nestling.id });
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
