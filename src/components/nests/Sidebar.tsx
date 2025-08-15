import { FilePlus, FolderPlus, Home } from "lucide-react";
import FolderTree from "./FolderTree";
import NestlingItem from "./NestlingItem";
import { FolderContextMenu } from "../context-menu/FolderContextMenu";
import { NestlingContextMenu } from "../context-menu/NestlingContextMenu";
import { DndContext, closestCenter } from "@dnd-kit/core";
import LooseNestlings from "./LooseNestlings";
import { useEffect, useMemo } from "react";
import { useNestlingTreeStore } from "@/stores/useNestlingStore";
import AddNestlingModal from "../modals/AddNestlingModal";
import AddFolderModal from "../modals/AddFolderModal";
import { ToolBarItem } from "../editors/ToolBarItem";
import { SidebarContextMenu } from "../context-menu/SidebarContextMenu";

export default function Sidebar({
  nestId,
  setIsSidebarOpen,
}: {
  nestId: number;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
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
  const setActiveNestling = useNestlingTreeStore((s) => s.setActiveNestling);

  useEffect(() => {
    if (nestId) {
      setNestId(Number(nestId));
      refreshData();
    }
  }, [nestId]);

  return (
    <SidebarContextMenu nestId={nestId}>
      <aside className="flex h-full w-72 flex-col overflow-x-hidden overflow-y-auto rounded-tr-2xl rounded-br-2xl border border-gray-200 bg-white p-5 shadow-lg md:rounded-xl dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center">
          <AddNestlingModal nestId={nestId}>
            <ToolBarItem Icon={FilePlus} label="New Nestling" />
          </AddNestlingModal>
          <AddFolderModal nestId={nestId}>
            <ToolBarItem Icon={FolderPlus} label="New Folder" />
          </AddFolderModal>
        </div>
        <div
          className="flex cursor-pointer items-center gap-1 rounded px-2 py-1 font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={() => {
            setActiveNestling(null);
            setIsSidebarOpen(false);
          }}
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
            <FolderContextMenu folderId={folder.id} key={folder.id}>
              <div>
                <FolderTree
                  folder={folder}
                  nestlings={folder.nestlings}
                  isOpen={openFolders[folder.id] || false}
                  setIsSidebarOpen={setIsSidebarOpen}
                  onToggle={() => toggleFolder(folder.id)}
                />
              </div>
            </FolderContextMenu>
          ))}

          <LooseNestlings>
            <div>
              {looseNestlings.map((nestling) => (
                <NestlingContextMenu nestlingId={nestling.id} key={nestling.id}>
                  <div>
                    <NestlingItem
                      nestling={nestling}
                      setIsSidebarOpen={setIsSidebarOpen}
                    />
                  </div>
                </NestlingContextMenu>
              ))}
            </div>
          </LooseNestlings>
        </DndContext>
      </aside>
    </SidebarContextMenu>
  );
}
