import {
  useActiveNestling,
  useNestlingActions,
} from "@/stores/useNestlingStore";
import { Nestling } from "@/lib/types/nestling";
import { cn } from "@/lib/utils/general";
import { useActiveBackgroundId } from "@/stores/useNestStore";
import { useDraggable } from "@dnd-kit/react";
import { GripVertical } from "lucide-react";
import NestlingContextMenu from "@/components/context-menu/NestlingContextMenu";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { getNestlingIcon, openNestling } from "@/lib/utils/nestlings";

import { useInlineEdit } from "@/hooks/useInlineEdit";
import EmojiMenu from "@/components/EmojiMenu";

const HEIGHT = 400;
const WIDTH = 300;
const MARGIN = 8;

export default function NestlingItem({
  nestling,
  setIsSidebarOpen,
  isPinnedShortcut = false,
}: {
  nestling: Nestling;
  setIsSidebarOpen: (isOpen: boolean) => void;
  isPinnedShortcut?: boolean;
}) {
  const { updateNestling } = useNestlingActions();
  const activeNestling = useActiveNestling();
  const activeBackgroundId = useActiveBackgroundId();

  const inputRef = useRef<HTMLInputElement>(null);

  const [showPicker, setShowPicker] = useState(false);
  const [pickerPosition, setPickerPosition] = useState({ top: 0, left: 0 });

  const pickerRef = useRef<HTMLDivElement>(null);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);

  const Icon = getNestlingIcon(nestling.nestlingType);

  const { ref, handleRef } = useDraggable(
    isPinnedShortcut
      ? { id: `non-draggable-${nestling.id}`, disabled: true }
      : { id: `nestling-${nestling.id}` },
  );

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
    setIsSidebarOpen(false);
    openNestling(nestling);
  };

  const toggleEmojiPicker = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!showPicker && emojiButtonRef.current) {
      const rect = emojiButtonRef.current.getBoundingClientRect();

      let top = rect.top - HEIGHT / 2 - MARGIN;
      let left = rect.left + WIDTH / 5;

      if (top < MARGIN) {
        top = rect.bottom + MARGIN;
      }

      if (top + HEIGHT > window.innerHeight - MARGIN) {
        top = Math.max(MARGIN, window.innerHeight - HEIGHT - MARGIN);
      }

      setPickerPosition({ top, left });
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

  return (
    <NestlingContextMenu
      nestlingId={nestling.id}
      handleRename={() => setIsEditing(true)}
    >
      <div
        key={nestling.id}
        ref={ref}
        onDoubleClick={(e) => e.stopPropagation()}
        className="transition-[scale] active:scale-[0.98]"
      >
        <div
          onClick={handleSelect}
          className={cn(
            "group flex w-full max-w-full items-center justify-between gap-1 truncate rounded px-2 py-1 transition-[background]",
            activeBackgroundId
              ? nestling.id === activeNestling?.id
                ? "bg-white/30 font-medium dark:bg-black/30"
                : "hover:bg-black/5 dark:hover:bg-white/5"
              : nestling.id === activeNestling?.id
                ? "bg-teal-50 font-medium text-teal-600 dark:bg-teal-500/10 dark:text-teal-400"
                : "hover:bg-zinc-50 dark:hover:bg-zinc-700/50",
          )}
        >
          <div className="flex min-w-0 flex-1 items-center gap-1.5">
            <button
              ref={emojiButtonRef}
              onClick={toggleEmojiPicker}
              className="flex w-5 items-center justify-center transition-opacity duration-100 hover:opacity-70"
            >
              {nestling.icon ? (
                <span>{nestling.icon}</span>
              ) : (
                <Icon className="size-4 shrink-0" />
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
                      : "bg-white px-2 py-0.5 shadow-md ring-2 ring-teal-500 dark:bg-zinc-800",
                  ),
              )}
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
                  "w-full truncate bg-transparent focus:outline-none",
                  !isEditing && "pointer-events-none",
                )}
              />
            </div>
          </div>

          {!isPinnedShortcut && (
            <div
              ref={handleRef}
              onClick={(e) => e.stopPropagation()}
              className="cursor-grab opacity-0 transition-opacity group-hover:opacity-100"
            >
              <GripVertical className="size-4 shrink-0 text-zinc-500 dark:text-zinc-200" />
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
              <EmojiMenu
                nestling={nestling}
                showPicker={showPicker}
                setShowPicker={setShowPicker}
                pickerRef={pickerRef}
                width={WIDTH}
                height={HEIGHT}
              />
            </div>,
            document.body,
          )}
      </div>
    </NestlingContextMenu>
  );
}
