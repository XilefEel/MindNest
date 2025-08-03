import { Home } from "lucide-react";
import FolderTree from "./FolderTree";
import NestlingItem from "./NestlingItem";

import { DndContext, closestCenter } from "@dnd-kit/core";

import LooseNestlings from "./LooseNestlings";
import { SidebarContextMenu } from "../context-menu/SidebarContextMenu";
import { useEffect, useMemo } from "react";
import { Nestling } from "@/lib/types";

import { useNestlingTreeStore } from "@/stores/useNestlingStore";

export default function Sidebar({
  nestId,
  setActiveNestling,
}: {
  nestId: number;
  setActiveNestling: (nestling: Nestling | null) => void;
}) {
  const folders = useNestlingTreeStore((s) => s.folders);
  const nestlings = useNestlingTreeStore((s) => s.nestlings);

  const folderGroups = useMemo(() => {
    return folders.map((folder) => ({
      ...folder,
      nestlings: nestlings.filter((n) => n.folder_id === folder.id),
    }));
  }, [folders, nestlings]);

  const looseNestlings = useMemo(() => {
    return nestlings.filter((n) => n.folder_id === null);
  }, [nestlings]);

  const openFolders = useNestlingTreeStore((s) => s.openFolders);
  const toggleFolder = useNestlingTreeStore((s) => s.toggleFolder);
  const handleDragStart = useNestlingTreeStore((s) => s.handleDragStart);
  const handleDragEnd = useNestlingTreeStore((s) => s.handleDragEnd);
  const refreshData = useNestlingTreeStore((s) => s.refreshData);
  const setNestId = useNestlingTreeStore((s) => s.setNestId);

  useEffect(() => {
    if (nestId) {
      setNestId(Number(nestId));
      refreshData();
    }
  }, [nestId]);

  return (
    <SidebarContextMenu>
      <aside className="flex h-full w-72 flex-col overflow-x-hidden overflow-y-auto rounded-xl border border-gray-200 bg-white p-5 shadow-xl dark:border-gray-700 dark:bg-gray-800">
        <div
          className="flex cursor-pointer items-center gap-1 rounded px-2 py-1 font-medium"
          onClick={() => setActiveNestling(null)}
        >
          <Home className="size-4" />
          <span>Home</span>
          {nestId}
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
              setActiveNestling={setActiveNestling}
            />
          ))}

          <LooseNestlings>
            <div>
              {looseNestlings.map((nestling) => (
                <NestlingItem
                  key={nestling.id}
                  nestling={nestling}
                  setActiveNestling={setActiveNestling}
                />
              ))}
            </div>
          </LooseNestlings>
        </DndContext>
      </aside>
    </SidebarContextMenu>
  );
}
