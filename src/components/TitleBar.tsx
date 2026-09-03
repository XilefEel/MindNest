import { cn } from "@/lib/utils/general";
import {
  useActiveBackgroundId,
  useActiveNestId,
  useNestActions,
  useNests,
} from "@/stores/useNestStore";
import { getCurrentWindow } from "@tauri-apps/api/window";
import {
  ArrowLeft,
  Menu,
  Minus,
  PanelLeftOpen,
  PanelRightOpen,
  Settings,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import IconButton from "./ui/icon-button";
import { useSettingsModal } from "@/stores/useModalStore";
import {
  useMinimalTitlebar,
  useSettingsActions,
  useSidebarHidden,
} from "@/stores/useSettingsStore";
import BasePopover from "./popovers/BasePopover";
import NestSwitchPopover from "./popovers/NestSwitchPopover";
import { useInlineEdit } from "@/hooks/useInlineEdit";
import { clearLastNestId } from "@/lib/storage/nest";
import { useNestlingActions } from "@/stores/useNestlingStore";
import { useNavigate } from "react-router-dom";

export default function Titlebar() {
  const appWindow = getCurrentWindow();

  const nestId = useActiveNestId();
  const nest = useNests().find((n) => n.id === nestId);
  const navigate = useNavigate();

  const activeBackgroundId = useActiveBackgroundId();
  const minimalTitlebar = useMinimalTitlebar();
  const sidebarHidden = useSidebarHidden();
  const { setActiveNestlingId } = useNestlingActions();
  const { setActiveBackgroundId, setActiveNestId, updateNest } =
    useNestActions();
  const { setIsSettingsOpen } = useSettingsModal();
  const { setSetting } = useSettingsActions();

  const handleExit = () => {
    navigate("/dashboard");
    clearLastNestId();
    setActiveBackgroundId(null);
    setActiveNestlingId(null);
    setActiveNestId(null);
  };

  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const {
    value: title,
    setValue: setTitle,
    isEditing,
    setIsEditing,
    handleBlur,
    handleKeyDown,
  } = useInlineEdit({
    initialValue: nest?.title ?? "",
    onSave: (title) => {
      if (nestId) updateNest(nestId, title);
    },
  });

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    const updateMaximized = async () => {
      setIsMaximized(await appWindow.isMaximized());
    };

    updateMaximized();

    const unlisten = appWindow.onResized(() => {
      updateMaximized();
    });

    return () => {
      unlisten.then((fn) => fn());
    };
  }, [appWindow]);

  return (
    <div
      data-tauri-drag-region
      className="fixed z-50 flex h-8 w-full items-center justify-between dark:text-white"
    >
      {nestId && !minimalTitlebar ? (
        <div
          className={cn(
            "flex h-full items-center justify-center rounded-br-md",
            activeBackgroundId &&
              "bg-white/50 backdrop-blur-sm dark:bg-black/50",
          )}
        >
          <IconButton label="Go Back" Icon={ArrowLeft} onClick={handleExit} />

          <IconButton
            label="Toggle Sidebar"
            Icon={sidebarHidden ? PanelLeftOpen : PanelRightOpen}
            onClick={() => setSetting("sidebarHidden", !sidebarHidden)}
          />

          <BasePopover
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            align="start"
            side="bottom"
            width="w-72"
            trigger={
              <div>
                <IconButton
                  label="Switch Nest"
                  Icon={Menu}
                  onClick={() => setIsOpen(!isOpen)}
                />
              </div>
            }
            content={<NestSwitchPopover onClose={() => setIsOpen(false)} />}
          />

          <div
            className={cn(
              "ml-1 cursor-text rounded-lg text-zinc-900 transition-all dark:text-zinc-100",
              isEditing
                ? "px-3 shadow-md ring ring-teal-500"
                : "hover:opacity-80",
            )}
            onDoubleClick={handleDoubleClick}
          >
            <input
              ref={inputRef}
              id="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              readOnly={!isEditing}
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              className={cn(
                "truncate bg-transparent text-xs font-semibold tracking-tight focus:outline-none",
                !isEditing && "pointer-events-none",
              )}
            />
          </div>
        </div>
      ) : (
        <div />
      )}

      <div
        className={cn(
          "ml-auto flex h-full items-center justify-center rounded-bl-md",
          activeBackgroundId && "bg-white/50 backdrop-blur-sm dark:bg-black/50",
        )}
      >
        {nestId && !minimalTitlebar && (
          <IconButton
            label="Settings"
            Icon={Settings}
            onClick={() => setIsSettingsOpen(true)}
          />
        )}

        <div
          onClick={() => appWindow.minimize()}
          className={cn(
            "flex h-full items-center justify-center px-3 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800",
            activeBackgroundId && "hover:bg-black/5 dark:hover:bg-white/5",
          )}
        >
          <Minus className="size-4 shrink-0" />
        </div>

        <div
          onClick={async () => {
            await appWindow.toggleMaximize();
            setIsMaximized(await appWindow.isMaximized());
          }}
          className={cn(
            "flex h-full items-center justify-center px-3 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800",
            activeBackgroundId && "hover:bg-black/5 dark:hover:bg-white/5",
          )}
        >
          {isMaximized ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4 shrink-0"
            >
              <rect width="12" height="12" x="4" y="8" rx="2" />
              <path d="M9 4h8a3 3 0 0 1 3 3v8" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4 shrink-0"
            >
              <rect width="14" height="14" x="5" y="5" rx="2" />
            </svg>
          )}
        </div>

        <div
          onClick={() => appWindow.close()}
          className="group flex h-full items-center justify-center px-3 transition-colors hover:bg-red-500"
        >
          <X className="size-4 shrink-0 group-hover:text-white" />
        </div>
      </div>
    </div>
  );
}
