import {
  useNestlingActions,
  useNestlingTags,
  useTags,
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
  const selectedNestlingTags = useNestlingTags(nestlingId);
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
      toast.error("Failed to attach tag.");
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
      toast.error("Failed to create and attach tag.");
    } finally {
      setSearchQuery("");
    }
  };

  return (
    <>
      <div className="relative mb-3 w-full">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search or create a tag..."
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          className={cn(
            "w-full rounded-lg border py-1 pr-4 pl-9 text-sm shadow-sm transition",
            "dark:text-zinc-100 dark:placeholder-gray-400",
            "bg-white dark:bg-zinc-800",
            "focus:ring-2 focus:ring-teal-500 focus:outline-none dark:focus:ring-teal-400",
            "border-gray-300 dark:border-zinc-600",
            activeBackgroundId &&
              "border-transparent bg-white/10 backdrop-blur-sm dark:border-transparent dark:bg-black/10",
          )}
        />
      </div>

      <label className="mb-2 flex items-center gap-1 text-xs font-medium text-gray-700 dark:text-zinc-200">
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
                  className="text-gray-500 transition hover:text-red-500 dark:text-zinc-400 dark:hover:text-red-400"
                />
              }
              onClick={() => handleAttachTag(tag.id)}
            />
          ))}
        </div>
      )}

      {!searchQuery && availableTags.length === 0 && (
        <p className="py-2 text-xs text-gray-700 dark:text-zinc-200">
          No available tags
        </p>
      )}

      {searchQuery && availableTags.length === 0 && (
        <button
          onClick={handleCreateAndAttach}
          className={cn(
            "flex w-full items-center gap-1 rounded-lg px-2 py-2 text-xs transition-colors",
            "text-gray-700 dark:text-zinc-200",
            "hover:bg-gray-50 dark:hover:bg-zinc-700/50",
          )}
        >
          <Plus className="size-4 flex-shrink-0 text-gray-700 dark:text-zinc-200" />
          Create "{searchQuery}"
        </button>
      )}
    </>
  );
}
