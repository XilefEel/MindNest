import {
  useActiveNestling,
  useNestlingActions,
} from "@/stores/useNestlingStore";
import { Nestling } from "@/lib/types/nestling";
import { cn } from "@/lib/utils/general";
import { useActiveBackgroundId, useActiveNestId } from "@/stores/useNestStore";
import { useDraggable } from "@dnd-kit/core";
import { GripVertical } from "lucide-react";
import NestlingContextMenu from "@/components/context-menu/NestlingContextMenu";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { getNestlingIcon } from "@/lib/utils/nestlings";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import { saveLastNestling } from "@/lib/storage/nestling";
import { toast } from "@/lib/utils/toast";
import { useTheme } from "next-themes";
import { useInlineEdit } from "@/hooks/useInlineEdit";

const themeMap: Record<string, Theme> = {
  light: Theme.LIGHT,
  dark: Theme.DARK,
  system: Theme.AUTO,
};

export default function NestlingItem({
  nestling,
  setIsSidebarOpen,
  isPinnedShortcut = false,
}: {
  nestling: Nestling;
  setIsSidebarOpen: (isOpen: boolean) => void;
  isPinnedShortcut?: boolean;
}) {
  const { setActiveFolderId, setActiveNestlingId, updateNestling } =
    useNestlingActions();
  const activeNestling = useActiveNestling();
  const activeNestId = useActiveNestId();
  const activeBackgroundId = useActiveBackgroundId();

  const { theme } = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);

  const [showPicker, setShowPicker] = useState(false);
  const [pickerPosition, setPickerPosition] = useState({ top: 0, left: 0 });
  const pickerRef = useRef<HTMLDivElement>(null);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);

  const Icon = getNestlingIcon(nestling.nestlingType);

  const {
    value: title,
    setValue: setTitle,
    isEditing,
    setIsEditing,
    handleBlur,
    handleKeyDown,
  } = useInlineEdit({
    initialValue: nestling.title,
    onSave: (title) => updateNestling(nestling.id, { title }),
  });

  const handleSelect = async () => {
    if (isEditing) return;

    setActiveNestlingId(nestling.id);
    setActiveFolderId(nestling.folderId);
    setIsSidebarOpen(false);

    await saveLastNestling(activeNestId!, nestling.id);
  };

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable(
      isPinnedShortcut
        ? { id: `non-draggable-${nestling.id}`, disabled: true }
        : { id: `nestling-${nestling.id}` },
    );

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleEmojiClick = async (emojiData: EmojiClickData) => {
    try {
      await updateNestling(nestling.id, { icon: emojiData.emoji });
      setShowPicker(false);
    } catch (error) {
      toast.error("Failed to update emoji.");
    }
  };

  const handleClearEmoji = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await updateNestling(nestling.id, { icon: null });
      setShowPicker(false);
    } catch (error) {
      toast.error("Failed to clear emoji.");
    }
  };

  const toggleEmojiPicker = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!showPicker && emojiButtonRef.current) {
      const rect = emojiButtonRef.current.getBoundingClientRect();
      setPickerPosition({
        top: rect.top - 225,
        left: rect.left + 100,
      });
    }
    setShowPicker((prev) => !prev);
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 1);
    }
  }, [isEditing]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node) &&
        emojiButtonRef.current &&
        !emojiButtonRef.current.contains(event.target as Node)
      )
        setShowPicker(false);
    }
    if (showPicker) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showPicker]);

  return (
    <NestlingContextMenu
      nestlingId={nestling.id}
      handleRename={() => setIsEditing(true)}
    >
      <div
        key={nestling.id}
        onDoubleClick={(e) => e.stopPropagation()}
        className="transition-[scale] active:scale-[0.98]"
      >
        <div
          className={cn(
            "flex h-8 w-full max-w-full items-center justify-between gap-1 truncate rounded px-2 py-1 transition-[background]",
            activeBackgroundId
              ? nestling.id === activeNestling?.id
                ? "bg-white/50 font-medium dark:bg-black/50"
                : "hover:bg-white/20 dark:hover:bg-black/20"
              : nestling.id === activeNestling?.id
                ? "bg-teal-50 font-medium text-teal-600 dark:bg-teal-500/10 dark:text-teal-400"
                : "hover:bg-gray-50 dark:hover:bg-gray-700/50",
          )}
          onClick={() => handleSelect()}
          style={style}
        >
          <div className="flex min-w-0 flex-1 items-center gap-1.5">
            <button
              ref={emojiButtonRef}
              onClick={toggleEmojiPicker}
              className="flex w-5 items-center justify-center transition-opacity duration-100 hover:opacity-70"
            >
              {nestling.icon ? (
                <p>{nestling.icon}</p>
              ) : (
                <Icon className="size-4 flex-shrink-0" />
              )}
            </button>

            <div
              className={cn(
                "min-w-0 flex-1 rounded transition-all",
                isEditing &&
                  cn(
                    "px-2 py-0.5 shadow-md ring-2 ring-teal-500",
                    activeBackgroundId
                      ? "bg-white/10 backdrop-blur-sm dark:bg-black/10"
                      : "bg-white px-2 py-0.5 shadow-md ring-2 ring-teal-500 dark:bg-gray-800",
                  ),
              )}
            >
              <input
                ref={inputRef}
                id="text"
                className={cn(
                  "w-full truncate bg-transparent focus:outline-none",
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

          {!isPinnedShortcut && (
            <div
              ref={setNodeRef}
              {...listeners}
              {...attributes}
              onClick={(e) => e.stopPropagation()}
              className="cursor-grab p-1"
            >
              <GripVertical className="size-4 text-gray-500 dark:text-gray-300" />
            </div>
          )}
        </div>

        {showPicker &&
          createPortal(
            <div
              ref={pickerRef}
              className="fixed z-50 cursor-default select-none"
              style={{
                top: `${pickerPosition.top}px`,
                left: `${pickerPosition.left}px`,
              }}
              onClick={(e) => e.stopPropagation()}
              onContextMenu={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
            >
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                theme={themeMap[theme ?? "system"]}
                height={400}
                previewConfig={{ showPreview: false }}
                skinTonesDisabled
                lazyLoadEmojis
              />
              {nestling.icon && (
                <button
                  onClick={handleClearEmoji}
                  className="absolute top-4 right-4 z-50 rounded-lg bg-red-500 px-3 py-1 text-sm text-white shadow-sm transition hover:bg-red-600"
                >
                  Clear
                </button>
              )}
            </div>,
            document.body,
          )}
      </div>
    </NestlingContextMenu>
  );
}
