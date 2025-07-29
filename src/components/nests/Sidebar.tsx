import {
  getNestlings,
  getFolders,
  updateNestlingFolder,
} from "@/lib/nestlings";
import { Folder, FolderWithNestlings, Nestling } from "@/lib/types";
import { Home } from "lucide-react";
import { useEffect, useState } from "react";
import FolderTree from "./FolderTree";
import NestlingItem from "./NestlingItem";

import {
  DndContext,
  closestCenter,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";

const groupNestlingsByFolder = (
  folders: Folder[],
  nestlings: Nestling[],
): { folderGroups: FolderWithNestlings[]; looseNestlings: Nestling[] } => {
  const folderGroups = folders.map((folder) => ({
    ...folder,
    nestlings: nestlings.filter((nestling) => nestling.folder_id === folder.id),
  }));

  const looseNestlings = nestlings.filter(
    (nestling) => nestling.folder_id === null,
  );

  return { folderGroups, looseNestlings };
};

export default function Sidebar({ nestId }: { nestId: number }) {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [nestlings, setNestlings] = useState<Nestling[]>([]);
  const [openFolders, setOpenFolders] = useState<Record<number, boolean>>({});
  const [activeId, setActiveId] = useState<number | null>(null);

  const { folderGroups, looseNestlings } = groupNestlingsByFolder(
    folders,
    nestlings,
  );

  useEffect(() => {
    if (!nestId) return;

    const loadData = async () => {
      try {
        const fetchedFolders = (await getFolders(nestId)) as Folder[];
        const fetchedNestlings = (await getNestlings(nestId)) as Nestling[];

        setFolders(fetchedFolders);
        setNestlings(fetchedNestlings);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    loadData();
  }, [nestId]);

  const toggleFolder = (folderId: number) => {
    setOpenFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  };

  function handleDragStart(event: DragStartEvent) {
    console.log("➡️ Drag started:", event.active.id);
    setActiveId(event.active.id as number);
  }

  const refreshData = async () => {
    const fetchedFolders = await getFolders(nestId);
    const fetchedNestlings = await getNestlings(nestId);
    setFolders(fetchedFolders as any);
    setNestlings(fetchedNestlings as any);
  };

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    setActiveId(null);

    if (!over || active.id === over.id) return;

    // Parse IDs
    const [activeType, activeIdStr] = String(active.id).split("-");
    const [overType, overIdStr] = String(over.id).split("-");

    if (activeType !== "nestling" || overType !== "folder") return;

    const nestlingId = Number(activeIdStr);
    const folderId = Number(overIdStr);

    try {
      await updateNestlingFolder(nestlingId, folderId);
      await refreshData(); // Fetch folders/nestlings again
      console.log(`Moved nestling ${nestlingId} to folder ${folderId}`);
    } catch (err) {
      console.error("Failed to update folder:", err);
    }
  }

  return (
    <aside className="flex h-full flex-col overflow-y-auto rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex cursor-pointer items-center rounded px-2 py-1 font-medium">
        <Home className="size-4" />
        <span>Home</span>
      </div>

      <DndContext
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {folderGroups.map((folder) => (
          <FolderTree
            key={folder.id}
            folder={folder}
            nestlings={folder.nestlings}
            isOpen={openFolders[folder.id] || false}
            onToggle={() => toggleFolder(folder.id)}
          />
        ))}

        {looseNestlings.length > 0 && (
          <div className="mt-4">
            {looseNestlings.map((nestling) => (
              <NestlingItem key={nestling.id} nestling={nestling} />
            ))}
          </div>
        )}
      </DndContext>
    </aside>
  );
}
