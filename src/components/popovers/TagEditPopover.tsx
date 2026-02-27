import { Check, Palette, TagIcon } from "lucide-react";
import { COLORS } from "@/lib/utils/constants";
import { useState } from "react";
import { Tag } from "@/lib/types/tag";
import { useNestlingActions } from "@/stores/useNestlingStore";
import { toast } from "@/lib/utils/toast";
import { cn } from "@/lib/utils/general";
import { useActiveBackgroundId } from "@/stores/useNestStore";

export default function TagEditPopover({ tag }: { tag: Tag }) {
  const { updateTag } = useNestlingActions();
  const activeBackgroundId = useActiveBackgroundId();

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
      toast.error("Failed to update tag name.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") e.currentTarget.blur();
  };

  const handleChangeColor = (color: string) => {
    try {
      updateTag(tag.id, name.trim() || tag.name, color);
    } catch (error) {
      toast.error("Failed to update tag color.");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="mb-1 flex items-center gap-1 text-xs font-medium text-gray-700 dark:text-gray-200">
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
          className={cn(
            "w-full rounded-lg border px-3 py-1 text-sm shadow-sm transition",
            "dark:text-gray-100 dark:placeholder-gray-400",
            "bg-white dark:bg-gray-800",
            "focus:ring-2 focus:ring-teal-500 focus:outline-none dark:focus:ring-teal-400",
            "border-gray-300 dark:border-gray-600",
            activeBackgroundId &&
              "border-0 bg-white/10 backdrop-blur-sm dark:bg-black/10",
          )}
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
              className={cn(
                "relative h-8 w-8 rounded-full border-2 border-gray-200 transition-all hover:scale-110 dark:border-gray-600",
                activeBackgroundId && "border-black/20 dark:border-white/20",
              )}
              style={{ backgroundColor: color }}
              onClick={() => handleChangeColor(color)}
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
