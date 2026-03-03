import {
  Edit3,
  Trash2,
  Copy,
  Pin,
  PinOff,
  Folder,
  FolderInput,
} from "lucide-react";
import ContextMenuItem from "./ContextMenuItem";
import BaseContextMenu from "./BaseContextMenu";
import {
  useFolders,
  useNestlingActions,
  useNestlings,
} from "@/stores/useNestlingStore";
import { toast } from "@/lib/utils/toast";
import { useDeleteModal } from "@/stores/useModalStore";
import ContextMenuSeperator from "./ContextMenuSeparator";
import { cn } from "@/lib/utils/general";
import * as ContextMenu from "@radix-ui/react-context-menu";
import { useActiveBackgroundId } from "@/stores/useNestStore";

export default function NestlingContextMenu({
  nestlingId,
  handleRename,
  children,
}: {
  nestlingId: number;
  handleRename?: () => void;
  children: React.ReactNode;
}) {
  const nestlings = useNestlings();
  const folders = useFolders();

  const otherFolders = folders.filter(
    (f) => f.id !== nestlings.find((n) => n.id === nestlingId)?.folderId,
  );

  const { duplicateNestling, updateNestling } = useNestlingActions();
  const { setDeleteTarget } = useDeleteModal();

  const activeBackgroundId = useActiveBackgroundId();

  const nestling = nestlings.find((n) => n.id === nestlingId);
  if (!nestling) return null;

  const isPinned = nestling.isPinned;

  const handlePinNestling = () => {
    try {
      updateNestling(nestlingId, { isPinned: !isPinned });
    } catch (error) {
      toast.error("Failed to pin nestling.");
    }
  };

  const handleMoveToFolder = (folderId: number) => {
    try {
      updateNestling(nestlingId, { folderId });
    } catch (error) {
      toast.error("Failed to move nestling to folder.");
    }
  };

  return (
    <BaseContextMenu
      content={
        <>
          <ContextMenuItem Icon={Edit3} text="Rename" action={handleRename!} />

          <ContextMenuItem
            Icon={Copy}
            text="Duplicate"
            action={() => duplicateNestling(nestlingId)}
          />

          <ContextMenuItem
            Icon={isPinned ? PinOff : Pin}
            text={isPinned ? "Unpin" : "Pin"}
            action={handlePinNestling}
          />

          <ContextMenu.Sub>
            <ContextMenu.SubTrigger
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className={cn(
                "mx-1 flex items-center gap-3 rounded px-3 py-2 text-sm transition-colors outline-none hover:bg-gray-100 dark:hover:bg-gray-700",
                activeBackgroundId &&
                  "hover:bg-white/30 dark:hover:bg-black/30",
              )}
            >
              <FolderInput className="h-4 w-4" />
              <span>Move to Folder</span>
            </ContextMenu.SubTrigger>

            <ContextMenu.Portal>
              <ContextMenu.SubContent
                className={cn(
                  "animate-in fade-in-0 zoom-in-95 z-50 min-w-[220px] rounded-lg border border-gray-200 bg-white py-2 shadow-lg select-none dark:border-gray-700 dark:bg-gray-800",
                  activeBackgroundId &&
                    "border-0 bg-white/30 backdrop-blur-sm hover:bg-white/30 dark:bg-black/30 dark:hover:bg-black/30",
                )}
              >
                {otherFolders.length === 0 ? (
                  <p className="px-3 py-2 text-center text-sm text-gray-500 dark:text-gray-400">
                    No other folders available.
                  </p>
                ) : (
                  otherFolders.map((folder) => (
                    <ContextMenuItem
                      key={folder.id}
                      action={() => handleMoveToFolder(folder.id)}
                      Icon={Folder}
                      text={folder.name}
                    />
                  ))
                )}
              </ContextMenu.SubContent>
            </ContextMenu.Portal>
          </ContextMenu.Sub>

          <ContextMenuSeperator />

          <ContextMenuItem
            Icon={Trash2}
            text="Delete"
            isDelete
            action={() => {
              // setTimeout is REQUIRED for the modal to close properly
              // when called in context menu item
              setTimeout(() => setDeleteTarget("nestling", nestlingId), 0);
            }}
          />
        </>
      }
    >
      {children}
    </BaseContextMenu>
  );
}
