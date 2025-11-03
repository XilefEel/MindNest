import { Nestling } from "@/lib/types/nestling";
import { getNestlingIcon } from "@/lib/utils/nestlings";
import { useNestlingStore } from "@/stores/useNestlingStore";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";

export default function NestlingTitle({
  title,
  setTitle,
  nestling,
}: {
  title: string;
  setTitle: (title: string) => void;
  nestling: Nestling;
}) {
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const { updateNestling } = useNestlingStore();
  const Icon = getNestlingIcon(nestling.nestlingType);

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    try {
      updateNestling(nestling.id, { icon: emojiData.emoji });
      setShowPicker(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleClearEmoji = () => {
    try {
      updateNestling(nestling.id, { icon: null });
      setShowPicker(false);
    } catch (error) {
      console.error(error);
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
    <div className="flex flex-row items-center gap-2">
      <div className="relative" ref={pickerRef}>
        <button
          onClick={() => setShowPicker(!showPicker)}
          className="flex cursor-pointer items-center text-3xl font-bold transition-opacity hover:opacity-70"
          type="button"
        >
          {nestling.icon ? <p>{nestling.icon}</p> : <Icon className="size-8" />}
        </button>

        {showPicker && (
          <div className="absolute top-12 left-0 z-50">
            <EmojiPicker onEmojiClick={handleEmojiClick} lazyLoadEmojis />
            <div
              onClick={handleClearEmoji}
              className="absolute right-4 bottom-4 z-50 cursor-pointer rounded-lg bg-red-500 px-3 py-1 text-white transition-all duration-150 hover:scale-105 hover:bg-red-700"
            >
              Clear
            </div>
          </div>
        )}
      </div>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full min-w-0 resize-none bg-transparent text-3xl font-bold outline-none"
        placeholder="Title..."
      />
    </div>
  );
}
