// hooks/useKeyboardShortcuts.ts
import { useEffect } from "react";
import {
  useNestlingModal,
  useFolderModal,
  useSearchModal,
  useSettingsModal,
} from "@/stores/useModalStore";
import { useThemeToggle } from "@/components/nest-dashboard/settings/theme-toggle";

export function useKeyboardShortcuts({
  nestId,
  isTopbarCollapsed,
  setIsTopbarCollapsed,
  isSidebarCollapsed,
  setIsSidebarCollapsed,
  isSidebarOpen,
  setIsSidebarOpen,
  isCardHidden,
  setIsCardHidden,
}: {
  nestId: number;
  isTopbarCollapsed: boolean;
  setIsTopbarCollapsed: (val: boolean) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (val: boolean) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (val: boolean) => void;
  isCardHidden: boolean;
  setIsCardHidden: (val: boolean) => void;
}) {
  const { isNestlingOpen, openNestlingModal, closeNestlingModal } =
    useNestlingModal();
  const { isFolderOpen, openFolderModal, closeFolderModal } = useFolderModal();
  const { isSettingsOpen, setIsSettingsOpen } = useSettingsModal();
  const { isSearchOpen, setIsSearchOpen } = useSearchModal();
  const cycleTheme = useThemeToggle();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "t":
            e.preventDefault();
            setIsTopbarCollapsed(!isTopbarCollapsed);
            break;

          case "s":
            e.preventDefault();
            const isMobile = window.innerWidth < 768;
            if (isMobile) {
              setIsSidebarOpen(!isSidebarOpen);
            } else {
              setIsSidebarCollapsed(!isSidebarCollapsed);
            }
            break;

          case "h":
            e.preventDefault();
            setIsCardHidden(!isCardHidden);
            break;

          case "n":
            e.preventDefault();
            isNestlingOpen ? closeNestlingModal() : openNestlingModal(nestId);
            break;

          case "f":
            e.preventDefault();
            isFolderOpen ? closeFolderModal() : openFolderModal(nestId);
            break;

          case "k":
            e.preventDefault();
            setIsSearchOpen(!isSearchOpen);
            break;

          case "i":
            e.preventDefault();
            setIsSettingsOpen(!isSettingsOpen);
            break;

          case "d":
            e.preventDefault();
            cycleTheme();
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  });
}
