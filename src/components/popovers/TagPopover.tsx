import {
  useNestlingActions,
  useTags,
  useSelectedNestlingTags,
} from "@/stores/useNestlingStore";
import { NestlingTag } from "../editors/NestlingTag";
import { Plus, Search, TagIcon, Trash2 } from "lucide-react";
import { useState } from "react";
import { useActiveBackgroundId, useActiveNestId } from "@/stores/useNestStore";
import { cn, getRandomElement } from "@/lib/utils/general";
import { COLORS } from "@/lib/utils/constants";
import { toast } from "@/lib/utils/toast";

export default function TagPopover({ nestlingId }: { nestlingId: number }) {
  const tags = useTags();
  const selectedNestlingTags = useSelectedNestlingTags();
  const activeNestId = useActiveNestId();
  const { deleteTag, attachTag, addTag } = useNestlingActions();
  const activeBackgroundId = useActiveBackgroundId();

  const [searchQuery, setSearchQuery] = useState("");

  const availableTags = tags.filter(
    (tag) =>
      !selectedNestlingTags.some((t) => t.id === tag.id) &&
      tag.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleAttachTag = async (tagId: number) => {
    try {
      await attachTag(nestlingId, tagId);
    } catch (error) {
      toast.error("Failed to attach tag");
      console.error("Failed to attach tag:", error);
    }
  };

  const handleCreateAndAttach = async () => {
    try {
      const newTag = await addTag({
        nestId: activeNestId!,
        name: searchQuery || "New Tag",
        color: getRandomElement(COLORS),
      });

      await attachTag(nestlingId, newTag.id);
    } catch (error) {
      toast.error("Failed to create and attach tag");
      console.error("Failed to create and attach tag:", error);
    } finally {
      setSearchQuery("");
    }
  };

  return (
    <div>
      <div className="relative mb-3 w-full">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search or create a tag..."
          className={cn(
            "w-full rounded-lg border py-1 pr-4 pl-9 text-sm shadow-sm transition",
            "dark:text-gray-100 dark:placeholder-gray-400",
            "bg-white dark:bg-gray-800",
            "focus:ring-2 focus:ring-teal-500 focus:outline-none dark:focus:ring-teal-400",
            "border-gray-300 dark:border-gray-600",
            activeBackgroundId &&
              "border-0 bg-white/10 backdrop-blur-sm dark:bg-black/10",
          )}
        />
      </div>

      <label className="mb-2 flex items-center gap-1 text-xs font-medium text-gray-700 dark:text-gray-200">
        <TagIcon size={14} />
        <span>Available Tags</span>
      </label>

      {availableTags.length > 0 && (
        <div className="flex flex-row flex-wrap gap-1.5">
          {availableTags.map((tag) => (
            <NestlingTag
              key={tag.id}
              tag={tag}
              onRemove={() => deleteTag(tag.id)}
              removeIcon={
                <Trash2
                  size={12}
                  className="text-gray-500 transition hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                />
              }
              onClick={() => handleAttachTag(tag.id)}
            />
          ))}
        </div>
      )}

      {!searchQuery && availableTags.length === 0 && (
        <p className="py-2 text-sm font-medium text-gray-700 dark:text-gray-200">
          No available tags
        </p>
      )}

      {searchQuery && availableTags.length === 0 && (
        <button
          onClick={handleCreateAndAttach}
          className="flex w-full cursor-pointer items-center gap-1 rounded-lg px-2 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700/50"
        >
          <Plus size={16} className="text-gray-700 dark:text-gray-200" />
          Create "{searchQuery}"
        </button>
      )}
    </div>
  );
}
