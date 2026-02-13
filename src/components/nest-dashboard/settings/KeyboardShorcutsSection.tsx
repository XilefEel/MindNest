import { useActiveBackgroundId } from "@/stores/useNestStore";
import { cn } from "@/lib/utils/general";
import {
  Eye,
  FilePlus,
  FolderPlus,
  Image,
  Palette,
  PanelLeft,
  PanelTop,
  Play,
  Search,
  Settings,
} from "lucide-react";

export default function KeyboardShortcutsSection() {
  const activeBackgroundId = useActiveBackgroundId();

  const shortcuts = [
    {
      keys: ["Ctrl", "T"],
      description: "Toggle topbar",
      category: "Navigation",
      Icon: PanelTop,
    },
    {
      keys: ["Ctrl", "S"],
      description: "Toggle sidebar",
      category: "Navigation",
      Icon: PanelLeft,
    },
    {
      keys: ["Ctrl", "H"],
      description: "Hide/show cards",
      category: "Navigation",
      Icon: Eye,
    },
    {
      keys: ["Ctrl", "N"],
      description: "Create new nestling",
      category: "Actions",
      Icon: FilePlus,
    },
    {
      keys: ["Ctrl", "F"],
      description: "Create new folder",
      category: "Actions",
      Icon: FolderPlus,
    },
    {
      keys: ["Ctrl", "K"],
      description: "Open search",
      category: "Actions",
      Icon: Search,
    },
    {
      keys: ["Ctrl", "I"],
      description: "Open settings",
      category: "Actions",
      Icon: Settings,
    },
    {
      keys: ["Ctrl", "M"],
      description: "Play/pause background music",
      category: "Actions",
      Icon: Play,
    },
    {
      keys: ["Ctrl", "D"],
      description: "Cycle theme",
      category: "Appearance",
      Icon: Palette,
    },
    {
      keys: ["Ctrl", "B"],
      description: "Toggle background",
      category: "Appearance",
      Icon: Image,
    },
  ];

  const categories = Array.from(new Set(shortcuts.map((s) => s.category)));

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
          Keyboard Shortcuts
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Shortcuts available in your nest
        </p>
      </div>

      {categories.map((category) => (
        <div key={category} className="space-y-2">
          <h2 className="text-xs font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-400">
            {category}
          </h2>
          <div className="space-y-1">
            {shortcuts
              .filter((shortcut) => shortcut.category === category)
              .map((shortcut, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-center justify-between rounded-lg px-3 py-2",
                    activeBackgroundId
                      ? index % 2 === 0
                        ? "bg-black/5 backdrop-blur-sm dark:bg-white/10"
                        : "bg-white/10 backdrop-blur-sm dark:bg-white/15"
                      : index % 2 === 0
                        ? "bg-gray-100 dark:bg-gray-700/30"
                        : "bg-gray-50 dark:bg-gray-700/80",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 text-gray-500 dark:text-gray-400">
                      <shortcut.Icon size={16} />
                    </div>
                    <span className="text-sm text-gray-800 dark:text-gray-200">
                      {shortcut.description}
                    </span>
                  </div>

                  <div className="flex gap-1">
                    {shortcut.keys.map((key, i) => (
                      <kbd
                        key={i}
                        className={cn(
                          "rounded px-2 py-1 text-xs font-semibold shadow-sm",
                          activeBackgroundId
                            ? "bg-white/30 text-gray-900 dark:bg-black/30 dark:text-gray-100"
                            : "bg-white text-gray-800 dark:bg-gray-700 dark:text-gray-200",
                        )}
                      >
                        {key}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
