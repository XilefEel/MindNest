import NestlingContextMenu from "@/components/context-menu/NestlingContextMenu";
import { NestlingTag } from "@/components/editors/NestlingTag";
import { Nestling } from "@/lib/types/nestling";
import { findFolderPath } from "@/lib/utils/folders";
import { cn } from "@/lib/utils/general";
import { getNestlingIcon, getNestlingTypeColor } from "@/lib/utils/nestlings";
import { useNestlingTags, useFolders } from "@/stores/useNestlingStore";
import { useActiveBackgroundId } from "@/stores/useNestStore";
import { formatDistanceToNow } from "date-fns";
import { Folder, ArrowRight, Dot } from "lucide-react";

export default function RecentCard({
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

  const { color, border } = getNestlingTypeColor(nestling.nestlingType);

  return (
    <NestlingContextMenu nestlingId={nestling.id}>
      <div
        onClick={() => onClick(nestling.id)}
        className={cn(
          "group relative min-h-[120px] rounded-xl border p-4 shadow-sm hover:shadow-md",
          "bg-white dark:bg-gray-800",
          "border-gray-100 dark:border-gray-700",
          "transition-[scale,border] hover:scale-[1.02]",
          border,
          activeBackgroundId &&
            cn(
              "border-transparent dark:border-transparent",
              "bg-white/10 backdrop-blur-sm dark:bg-black/10",
            ),
        )}
      >
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 font-semibold">
            <div
              className={cn(
                "flex size-8 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700",
                !nestling.icon && color,
              )}
            >
              {nestling.icon ? (
                <p>{nestling.icon}</p>
              ) : (
                <Icon className="size-4 text-white" />
              )}
            </div>

            <span className="text-gray-800 dark:text-gray-100">
              {nestling.title}
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <Folder className="size-3.5" />
            <span>
              {findFolderPath(nestling.folderId, folders) || "No Folder"}
            </span>
            <Dot size={16} />
            <span>
              {formatDistanceToNow(new Date(nestling.updatedAt), {
                addSuffix: true,
              })}
            </span>
          </div>

          {nestlingTags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {nestlingTags.slice(0, 5).map((tag) => (
                <NestlingTag key={tag.id} tag={tag} />
              ))}
              {nestlingTags.length > 5 && (
                <span className="text-xs tracking-widest text-gray-400">
                  +{nestlingTags.length - 5}
                </span>
              )}
            </div>
          )}
        </div>

        <ArrowRight
          className={cn(
            "absolute top-4 right-4 size-4 flex-shrink-0 text-gray-500 opacity-0 transition-opacity group-hover:opacity-100 dark:text-gray-300",
            activeBackgroundId && "text-gray-400",
          )}
        />
      </div>
    </NestlingContextMenu>
  );
}
