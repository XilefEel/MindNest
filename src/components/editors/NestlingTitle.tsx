import { Nestling } from "@/lib/types/nestling";
import { findFolderPath } from "@/lib/utils/folders";
import { getNestlingIcon } from "@/lib/utils/nestlings";
import {
  useFolders,
  useNestlingActions,
  useNestlingTags,
} from "@/stores/useNestlingStore";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { ChevronDown, Dot, Folder, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { NestlingTag } from "./NestlingTag";
import { cn } from "@/lib/utils/general";
import TagPopover from "../popovers/TagPopover";
import TagEditPopover from "../popovers/TagEditPopover";
import { toast } from "sonner";
import {
  useActiveBackgroundId,
  useIsTitleCollapsed,
  useNestStore,
} from "@/stores/useNestStore";
import BasePopover from "../popovers/BasePopover";

export default function NestlingTitle({
  title,
  setTitle,
  nestling,
}: {
  title: string;
  setTitle: (title: string) => void;
  nestling: Nestling;
}) {
  const activeBackgroundId = useActiveBackgroundId();
  const folders = useFolders();
  const nestlingTags = useNestlingTags(nestling.id);
  const { updateNestling, detachTag } = useNestlingActions();

  const [isOpen, setIsOpen] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const isTitleCollapsed = useIsTitleCollapsed();
  const { setIsTitleCollapsed } = useNestStore();

  const pickerRef = useRef<HTMLDivElement>(null);
  const Icon = getNestlingIcon(nestling.nestlingType);

  const handleEmojiClick = async (emojiData: EmojiClickData) => {
    try {
      await updateNestling(nestling.id, { icon: emojiData.emoji });
      setShowPicker(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleClearEmoji = async () => {
    try {
      await updateNestling(nestling.id, { icon: null });
      setShowPicker(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDetachTag = async (tagId: number) => {
    try {
      await detachTag(nestling.id, tagId);
    } catch (error) {
      toast.error("Failed to detach tag");
      console.error("Failed to detach tag:", error);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      )
        setShowPicker(false);
    }

    if (showPicker) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showPicker]);

  return (
    <div className="flex flex-col">
      <div className="group relative flex flex-row items-center text-gray-900 transition-all dark:text-gray-100">
        <button
          onClick={() => setIsTitleCollapsed(!isTitleCollapsed)}
          className="w-0 text-gray-500 opacity-0 transition-all group-hover:mr-2 group-hover:w-6 group-hover:opacity-100 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <ChevronDown
            size={24}
            className={isTitleCollapsed ? "-rotate-90" : ""}
          />
        </button>

        <div className="relative" ref={pickerRef}>
          <button
            onClick={() => setShowPicker(!showPicker)}
            className={cn(
              "flex w-8 items-center justify-center text-3xl font-bold transition-opacity hover:opacity-70",
              isTitleCollapsed && "w-6 text-xl",
            )}
          >
            {nestling.icon ? (
              <p>{nestling.icon}</p>
            ) : (
              <Icon size={isTitleCollapsed ? 24 : 32} />
            )}
          </button>

          {showPicker && (
            <div className="absolute top-12 left-0 z-50">
              <EmojiPicker onEmojiClick={handleEmojiClick} lazyLoadEmojis />
              <div
                onClick={handleClearEmoji}
                className="absolute right-4 bottom-4 z-50 rounded-lg bg-red-500 px-3 py-1 text-white transition-all duration-150 hover:scale-105 hover:bg-red-700"
              >
                Clear
              </div>
            </div>
          )}
        </div>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={cn(
            "w-full min-w-0 resize-none bg-transparent pl-2 text-3xl font-bold outline-none",
            isTitleCollapsed && "text-xl font-semibold",
          )}
          placeholder="Title..."
        />
      </div>

      <div
        className={cn(
          "mt-2 flex items-center gap-2 text-gray-800 dark:text-gray-200",
          isTitleCollapsed && "hidden",
        )}
      >
        <Folder size={20} />
        <span>{findFolderPath(nestling.folderId, folders) || "No folder"}</span>

        {nestlingTags.length > 0 && <Dot size={20} />}

        {nestlingTags.map((tag) => (
          <BasePopover
            key={tag.id}
            width="w-60"
            trigger={
              <button>
                <NestlingTag
                  tag={tag}
                  onRemove={() => handleDetachTag(tag.id)}
                />
              </button>
            }
            content={<TagEditPopover tag={tag} />}
          />
        ))}

        <BasePopover
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          trigger={
            <button
              className={cn(
                "rounded-full border text-xs transition-colors",
                "text-gray-600 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-200",
                "border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500",
                "hover:bg-gray-200/50 dark:hover:bg-gray-700",
                nestlingTags.length > 0
                  ? "p-1"
                  : "flex items-center gap-1 px-2 py-0.5",
                activeBackgroundId &&
                  "border-0 bg-white/30 backdrop-blur-sm hover:bg-white/50 dark:bg-black/30 dark:hover:bg-black/50",
              )}
            >
              <Plus size={12} />
              {nestlingTags.length === 0 && <span>Add tag</span>}
            </button>
          }
          content={<TagPopover nestlingId={nestling.id} />}
        />
      </div>
    </div>
  );
}
