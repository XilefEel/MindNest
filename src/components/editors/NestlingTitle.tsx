import { Nestling } from "@/lib/types/nestling";
import { findFolderPath } from "@/lib/utils/folders";
import { cn } from "@/lib/utils/general";
import { getNestlingIcon } from "@/lib/utils/nestlings";
import { toast } from "@/lib/utils/toast";
import {
  useFolderMap,
  useNestlingActions,
  useNestlingTags,
} from "@/stores/useNestlingStore";
import { useActiveBackgroundId } from "@/stores/useNestStore";
import {
  useCompactNestlingTitle,
  useNestlingTitleHidden,
  useSettingsActions,
} from "@/stores/useSettingsStore";
import { ChevronDown, Dot, Folder, Plus } from "lucide-react";
import { useRef, useState } from "react";
import BasePopover from "../popovers/BasePopover";
import TagEditPopover from "../popovers/TagEditPopover";
import TagPopover from "../popovers/TagPopover";
import { NestlingTag } from "./NestlingTag";
import EmojiMenu from "../EmojiMenu";

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
  const folderMap = useFolderMap();
  const nestlingTags = useNestlingTags(nestling.id);
  const { detachTag } = useNestlingActions();

  const [isOpen, setIsOpen] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  const nestlingTitleHidden = useNestlingTitleHidden();
  const compactNestlingTitle = useCompactNestlingTitle();
  const { setSetting } = useSettingsActions();

  const Icon = getNestlingIcon(nestling.nestlingType);

  const handleDetachTag = async (tagId: number) => {
    try {
      await detachTag(nestling.id, tagId);
    } catch (error) {
      toast.error("Failed to detach tag.");
    }
  };

  if (nestlingTitleHidden) return null;

  return (
    <div className="relative flex flex-col">
      <div className="group flex flex-row items-center text-zinc-900 transition-all dark:text-zinc-100">
        <button
          onClick={() =>
            setSetting("compactNestlingTitle", !compactNestlingTitle)
          }
          className="w-0 text-zinc-500 opacity-0 transition-all group-hover:mr-2 group-hover:w-6 group-hover:opacity-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          <ChevronDown
            size={24}
            className={compactNestlingTitle ? "-rotate-90" : ""}
          />
        </button>

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
            <Icon size={compactNestlingTitle ? 24 : 32} className="shrink-0" />
          )}
        </button>

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
          "mt-2 flex items-center gap-1.5 text-zinc-800 dark:text-zinc-200",
          compactNestlingTitle && "hidden",
        )}
      >
        <Folder className="size-4 shrink-0" />

        <span className="text-sm">
          {findFolderPath(nestling.folderId, folderMap) || "No folder"}
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
                "text-zinc-600 hover:text-zinc-700 dark:text-zinc-300 dark:hover:text-zinc-200",
                "border-zinc-300 hover:border-zinc-400 dark:border-zinc-600 dark:hover:border-zinc-500",
                "hover:bg-zinc-200/50 dark:hover:bg-zinc-700",
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

      {showPicker && (
        <div className="absolute top-10 left-0 z-50">
          <EmojiMenu
            nestling={nestling}
            showPicker={showPicker}
            setShowPicker={setShowPicker}
            pickerRef={pickerRef}
            width={300}
            height={400}
          />
        </div>
      )}
    </div>
  );
}
