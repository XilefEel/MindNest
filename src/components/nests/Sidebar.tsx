import { Home } from "lucide-react";
import FolderTree from "./FolderTree";
import NestlingItem from "./NestlingItem";
import SidebarContextMenu from "../context-menu/SidebarContextMenu";

import { DndContext, closestCenter } from "@dnd-kit/core";

import LooseNestlings from "./LooseNestlings";
import { useEffect, useMemo, useState } from "react";

import { useNestlingTreeStore } from "@/stores/useNestlingStore";

export type ContextTarget =
  | { type: "folder"; id: number }
  | { type: "nestling"; id: number }
  | null;

export default function Sidebar({
  nestId,
  setIsSidebarOpen,
}: {
  nestId: number;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}) {
  const [contextTarget, setContextTarget] = useState<ContextTarget>(null);

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
  const setActiveNestling = useNestlingTreeStore((s) => s.setActiveNestling);

  useEffect(() => {
    if (nestId) {
      setNestId(Number(nestId));
      refreshData();
    }
  }, [nestId]);

  return (
    <SidebarContextMenu
      contextTarget={contextTarget}
      setContextTarget={setContextTarget}
    >
      <aside className="flex h-full w-72 flex-col overflow-x-hidden overflow-y-auto rounded-tr-2xl rounded-br-2xl border border-gray-200 bg-white p-5 shadow-xl md:rounded-xl dark:border-gray-700 dark:bg-gray-800">
        <div
          className="flex cursor-pointer items-center gap-1 rounded px-2 py-1 font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={() => setActiveNestling(null)}
        >
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
              setIsSidebarOpen={setIsSidebarOpen}
              onToggle={() => toggleFolder(folder.id)}
              setContextTarget={setContextTarget}
              onContextMenu={(e) => {
                e.preventDefault();
                alert("Folder context menu");
                setContextTarget({ type: "folder", id: folder.id });
              }}
            />
          ))}

          <LooseNestlings>
            <div>
              {looseNestlings.map((nestling) => (
                <NestlingItem
                  key={nestling.id}
                  nestling={nestling}
                  setIsSidebarOpen={setIsSidebarOpen}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    alert("Nestling context menu");
                    setContextTarget({ type: "nestling", id: nestling.id });
                  }}
                />
              ))}
            </div>
          </LooseNestlings>
        </DndContext>
      </aside>
    </SidebarContextMenu>
  );
}
