import { Nest } from "@/lib/types/nest";
import { Settings, Link, ArrowLeft, CircleUserRound, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils/general";
import { useActiveBackgroundId, useNestActions } from "@/stores/useNestStore";
import { useNestlingActions } from "@/stores/useNestlingStore";
import TopbarButton from "./TopbarButton";
import { useEffect, useRef, useState } from "react";
import { clearLastNestId } from "@/lib/storage/nest";
import { useSettingsModal } from "@/stores/useModalStore";
import { useSettingsStore } from "@/stores/useSettingsStore.tsx";
import { useInlineEdit } from "@/hooks/useInlineEdit";
import BasePopover from "@/components/popovers/BasePopover";
import NestSwitchPopover from "@/components/popovers/NestSwitchPopover";

export default function Topbar({
  nest,
  isSidebarOpen,
  setIsSidebarOpen,
}: {
  nest: Nest;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}) {
  const navigate = useNavigate();
  const activeBackgroundId = useActiveBackgroundId();
  const { setActiveNestlingId } = useNestlingActions();
  const { setActiveBackgroundId, setActiveNestId, updateNest } =
    useNestActions();
  const { setIsSettingsOpen } = useSettingsModal();
  const { topbarHidden } = useSettingsStore();

  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleExit = () => {
    navigate("/dashboard");
    clearLastNestId();
    setActiveBackgroundId(null);
    setActiveNestlingId(null);
    setActiveNestId(null);
  };

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
    initialValue: nest.title,
    onSave: (title) => updateNest(nest.id, title),
  });

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  return (
    <nav
      className={cn(
        "flex w-full items-center gap-3 border-b border-gray-900 p-2 pt-6 transition-[border] sm:pt-8 dark:border-gray-100",
        topbarHidden && "border-0",
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center p-1",
          activeBackgroundId &&
            "rounded-lg bg-white/30 backdrop-blur-sm dark:bg-black/30",
        )}
      >
        <TopbarButton label={"Go Back"} action={handleExit} Icon={ArrowLeft} />

        <TopbarButton
          label={"Toggle Sidebar"}
          action={() => setIsSidebarOpen(!isSidebarOpen)}
          Icon={Menu}
          isHidden
        />
      </div>

      <div
        className={cn(
          "flex items-center gap-3 p-1 px-3",
          activeBackgroundId &&
            "rounded-lg bg-white/30 backdrop-blur-sm dark:bg-black/30",
        )}
      >
        <BasePopover
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          align="start"
          side="bottom"
          width="w-72"
          trigger={
            <button className="hidden rounded-md p-1 text-3xl transition-[opacity] hover:opacity-90 sm:block">
              🪹
            </button>
          }
          content={<NestSwitchPopover onClose={() => setIsOpen(false)} />}
        />

        <div
          className={cn(
            "cursor-text rounded-lg text-gray-900 transition-all dark:text-gray-100",
            isEditing
              ? "px-3 py-0.5 shadow-md ring ring-teal-500"
              : "hover:opacity-70 dark:hover:opacity-90",
          )}
          onDoubleClick={handleDoubleClick}
        >
          <input
            ref={inputRef}
            id="text"
            className={cn(
              "w-full truncate bg-transparent text-2xl font-bold tracking-tight focus:outline-none sm:text-3xl",
              !isEditing && "pointer-events-none",
            )}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            readOnly={!isEditing}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
        </div>
      </div>

      <div
        className={cn(
          "ml-auto flex items-center justify-center p-1 px-3",
          activeBackgroundId &&
            "rounded-lg bg-white/30 backdrop-blur-sm dark:bg-black/30",
        )}
      >
        <div className="flex items-center gap-3">
          <TopbarButton
            label={"Share"}
            action={() => console.log("share nest")}
            Icon={Link}
          />

          <TopbarButton
            label={"Settings"}
            action={() => setIsSettingsOpen(true)}
            Icon={Settings}
          />

          <TopbarButton
            label={"Profile"}
            action={() => console.log("profile")}
            Icon={CircleUserRound}
          />
        </div>
      </div>
    </nav>
  );
}
