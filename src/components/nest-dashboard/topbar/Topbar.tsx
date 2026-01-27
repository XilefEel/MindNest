import { Nest } from "@/lib/types/nest";
import { Button } from "../../ui/button";
import { Settings, Link, ArrowLeft, CircleUserRound, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils/general";
import { useActiveBackgroundId, useNestActions } from "@/stores/useNestStore";
import { useNestlingActions } from "@/stores/useNestlingStore";
import TopbarButton from "./TopbarButton";
import { useEffect, useRef, useState } from "react";
import { clearLastNestId } from "@/lib/storage/nest";
import { useSettingsModal } from "@/stores/useModalStore";

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

  const handleExit = () => {
    navigate("/dashboard");
    clearLastNestId();
    setActiveBackgroundId(null);
    setActiveNestlingId(null);
    setActiveNestId(null);
  };

  const [title, setTitle] = useState(nest.title);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const shouldSaveRef = useRef(true);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleBlur = async () => {
    setIsEditing(false);
    if (!shouldSaveRef.current) {
      shouldSaveRef.current = true;
      return;
    }
    if (title.trim() === "") {
      setTitle(nest.title);
      return;
    }
    if (title !== nest.title) {
      await updateNest(nest.id, title);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      shouldSaveRef.current = true;
      e.currentTarget.blur();
    }
    if (e.key === "Escape") {
      shouldSaveRef.current = false;
      setTitle(nest.title);
      e.currentTarget.blur();
    }
  };

  useEffect(() => {
    setTitle(nest.title);
  }, [nest.title]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);
  return (
    <nav className="flex w-full items-center justify-between border-b p-2 pt-8 sm:p-4 sm:pt-10">
      <div
        className={cn(
          "flex items-center gap-3 p-1",
          activeBackgroundId &&
            "rounded-xl bg-white/30 backdrop-blur-sm dark:bg-black/30",
        )}
      >
        <TopbarButton action={handleExit} Icon={ArrowLeft} />

        <TopbarButton
          action={() => setIsSidebarOpen(!isSidebarOpen)}
          Icon={Menu}
          isHidden
        />
        <div
          className={cn(
            "rounded transition-all duration-200",
            isEditing &&
              "bg-white px-2 py-0.5 shadow-md ring-2 ring-teal-500 dark:bg-gray-800",
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
          />
        </div>
      </div>
      <div
        className={cn(
          "flex items-center p-1 sm:gap-2",
          activeBackgroundId &&
            "rounded-xl bg-white/30 backdrop-blur-sm dark:bg-black/30",
        )}
      >
        <TopbarButton action={() => console.log("share nest")} Icon={Link} />

        <Button
          variant="ghost"
          className={cn(
            "cursor-pointer rounded-lg hover:bg-teal-100 hover:text-teal-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-teal-300",
            activeBackgroundId && "hover:bg-white/20 dark:hover:bg-black/20",
          )}
          onClick={() => setIsSettingsOpen(true)}
          onDoubleClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Settings className="size-4 sm:size-5" />
        </Button>

        <TopbarButton
          action={() => console.log("profile")}
          Icon={CircleUserRound}
        />
      </div>
    </nav>
  );
}
