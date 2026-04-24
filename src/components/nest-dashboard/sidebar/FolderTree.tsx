import { Folder } from "@/lib/types/folder";
import NestlingItem from "../sidebar/NestlingItem";
import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils/general";
import FolderContextMenu from "../../context-menu/FolderContextMenu";
import {
  useActiveFolderId,
  useFolders,
  useNestlingActions,
  useNestlings,
  useNestlingStore,
} from "@/stores/useNestlingStore";
import FolderItem from "./FolderItem";
import { useActiveBackgroundId } from "@/stores/useNestStore";
import { useFolderIndentLines } from "@/stores/useSettingsStore";

export default function FolderTree({
  folder,
  setIsSidebarOpen,
}: {
  folder: Folder;
  setIsSidebarOpen: (isOpen: boolean) => void;
}) {
  const { toggleFolder } = useNestlingActions();
  const nestlings = useNestlings();
  const folders = useFolders();
  const openFolders = useNestlingStore((state) => state.openFolders);

  const activeBackgroundId = useActiveBackgroundId();
  const activeFolderId = useActiveFolderId();

  const folderIndentLines = useFolderIndentLines();

  const isFolderOpen = openFolders[folder.id] || false;

  const { setNodeRef, isOver } = useDroppable({
    id: `folder-${folder.id}`,
  });

  const childFolders = folders.filter((f) => f.parentId === folder.id);
  const childNestlings = nestlings.filter((n) => n.folderId === folder.id);

  return (
    <FolderContextMenu folderId={folder.id}>
      <div
        ref={setNodeRef}
        className={cn(
          "flex flex-col rounded pt-0.5",
          isOver &&
            cn(
              activeBackgroundId
                ? "bg-teal-200/50 dark:bg-teal-300/50"
                : "bg-gray-100/80 dark:bg-gray-700/80",
            ),
        )}
      >
        <FolderItem
          folder={folder}
          isFolderOpen={isFolderOpen}
          toggleFolder={toggleFolder}
        />

        <div className="relative">
          {isFolderOpen && (
            <div
              key={`folder-content-${folder.id}`}
              className={cn(
                "ml-6",
                folderIndentLines &&
                  cn(
                    "before:absolute before:top-0 before:left-4 before:h-full",
                    "before:border-l before:border-gray-200 dark:before:border-gray-700",
                    activeBackgroundId &&
                      "before:border-black/20 dark:before:border-white/20",
                    activeFolderId === folder.id &&
                      "before:border-teal-500 dark:before:border-teal-400",
                  ),
              )}
            >
              {childFolders.map((childFolder) => (
                <FolderTree
                  key={childFolder.id}
                  folder={childFolder}
                  setIsSidebarOpen={setIsSidebarOpen}
                />
              ))}

              <div className="flex flex-col gap-0.5 pt-0.5">
                {childNestlings.map((nestling) => (
                  <NestlingItem
                    key={nestling.id}
                    nestling={nestling}
                    setIsSidebarOpen={setIsSidebarOpen}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </FolderContextMenu>
  );
}
