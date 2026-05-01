import {
  Edit3,
  Trash2,
  Copy,
  Pin,
  PinOff,
  Folder,
  FolderInput,
  ChevronRight,
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
import ContextSubMenu from "./ContextSubMenu";

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

          <ContextSubMenu
            trigger={
              <>
                <FolderInput className="size-4 flex-shrink-0" />
                <span>Move to Folder</span>
                <ChevronRight className="ml-auto" size={16} />
              </>
            }
            content={
              <>
                {otherFolders.length === 0 ? (
                  <p className="px-2 py-1.5 text-center text-sm text-gray-500 dark:text-zinc-400">
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
              </>
            }
          />

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
