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
import {
  useSettingsActions,
  useSidebarHidden,
  useTopbarHidden,
} from "@/stores/useSettingsStore";
import shortcutConfig, { ShortcutId } from "@/lib/utils/shortcuts";

type BlockedShortcut = {
  key: string;
  needsShift: boolean;
};

const BLOCKED_SHORTCUTS: BlockedShortcut[] = [
  { key: "j", needsShift: false },
  { key: "p", needsShift: true },
  { key: "f", needsShift: false },
  { key: "g", needsShift: false },
  { key: "g", needsShift: true },
] as const;

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
  const { setSetting } = useSettingsActions();
  const topbarHidden = useTopbarHidden();
  const sidebarHidden = useSidebarHidden();

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

  const shortcutHandlers: Record<ShortcutId, () => void> = {
    toggleTopbar: () => setSetting("topbarHidden", !topbarHidden),

    toggleSidebar: () => {
      const isMobile = window.innerWidth < 768;
      isMobile
        ? setIsSidebarOpen(!isSidebarOpen)
        : setSetting("sidebarHidden", !sidebarHidden);
    },

    hideCards: () => setIsCardHidden(!isCardHidden),

    newNestling: () =>
      isNestlingOpen ? closeNestlingModal() : openNestlingModal(nestId),

    newFolder: () =>
      isFolderOpen ? closeFolderModal() : openFolderModal(nestId),

    openSearch: () => setIsSearchOpen(!isSearchOpen),

    openSettings: () => setIsSettingsOpen(!isSettingsOpen),

    openBackgroundSettings: () =>
      setIsSettingsOpen(!isSettingsOpen, "nest", "background"),

    openMusicSettings: () =>
      setIsSettingsOpen(!isSettingsOpen, "nest", "music"),

    playPause: () => setAudioIsPaused(!audioIsPaused),

    cycleTheme: () => cycleTheme(),

    toggleBackground: () =>
      activeBackgroundId
        ? clearActiveBackgroundId()
        : setActiveBackgroundId(storedBackgroundId),
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;

      if (
        BLOCKED_SHORTCUTS.some(
          (b) => b.key === e.key.toLowerCase() && b.needsShift === e.shiftKey,
        )
      )
        e.preventDefault();

      if (
        ["INPUT", "TEXTAREA"].includes(target.tagName) ||
        target.isContentEditable
      )
        return;

      if (!e.ctrlKey && !e.metaKey) return;

      const match = shortcutConfig.find(({ keys }) => {
        const needsShift = keys.length === 3;
        const key = keys[keys.length - 1].toLowerCase();
        return key === e.key.toLowerCase() && needsShift === e.shiftKey;
      });

      if (match) {
        e.preventDefault();
        shortcutHandlers[match.id]();
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
