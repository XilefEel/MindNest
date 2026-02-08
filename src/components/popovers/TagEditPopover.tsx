import { Check, Palette, TagIcon } from "lucide-react";
import { COLORS } from "@/lib/utils/constants";
import { useState } from "react";
import { Tag } from "@/lib/types/tag";
import { useNestlingActions } from "@/stores/useNestlingStore";
import { toast } from "@/lib/utils/toast";

export default function TagEditPopover({ tag }: { tag: Tag }) {
  const { updateTag } = useNestlingActions();
  const [name, setName] = useState(tag.name);

  const handleSave = () => {
    if (name.trim() === "") {
      setName(tag.name);
      return;
    }

    try {
      if (name !== tag.name) {
        updateTag(tag.id, name.trim(), tag.color);
      }
    } catch (error) {
      toast.error("Failed to update tag name");
      console.error("Failed to update tag name:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") e.currentTarget.blur();
  };

  const handleColorChange = (color: string) => {
    try {
      updateTag(tag.id, name.trim() || tag.name, color);
    } catch (error) {
      toast.error("Failed to update tag color");
      console.error("Failed to update tag color:", error);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="flex items-center gap-1 text-xs font-medium text-gray-700 dark:text-gray-200">
          <TagIcon size={14} />
          <span>Name</span>
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          placeholder="Tag name..."
          autoFocus
          className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm focus:ring-2 focus:ring-teal-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:ring-teal-400"
        />
      </div>

      <div>
        <label className="flex items-center gap-1 text-xs font-medium text-gray-700 dark:text-gray-200">
          <Palette size={14} />
          <span>Color</span>
        </label>
        <div className="mt-2 grid grid-cols-5 gap-2">
          {COLORS.map((color) => (
            <button
              key={color}
              className="relative h-8 w-8 rounded-full border-2 border-gray-200 transition-all hover:scale-110 dark:border-gray-600"
              style={{ backgroundColor: color }}
              onClick={() => handleColorChange(color)}
            >
              {tag.color === color && (
                <Check className="absolute inset-0 m-auto h-4 w-4 text-white drop-shadow" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
