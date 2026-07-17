import { Nestling } from "@/lib/types/nestling";
import { useNestlingActions } from "@/stores/useNestlingStore";
import EmojiPicker, {
  Categories,
  EmojiClickData,
  Theme,
} from "emoji-picker-react";
import { X } from "lucide-react";
import { useTheme } from "next-themes";
import { RefObject, useEffect } from "react";
import { toast } from "sonner";

const themeMap: Record<string, Theme> = {
  light: Theme.LIGHT,
  dark: Theme.DARK,
  system: Theme.AUTO,
};

export default function EmojiMenu({
  nestling,
  showPicker,
  setShowPicker,
  pickerRef,
  width,
  height,
}: {
  nestling: Nestling;
  showPicker: boolean;
  setShowPicker: (show: boolean) => void;
  pickerRef: RefObject<HTMLDivElement>;
  width: number;
  height: number;
}) {
  const { updateNestling } = useNestlingActions();
  const { theme } = useTheme();

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      )
        setShowPicker(false);
    };

    if (showPicker) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showPicker]);

  return (
    <>
      <EmojiPicker
        onEmojiClick={handleEmojiClick}
        theme={themeMap[theme ?? "system"]}
        height={height}
        width={width}
        previewConfig={{ showPreview: false }}
        skinTonesDisabled
        lazyLoadEmojis
        categoryIcons={{
          [Categories.SUGGESTED]: <span className="text-lg">🕒</span>,
          [Categories.SMILEYS_PEOPLE]: <span className="text-lg">😀</span>,
          [Categories.ANIMALS_NATURE]: <span className="text-lg">🐻</span>,
          [Categories.FOOD_DRINK]: <span className="text-lg">🍔</span>,
          [Categories.TRAVEL_PLACES]: <span className="text-lg">✈️</span>,
          [Categories.ACTIVITIES]: <span className="text-lg">⚽</span>,
          [Categories.OBJECTS]: <span className="text-lg">💡</span>,
          [Categories.SYMBOLS]: <span className="text-lg">🔣</span>,
          [Categories.FLAGS]: <span className="text-lg">🏳️</span>,
        }}
      />

      {nestling.icon && (
        <button
          onClick={handleClearEmoji}
          className="absolute top-3 right-3 z-50 flex items-center gap-1.5 px-2 py-1 text-xs text-zinc-500 transition-colors hover:text-red-500 dark:text-zinc-400 dark:hover:text-red-400"
        >
          <X className="size-3 shrink-0" />
          Clear
        </button>
      )}
    </>
  );
}
