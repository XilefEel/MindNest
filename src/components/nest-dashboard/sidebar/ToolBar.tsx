import { cn } from "@/lib/utils/general";
import IconButton from "@/components/ui/icon-button";
import {
  useNestlingModal,
  useFolderModal,
  useSearchModal,
} from "@/stores/useModalStore";
import { useNestlingActions } from "@/stores/useNestlingStore";
import {
  FilePlus,
  FolderPlus,
  Minimize2,
  Maximize2,
  Search,
} from "lucide-react";
import { useActiveBackgroundId } from "@/stores/useNestStore.tsx";

export default function ToolBar({ nestId }: { nestId: number }) {
  const { toggleAllFolders } = useNestlingActions();
  const { openNestlingModal } = useNestlingModal();
  const { openFolderModal } = useFolderModal();
  const { setIsSearchOpen } = useSearchModal();
  const activeBackgroundId = useActiveBackgroundId();

  const buttons = [
    {
      label: "New Note",
      onClick: () => openNestlingModal(nestId),
      Icon: FilePlus,
    },
    {
      label: "New Folder",
      onClick: () => openFolderModal(nestId),
      Icon: FolderPlus,
    },
    {
      label: "Collapse All",
      onClick: () => toggleAllFolders(false),
      Icon: Minimize2,
    },
    {
      label: "Expand All",
      onClick: () => toggleAllFolders(true),
      Icon: Maximize2,
    },
    {
      label: "Search",
      onClick: () => setIsSearchOpen(true),
      Icon: Search,
    },
  ];

  return (
    <div
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      className={cn(
        "mb-2.5 flex items-center border-b border-zinc-400 dark:border-zinc-500",
        activeBackgroundId && "border-black/30 dark:border-white/30",
      )}
    >
      {buttons.map((btn) => (
        <IconButton
          key={btn.label}
          label={btn.label}
          onClick={btn.onClick}
          Icon={btn.Icon}
        />
      ))}
    </div>
  );
}
