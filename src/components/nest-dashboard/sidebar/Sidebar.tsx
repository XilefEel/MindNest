import FolderTree from "./FolderTree";
import { DndContext, rectIntersection } from "@dnd-kit/core";
import LooseNestlings from "./LooseNestlings";
import { useEffect, useMemo } from "react";
import {
  useActiveNestlingId,
  useFolders,
  useNestlingActions,
  useNestlings,
} from "@/stores/useNestlingStore";
import { SidebarContextMenu } from "../../context-menu/SidebarContextMenu";
import { AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/general";
import { useActiveBackgroundId } from "@/stores/useNestStore";
import { clearLastNestling } from "@/lib/storage/session";
import ToolBar from "./ToolBar";
import PinnedNestlings from "./PinnedNestlings";
import HomeItem from "./HomeItem";

export default function Sidebar({
  nestId,
  setIsSidebarOpen,
}: {
  nestId: number;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}) {
  const nestlings = useNestlings();
  const folders = useFolders();
  const { handleDragStart, handleDragEnd, fetchSidebar, setActiveNestlingId } =
    useNestlingActions();

  const activeNestlingId = useActiveNestlingId();
  const activeBackgroundId = useActiveBackgroundId();

  const folderGroups = useMemo(() => {
    return folders
      .filter((f) => f.parentId === null)
      .map((folder) => ({
        ...folder,
        nestlings: nestlings.filter((n) => n.folderId === folder.id),
      }));
  }, [folders, nestlings]);

  const looseNestlings = useMemo(() => {
    return nestlings.filter((n) => n.folderId === null);
  }, [nestlings]);

  const pinnedNestlings = useMemo(() => {
    return nestlings.filter((n) => n.isPinned);
  }, [nestlings]);

  const handleHomeClick = () => {
    setActiveNestlingId(null);
    setIsSidebarOpen(false);
    clearLastNestling(nestId);
  };

  useEffect(() => {
    if (nestId) {
      fetchSidebar(nestId);
    }
  }, [nestId]);

  return (
    <SidebarContextMenu nestId={nestId}>
      <aside
        className={cn(
          "flex h-full flex-col overflow-x-hidden overflow-y-auto rounded-tr-2xl rounded-br-2xl p-5",
          activeBackgroundId
            ? "bg-white/30 backdrop-blur-sm dark:bg-black/30"
            : "border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800",
        )}
      >
        <ToolBar nestId={nestId} />

        <HomeItem
          activeBackgroundId={activeBackgroundId}
          activeNestlingId={activeNestlingId}
          handleHomeClick={handleHomeClick}
        />

        <PinnedNestlings
          pinnedNestlings={pinnedNestlings}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        <AnimatePresence mode="popLayout">
          <DndContext
            collisionDetection={rectIntersection}
            onDragStart={handleDragStart}
            onDragEnd={(e) => handleDragEnd(e, nestId)}
          >
            {folderGroups.map((folder) => (
              <FolderTree
                key={folder.id}
                folder={folder}
                setIsSidebarOpen={setIsSidebarOpen}
              />
            ))}

            <LooseNestlings
              looseNestlings={looseNestlings}
              setIsSidebarOpen={setIsSidebarOpen}
            />
          </DndContext>
        </AnimatePresence>
      </aside>
    </SidebarContextMenu>
  );
}
