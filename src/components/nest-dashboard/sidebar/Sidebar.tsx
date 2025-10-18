import { Home } from "lucide-react";
import FolderTree from "./FolderTree";
import NestlingItem from "./NestlingItem";
import { DndContext, rectIntersection } from "@dnd-kit/core";
import LooseNestlings from "./LooseNestlings";
import { useEffect, useMemo } from "react";
import { useNestlingStore } from "@/stores/useNestlingStore";
import { SidebarContextMenu } from "../../context-menu/SidebarContextMenu";
import { AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/general";
import { useNestStore } from "@/stores/useNestStore";
import { clearLastNestling } from "@/lib/storage/session";
import useActiveNestling from "@/hooks/useActiveNestling";
import ToolBar from "./ToolBar";

export default function Sidebar({
  nestId,
  setIsSidebarOpen,
}: {
  nestId: number;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}) {
  const {
    folders,
    nestlings,
    handleDragStart,
    handleDragEnd,
    fetchSidebar,
    setActiveNestlingId,
  } = useNestlingStore();

  const { activeNestlingId } = useActiveNestling();
  const { activeBackgroundId } = useNestStore();

  const folderGroups = useMemo(() => {
    return folders
      .filter((f) => f.parent_id === null)
      .map((folder) => ({
        ...folder,
        nestlings: nestlings.filter((n) => n.folder_id === folder.id),
      }));
  }, [folders, nestlings]);

  const looseNestlings = useMemo(() => {
    return nestlings.filter((n) => n.folder_id === null);
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

        <div
          className={cn(
            "flex cursor-pointer items-center gap-1 rounded px-2 py-1 font-medium transition-colors duration-150 ease-in-out",
            activeBackgroundId
              ? activeNestlingId === null
                ? "bg-white/50 font-bold dark:bg-black/50"
                : "hover:bg-white/20 dark:hover:bg-black/20"
              : activeNestlingId === null
                ? "bg-teal-100 font-bold dark:bg-teal-400"
                : "hover:bg-teal-50 dark:hover:bg-gray-700",
          )}
          onClick={handleHomeClick}
          onDoubleClick={(e) => e.stopPropagation()}
        >
          <Home className="size-4" />
          <span>Home</span>
        </div>

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

            <LooseNestlings>
              {looseNestlings.map((nestling) => (
                <NestlingItem
                  key={nestling.id}
                  nestling={nestling}
                  setIsSidebarOpen={setIsSidebarOpen}
                />
              ))}
            </LooseNestlings>
          </DndContext>
        </AnimatePresence>
      </aside>
    </SidebarContextMenu>
  );
}
