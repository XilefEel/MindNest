import { useEffect } from "react";
import {
  useNestlingModal,
  useFolderModal,
  useSearchModal,
  useSettingsModal,
} from "@/stores/useModalStore";
import { useThemeToggle } from "@/components/nest-dashboard/settings/theme-toggle";
import {
  useActiveBackgroundId,
  useNestActions,
  useNestStore,
  useStoredBackgroundId,
} from "@/stores/useNestStore";
import { useSettingsStore } from "@/stores/useSettingsStore";

export function useKeyboardShortcuts({
  nestId,
  isSidebarOpen,
  setIsSidebarOpen,
  isCardHidden,
  setIsCardHidden,
}: {
  nestId: number;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (val: boolean) => void;
  isCardHidden: boolean;
  setIsCardHidden: (val: boolean) => void;
}) {
  const { topbarHidden, sidebarHidden, setSetting } = useSettingsStore();
  const activeBackgroundId = useActiveBackgroundId();
  const storedBackgroundId = useStoredBackgroundId();
  const { setActiveBackgroundId, clearActiveBackgroundId, setAudioIsPaused } =
    useNestActions();
  const audioIsPaused = useNestStore((state) => state.audioIsPaused);

  const { isNestlingOpen, openNestlingModal, closeNestlingModal } =
    useNestlingModal();
  const { isFolderOpen, openFolderModal, closeFolderModal } = useFolderModal();
  const { isSettingsOpen, setIsSettingsOpen } = useSettingsModal();
  const { isSearchOpen, setIsSearchOpen } = useSearchModal();

  const cycleTheme = useThemeToggle();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;

      switch (e.key.toLowerCase()) {
        case "t":
          e.preventDefault();
          setSetting("topbarHidden", !topbarHidden);
          break;

        case "e": {
          e.preventDefault();
          const isMobile = window.innerWidth < 768;
          if (isMobile) {
            setIsSidebarOpen(!isSidebarOpen);
          } else {
            setSetting("sidebarHidden", !sidebarHidden);
          }
          break;
        }

        case "h":
          e.preventDefault();
          setIsCardHidden(!isCardHidden);
          break;

        case "n":
          if (e.shiftKey) {
            e.preventDefault();
            isFolderOpen ? closeFolderModal() : openFolderModal(nestId);
          } else {
            e.preventDefault();
            isNestlingOpen ? closeNestlingModal() : openNestlingModal(nestId);
          }
          break;

        case "k":
          e.preventDefault();
          setIsSearchOpen(!isSearchOpen);
          break;

        case ",":
          e.preventDefault();
          setIsSettingsOpen(!isSettingsOpen);
          break;

        case "b":
          e.preventDefault();
          if (e.shiftKey) {
            activeBackgroundId
              ? clearActiveBackgroundId()
              : setActiveBackgroundId(storedBackgroundId);
          } else {
            setIsSettingsOpen(!isSettingsOpen, "nest", "background");
          }
          break;

        case "m":
          e.preventDefault();
          setIsSettingsOpen(!isSettingsOpen, "nest", "music");
          break;

        case "p":
          e.preventDefault();
          setAudioIsPaused(!audioIsPaused);
          break;

        case "d":
          e.preventDefault();
          cycleTheme();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [
    topbarHidden,
    sidebarHidden,
    isSidebarOpen,
    isCardHidden,
    isNestlingOpen,
    isFolderOpen,
    isSearchOpen,
    isSettingsOpen,
    audioIsPaused,
    activeBackgroundId,
    storedBackgroundId,
    cycleTheme,
  ]);
}
