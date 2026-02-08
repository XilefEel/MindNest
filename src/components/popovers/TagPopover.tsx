import {
  useNestlingActions,
  useTags,
  useSelectedNestlingTags,
} from "@/stores/useNestlingStore";
import { NestlingTag } from "../editors/NestlingTag";
import { Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { useActiveNestId } from "@/stores/useNestStore";
import { getRandomElement } from "@/lib/utils/general";
import { COLORS } from "@/lib/utils/constants";
import { toast } from "@/lib/utils/toast";

export default function TagPopover({ nestlingId }: { nestlingId: number }) {
  const tags = useTags();
  const selectedNestlingTags = useSelectedNestlingTags();
  const activeNestId = useActiveNestId();
  const { deleteTag, attachTag, detachTag, addTag } = useNestlingActions();

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

  const handleDetachTag = async (tagId: number) => {
    try {
      await detachTag(nestlingId, tagId);
    } catch (error) {
      toast.error("Failed to detach tag");
      console.error("Failed to detach tag:", error);
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
          className="w-full rounded-lg border border-gray-300 bg-white py-1 pr-4 pl-9 text-sm shadow-sm focus:ring-2 focus:ring-teal-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:ring-teal-400"
        />
      </div>

      {availableTags.length > 0 && (
        <div className="flex max-h-40 flex-col gap-2 overflow-y-auto">
          <p className="text-xs font-medium text-gray-700 dark:text-gray-200">
            Available tags
          </p>
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
        </div>
      )}

      {searchQuery && availableTags.length === 0 && (
        <button
          onClick={handleCreateAndAttach}
          className="flex w-full cursor-pointer items-center gap-1 rounded-md px-2 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700/50"
        >
          <Plus size={16} className="text-gray-700 dark:text-gray-200" />
          Create "{searchQuery}"
        </button>
      )}

      {selectedNestlingTags.length > 0 && (
        <div className="mt-3 flex flex-col gap-2 border-t border-gray-200 pt-3 dark:border-gray-700">
          <p className="text-xs font-medium text-gray-700 dark:text-gray-200">
            Current tags
          </p>
          <div className="flex flex-wrap gap-1.5">
            {selectedNestlingTags.map((tag) => (
              <NestlingTag
                key={tag.id}
                tag={tag}
                onRemove={() => handleDetachTag(tag.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
