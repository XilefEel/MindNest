import { Nestling } from "@/lib/types/nestling";
import { findFolderPath } from "@/lib/utils/folders";
import { cn } from "@/lib/utils/general";
import { getNestlingIcon } from "@/lib/utils/nestlings";
import { toast } from "@/lib/utils/toast";
import {
  useFolders,
  useNestlingActions,
  useNestlingTags,
} from "@/stores/useNestlingStore";
import { useActiveBackgroundId } from "@/stores/useNestStore";
import {
  useCompactNestlingTitle,
  useNestlingTitleHidden,
  useSettingsActions,
} from "@/stores/useSettingsStore";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import { ChevronDown, Dot, Folder, Plus } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import BasePopover from "../popovers/BasePopover";
import TagEditPopover from "../popovers/TagEditPopover";
import TagPopover from "../popovers/TagPopover";
import { NestlingTag } from "./NestlingTag";

const themeMap: Record<string, Theme> = {
  light: Theme.LIGHT,
  dark: Theme.DARK,
  system: Theme.AUTO,
};

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

  const nestlingTitleHidden = useNestlingTitleHidden();
  const compactNestlingTitle = useCompactNestlingTitle();
  const { setSetting } = useSettingsActions();

  const pickerRef = useRef<HTMLDivElement>(null);
  const Icon = getNestlingIcon(nestling.nestlingType);
  const { theme } = useTheme();

  const handleEmojiClick = async (emojiData: EmojiClickData) => {
    try {
      await updateNestling(nestling.id, { icon: emojiData.emoji });
      setShowPicker(false);
    } catch (error) {
      toast.error("Failed to update nestling icon.");
    }
  };

  const handleClearEmoji = async () => {
    try {
      await updateNestling(nestling.id, { icon: null });
      setShowPicker(false);
    } catch (error) {
      toast.error("Failed to clear nestling icon.");
    }
  };

  const handleDetachTag = async (tagId: number) => {
    try {
      await detachTag(nestling.id, tagId);
    } catch (error) {
      toast.error("Failed to detach tag.");
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

  if (nestlingTitleHidden) return null;

  return (
    <div className="flex flex-col">
      <div className="group relative flex flex-row items-center text-gray-900 transition-all dark:text-zinc-100">
        <button
          onClick={() =>
            setSetting("compactNestlingTitle", !compactNestlingTitle)
          }
          className="w-0 text-gray-500 opacity-0 transition-all group-hover:mr-2 group-hover:w-6 group-hover:opacity-100 hover:text-gray-700 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          <ChevronDown
            size={24}
            className={compactNestlingTitle ? "-rotate-90" : ""}
          />
        </button>

        <div className="relative" ref={pickerRef}>
          <button
            onClick={() => setShowPicker(!showPicker)}
            className={cn(
              "flex w-8 items-center justify-center text-2xl font-bold transition-opacity hover:opacity-70",
              compactNestlingTitle && "w-6 text-lg",
            )}
          >
            {nestling.icon ? (
              <p>{nestling.icon}</p>
            ) : (
              <Icon
                size={compactNestlingTitle ? 24 : 32}
                className="flex-shrink-0"
              />
            )}
          </button>

          {showPicker && (
            <div className="absolute top-10 left-0 z-50">
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
            </div>
          )}
        </div>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          placeholder="Title..."
          className={cn(
            "w-full min-w-0 resize-none bg-transparent pl-2 text-2xl font-bold outline-none",
            compactNestlingTitle && "text-lg font-semibold",
          )}
        />
      </div>

      <div
        className={cn(
          "mt-2 flex items-center gap-1.5 text-gray-800 dark:text-zinc-200",
          compactNestlingTitle && "hidden",
        )}
      >
        <Folder className="size-4 flex-shrink-0" />

        <span className="text-sm">
          {findFolderPath(nestling.folderId, folders) || "No folder"}
        </span>

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
                "text-gray-600 hover:text-gray-700 dark:text-zinc-300 dark:hover:text-zinc-200",
                "border-gray-300 hover:border-gray-400 dark:border-zinc-600 dark:hover:border-zinc-500",
                "hover:bg-gray-200/50 dark:hover:bg-zinc-700",
                nestlingTags.length > 0
                  ? "p-0.5"
                  : "flex items-center gap-1 px-2 py-0.5",
                activeBackgroundId &&
                  "border-transparent bg-white/30 backdrop-blur-sm hover:border-transparent hover:bg-black/5 dark:border-transparent dark:bg-black/30 dark:hover:border-transparent dark:hover:bg-white/5",
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
