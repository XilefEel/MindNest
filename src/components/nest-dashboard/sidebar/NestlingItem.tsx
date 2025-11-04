import useActiveNestling from "@/hooks/useActiveNestling";
import { saveLastNestling } from "@/lib/storage/session";
import { Nestling } from "@/lib/types/nestling";
import { cn } from "@/lib/utils/general";
import { useNestlingStore } from "@/stores/useNestlingStore";
import { useNestStore } from "@/stores/useNestStore";
import { useDraggable } from "@dnd-kit/core";
import { GripVertical } from "lucide-react";
import NestlingContextMenu from "@/components/context-menu/NestlingContextMenu";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { getNestlingIcon } from "@/lib/utils/nestlings";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

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
    useNestlingStore();
  const { activeNestling } = useActiveNestling();
  const { activeNestId, activeBackgroundId } = useNestStore();

  const [title, setTitle] = useState(nestling.title);
  const [isEditing, setIsEditing] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const shouldSaveRef = useRef(true);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerPosition, setPickerPosition] = useState({ top: 0, left: 0 });
  const pickerRef = useRef<HTMLDivElement>(null);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);

  const Icon = getNestlingIcon(nestling.nestlingType);

  const handleSelect = () => {
    if (isEditing) return;
    setActiveNestlingId(nestling.id);
    setActiveFolderId(nestling.folderId);
    saveLastNestling(activeNestId!, nestling.id);
    setIsSidebarOpen(false);
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
      setTitle(nestling.title);
      return;
    }
    if (title !== nestling.title) {
      await updateNestling(nestling.id, { title });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      shouldSaveRef.current = true;
      e.currentTarget.blur();
    }
    if (e.key === "Escape") {
      shouldSaveRef.current = false;
      setTitle(nestling.title);
      e.currentTarget.blur();
    }
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    try {
      updateNestling(nestling.id, { icon: emojiData.emoji });
      setShowPicker(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleClearEmoji = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      updateNestling(nestling.id, { icon: null });
      setShowPicker(false);
    } catch (error) {
      console.error(error);
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
    setTitle(nestling.title);
  }, [nestling.title]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
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
    <NestlingContextMenu nestlingId={nestling.id}>
      <motion.div
        key={nestling.id}
        layout="position"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20, transition: { duration: 0.2 } }}
        whileTap={{ scale: 0.98 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
      >
        <div
          className={cn(
            "flex w-full max-w-full cursor-pointer items-center justify-between gap-1 truncate rounded px-2 py-1 font-medium transition-colors duration-150 ease-in-out",
            activeBackgroundId
              ? nestling.id === activeNestling?.id
                ? "bg-white/50 font-bold dark:bg-black/50"
                : "hover:bg-white/20 dark:hover:bg-black/20"
              : nestling.id === activeNestling?.id
                ? "bg-teal-100 font-bold dark:bg-teal-400"
                : "hover:bg-teal-50 dark:hover:bg-gray-700",
          )}
          onClick={() => handleSelect()}
          style={style}
        >
          <div
            className="flex min-w-0 flex-1 items-center gap-1.5"
            onDoubleClick={handleDoubleClick}
          >
            <button
              ref={emojiButtonRef}
              onClick={toggleEmojiPicker}
              className="cursor-pointer transition-opacity hover:opacity-70"
              type="button"
            >
              {nestling.icon ? (
                <p>{nestling.icon}</p>
              ) : (
                <Icon className="size-4 flex-shrink-0" />
              )}
            </button>

            <div
              className={cn(
                "min-w-0 flex-1 rounded transition-all duration-200",
                isEditing
                  ? activeBackgroundId
                    ? "bg-white/10 px-2 py-0.5 shadow-md ring-2 ring-teal-500 backdrop-blur-sm dark:bg-black/10"
                    : "bg-white px-2 py-0.5 shadow-md ring-2 ring-teal-500 dark:bg-gray-800"
                  : "",
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
              <GripVertical className="size-4 text-gray-500 dark:text-gray-200" />
            </div>
          )}
        </div>

        {showPicker &&
          createPortal(
            <div
              ref={pickerRef}
              className="fixed z-50"
              style={{
                top: `${pickerPosition.top}px`,
                left: `${pickerPosition.left}px`,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <EmojiPicker onEmojiClick={handleEmojiClick} lazyLoadEmojis />
              {nestling.icon && (
                <button
                  onClick={handleClearEmoji}
                  className="absolute right-4 bottom-4 z-50 cursor-pointer rounded-lg bg-red-500 px-3 py-1 text-sm font-medium text-white transition-all duration-150 hover:scale-105 hover:bg-red-700"
                >
                  Clear
                </button>
              )}
            </div>,
            document.body,
          )}
      </motion.div>
    </NestlingContextMenu>
  );
}
