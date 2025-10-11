import { Home } from "lucide-react";
import FolderTree from "./FolderTree";
import NestlingItem from "./NestlingItem";
import { DndContext, rectIntersection } from "@dnd-kit/core";
import LooseNestlings from "./LooseNestlings";
import { useEffect, useMemo } from "react";
import { useNestlingStore } from "@/stores/useNestlingStore";
import { SidebarContextMenu } from "../../context-menu/SidebarContextMenu";
import { AnimatePresence, motion } from "framer-motion";
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

  const { activeNestling } = useActiveNestling();
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
            "flex cursor-pointer items-center gap-1 rounded px-2 py-1 font-medium transition-colors hover:bg-teal-100 dark:hover:bg-gray-700",
            activeNestling === null &&
              "bg-teal-100 font-bold text-teal-900 dark:bg-teal-400 dark:text-white",
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
              <motion.div
                key={folder.id}
                layout="position"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
              >
                <FolderTree
                  key={folder.id}
                  folder={folder}
                  setIsSidebarOpen={setIsSidebarOpen}
                />
              </motion.div>
            ))}

            <LooseNestlings>
              {looseNestlings.map((nestling) => (
                <motion.div
                  key={nestling.id}
                  layout="position"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
                  whileTap={{ scale: 0.98 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  <NestlingItem
                    key={nestling.id}
                    nestling={nestling}
                    setIsSidebarOpen={setIsSidebarOpen}
                  />
                </motion.div>
              ))}
            </LooseNestlings>
          </DndContext>
        </AnimatePresence>
      </aside>
    </SidebarContextMenu>
  );
}
