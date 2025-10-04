import { FilePlus, FolderPlus, Home } from "lucide-react";
import FolderTree from "./FolderTree";
import NestlingItem from "./NestlingItem";
import FolderContextMenu from "../context-menu/FolderContextMenu";
import NestlingContextMenu from "../context-menu/NestlingContextMenu";
import { DndContext, rectIntersection } from "@dnd-kit/core";
import LooseNestlings from "./LooseNestlings";
import { useEffect, useMemo } from "react";
import { useNestlingStore } from "@/stores/useNestlingStore";
import AddNestlingModal from "../modals/AddNestlingModal";
import AddFolderModal from "../modals/AddFolderModal";
import ToolBarItem from "../editors/note/ToolBarItem";
import { SidebarContextMenu } from "../context-menu/SidebarContextMenu";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils/general";
import { useNestStore } from "@/stores/useNestStore";
import { clearLastNestling } from "@/lib/storage/session";

export default function Sidebar({
  nestId,
  setIsSidebarOpen,
}: {
  nestId: number;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}) {
  const {
    activeNestling,
    openFolders,
    folders,
    nestlings,
    toggleFolder,
    handleDragStart,
    handleDragEnd,
    fetchSidebar,
    setActiveNestling,
  } = useNestlingStore();

  const { activeBackgroundId } = useNestStore();

  const folderGroups = useMemo(() => {
    return folders.map((folder) => ({
      ...folder,
      nestlings: nestlings.filter((n) => n.folder_id === folder.id),
    }));
  }, [folders, nestlings]);

  const looseNestlings = useMemo(() => {
    return nestlings.filter((n) => n.folder_id === null);
  }, [nestlings]);

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
        <div className="mb-2.5 flex items-center border-b dark:border-white">
          <AddNestlingModal nestId={nestId}>
            <ToolBarItem Icon={FilePlus} label="New Nestling" />
          </AddNestlingModal>
          <AddFolderModal nestId={nestId}>
            <ToolBarItem Icon={FolderPlus} label="New Folder" />
          </AddFolderModal>
        </div>

        <div
          className={cn(
            "flex cursor-pointer items-center gap-1 rounded px-2 py-1 font-medium transition-colors hover:bg-teal-100 dark:hover:bg-gray-700",
            activeNestling === null &&
              "bg-teal-100 font-bold text-teal-900 dark:bg-teal-400 dark:text-white",
          )}
          onClick={() => {
            setActiveNestling(null);
            setIsSidebarOpen(false);
            clearLastNestling(nestId);
          }}
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
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
                transition={{
                  type: "spring",
                  stiffness: 250,
                  damping: 25,
                }}
              >
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
              </motion.div>
            ))}

            <LooseNestlings>
              {looseNestlings.map((nestling) => (
                <motion.div
                  key={nestling.id}
                  layout="position"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
                  transition={{
                    type: "spring",
                    stiffness: 250,
                    damping: 25,
                  }}
                >
                  <NestlingContextMenu
                    nestlingId={nestling.id}
                    key={nestling.id}
                  >
                    <div>
                      <NestlingItem
                        nestling={nestling}
                        setIsSidebarOpen={setIsSidebarOpen}
                      />
                    </div>
                  </NestlingContextMenu>
                </motion.div>
              ))}
            </LooseNestlings>
          </DndContext>
        </AnimatePresence>
      </aside>
    </SidebarContextMenu>
  );
}
