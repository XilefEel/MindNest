import FolderTree from "./FolderTree";
import { DndContext, rectIntersection } from "@dnd-kit/core";
import LooseNestlings from "./LooseNestlings";
import { useEffect, useMemo } from "react";
import {
  useFolders,
  useNestlingActions,
  useNestlings,
} from "@/stores/useNestlingStore";
import { SidebarContextMenu } from "../../context-menu/SidebarContextMenu";
import { cn } from "@/lib/utils/general";
import { useActiveBackgroundId } from "@/stores/useNestStore";
import ToolBar from "./ToolBar";
import PinnedNestlings from "./PinnedNestlings";
import HomeItem from "./HomeItem";
import { AnimatePresence } from "framer-motion";
import { useSettingsStore } from "@/stores/useSettingsStore";

export default function Sidebar({
  nestId,
  setIsSidebarOpen,
}: {
  nestId: number;
  setIsSidebarOpen: (isOpen: boolean) => void;
}) {
  const nestlings = useNestlings();
  const folders = useFolders();
  const { handleDragStart, handleDragEnd, fetchSidebar } = useNestlingActions();

  const activeBackgroundId = useActiveBackgroundId();
  const { largeSidebarText, sidebarPosition } = useSettingsStore();

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

  useEffect(() => {
    if (nestId) {
      fetchSidebar(nestId);
    }
  }, [nestId]);

  return (
    <SidebarContextMenu nestId={nestId}>
      <aside
        style={{ scrollbarGutter: "stable" }}
        className={cn(
          "[&::-webkit-scrollbar]:hidden",
          "flex h-full flex-col overflow-x-hidden overflow-y-auto px-4 py-3",
          "bg-white dark:bg-gray-800 md:dark:bg-gray-800/50",
          "border border-gray-200 dark:border-gray-700",
          "text-sm font-medium text-gray-900 dark:text-gray-100",

          largeSidebarText && "text-base",
          sidebarPosition === "right"
            ? "rounded-tl-2xl rounded-bl-2xl"
            : "rounded-tr-2xl rounded-br-2xl",
          activeBackgroundId &&
            "border-transparent bg-white/30 dark:border-transparent dark:bg-black/30 md:dark:bg-black/30",
        )}
      >
        <ToolBar nestId={nestId} />

        <HomeItem nestId={nestId} setIsSidebarOpen={setIsSidebarOpen} />

        <AnimatePresence initial={false}>
          <PinnedNestlings
            pinnedNestlings={pinnedNestlings}
            setIsSidebarOpen={setIsSidebarOpen}
          />
        </AnimatePresence>

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
      </aside>
    </SidebarContextMenu>
  );
}
