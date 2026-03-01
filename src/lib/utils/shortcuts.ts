import {
  PanelTop,
  PanelLeft,
  Eye,
  FilePlus,
  FolderPlus,
  Search,
  Settings,
  Image,
  Music,
  Play,
  Palette,
} from "lucide-react";

const shortcutConfig = [
  {
    id: "toggleTopbar",
    keys: ["Ctrl", "T"],
    description: "Toggle topbar",
    category: "Navigation",
    Icon: PanelTop,
  },
  {
    id: "toggleSidebar",
    keys: ["Ctrl", "E"],
    description: "Toggle sidebar",
    category: "Navigation",
    Icon: PanelLeft,
  },
  {
    id: "hideCards",
    keys: ["Ctrl", "H"],
    description: "Hide/show cards",
    category: "Navigation",
    Icon: Eye,
  },
  {
    id: "newNestling",
    keys: ["Ctrl", "N"],
    description: "Create new nestling",
    category: "Actions",
    Icon: FilePlus,
  },
  {
    id: "newFolder",
    keys: ["Ctrl", "Shift", "N"],
    description: "Create new folder",
    category: "Actions",
    Icon: FolderPlus,
  },
  {
    id: "openSearch",
    keys: ["Ctrl", "K"],
    description: "Open search",
    category: "Actions",
    Icon: Search,
  },
  {
    id: "openSettings",
    keys: ["Ctrl", ","],
    description: "Open settings",
    category: "Actions",
    Icon: Settings,
  },
  {
    id: "openBackgroundSettings",
    keys: ["Ctrl", "B"],
    description: "Open background settings",
    category: "Actions",
    Icon: Image,
  },
  {
    id: "openMusicSettings",
    keys: ["Ctrl", "M"],
    description: "Open music settings",
    category: "Actions",
    Icon: Music,
  },
  {
    id: "playPause",
    keys: ["Ctrl", "P"],
    description: "Play/pause background music",
    category: "Actions",
    Icon: Play,
  },
  {
    id: "cycleTheme",
    keys: ["Ctrl", "D"],
    description: "Cycle theme",
    category: "Appearance",
    Icon: Palette,
  },
  {
    id: "toggleBackground",
    keys: ["Ctrl", "Shift", "B"],
    description: "Toggle background",
    category: "Appearance",
    Icon: Image,
  },
] as const;

export type ShortcutId = (typeof shortcutConfig)[number]["id"];
export type ShortcutCategory = (typeof shortcutConfig)[number]["category"];
export type Shortcut = (typeof shortcutConfig)[number];

export default shortcutConfig;
