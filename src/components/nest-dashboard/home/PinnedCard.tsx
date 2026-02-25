import NestlingContextMenu from "@/components/context-menu/NestlingContextMenu";
import { NestlingTag } from "@/components/editors/NestlingTag";
import { Nestling } from "@/lib/types/nestling";
import { findFolderPath } from "@/lib/utils/folders";
import { cn } from "@/lib/utils/general";
import { getNestlingIcon } from "@/lib/utils/nestlings";
import { useNestlingTags, useFolders } from "@/stores/useNestlingStore";
import { useActiveBackgroundId } from "@/stores/useNestStore";
import { Folder, ArrowRight, Dot } from "lucide-react";

export default function PinnedCard({
  nestling,
  onClick,
}: {
  nestling: Nestling;
  onClick: (id: number) => void;
}) {
  const Icon = getNestlingIcon(nestling.nestlingType);
  const nestlingTags = useNestlingTags(nestling.id);
  const folders = useFolders();
  const activeBackgroundId = useActiveBackgroundId();

  return (
    <NestlingContextMenu nestlingId={nestling.id}>
      <div
        onClick={() => onClick(nestling.id)}
        className={cn(
          "group rounded-xl border border-l-4 p-4 shadow-sm hover:shadow-md",
          "bg-white dark:bg-gray-800",
          "border-gray-200 border-l-pink-500 hover:border-pink-500 dark:border-gray-800 dark:border-l-pink-500 dark:hover:hover:border-pink-500",
          "transition-[scale] hover:scale-105",
          activeBackgroundId &&
            "border-t-0 border-r-0 border-b-0 bg-white/10 backdrop-blur-sm dark:bg-black/10",
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1 font-semibold">
              <div className="flex w-6 items-center justify-center">
                {nestling.icon ? (
                  <p>{nestling.icon}</p>
                ) : (
                  <Icon className="size-4 flex-shrink-0" />
                )}
              </div>
              <span>{nestling.title}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Folder className="h-4 w-6" />
                <span>
                  {findFolderPath(nestling.folderId, folders) || "No Folder"}
                </span>
              </div>

              {nestlingTags.length > 0 && <Dot size={20} />}

              <div className="flex items-center gap-1">
                {nestlingTags.slice(0, 3).map((tag) => (
                  <NestlingTag key={tag.id} tag={tag} />
                ))}
                {nestlingTags.length > 3 && (
                  <span className="text-xs tracking-widest">
                    ... +{nestlingTags.length - 3}
                  </span>
                )}
              </div>
            </div>
          </div>
          <ArrowRight
            className={cn(
              "h-5 w-5 text-gray-500 transition dark:text-gray-300",
              activeBackgroundId && "text-gray-400",
            )}
          />
        </div>
      </div>
    </NestlingContextMenu>
  );
}
