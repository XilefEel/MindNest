import { NestlingTag } from "@/components/editors/NestlingTag";
import { Nestling } from "@/lib/types/nestling";
import { findFolderPath } from "@/lib/utils/folders";
import { cn } from "@/lib/utils/general";
import { getNestlingIcon } from "@/lib/utils/nestlings";
import { useFolders, useNestlingTags } from "@/stores/useNestlingStore";
import { useActiveBackgroundId } from "@/stores/useNestStore";
import { Folder } from "lucide-react";

export default function SearchItem({
  nestling,
  handleClick,
}: {
  nestling: Nestling;
  handleClick: (nestlingId: number) => void;
}) {
  const Icon = getNestlingIcon(nestling.nestlingType);
  const folders = useFolders();
  const nestlingTags = useNestlingTags(nestling.id);
  const activeBackgroundId = useActiveBackgroundId();

  return (
    <div
      key={nestling.id}
      onClick={() => handleClick(nestling.id)}
      className={cn(
        "flex flex-row items-center justify-between gap-2 p-2 px-4 transition-all duration-100 hover:bg-gray-100 dark:hover:bg-gray-700",
        activeBackgroundId && "hover:bg-white/30 hover:dark:bg-black/30",
      )}
    >
      <div className="flex items-center gap-1">
        <div className="flex w-6 items-center justify-center">
          {nestling.icon ? (
            <p>{nestling.icon}</p>
          ) : (
            <Icon className="size-4 flex-shrink-0" />
          )}
        </div>

        <span>{nestling.title}</span>
      </div>

      <div className="flex flex-1 items-center gap-1 text-gray-500 dark:text-gray-400">
        {nestlingTags.slice(0, 5).map((tag) => (
          <NestlingTag key={tag.id} tag={tag} />
        ))}
        {nestlingTags.length > 5 && (
          <span className="text-xs tracking-widest">
            ... +{nestlingTags.length - 5}
          </span>
        )}
      </div>

      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
        <Folder className="h-4 w-6" />
        <span>{findFolderPath(nestling.folderId, folders) || "No Folder"}</span>
      </div>
    </div>
  );
}
