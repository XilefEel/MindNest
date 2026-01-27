import BaseContextMenu from "./BaseContextMenu";
import * as ContextMenu from "@radix-ui/react-context-menu";
import { Copy, ExternalLink, Star, Trash2 } from "lucide-react";
import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import ContextMenuItem from "./ContextMenuItem";
import { Bookmark } from "@/lib/types/bookmark";
import { openUrl } from "@tauri-apps/plugin-opener";

export default function BookmarkContextMenu({
  children,
  bookmark,
  handleDelete,
  handleToggleFavorite,
}: {
  children: React.ReactNode;
  bookmark: Bookmark;
  handleDelete: (id: number) => void;
  handleToggleFavorite: (id: number) => void;
}) {
  return (
    <BaseContextMenu
      content={
        <>
          <ContextMenuItem
            Icon={ExternalLink}
            text="Open in Browser"
            action={() => openUrl(bookmark.url)}
          />

          <ContextMenuItem
            Icon={Copy}
            text="Copy URL"
            action={() => writeText(bookmark.url)}
          />

          <ContextMenu.Separator className="mx-2 my-1 h-px bg-gray-200 dark:bg-gray-700" />

          <ContextMenuItem
            Icon={Star}
            text={bookmark.isFavorite ? "Unfavorite" : "Favorite"}
            action={() => handleToggleFavorite(bookmark.id)}
          />

          <ContextMenuItem
            Icon={Trash2}
            text="Delete"
            isDelete
            action={() => handleDelete(bookmark.id)}
          />
        </>
      }
    >
      {children}
    </BaseContextMenu>
  );
}
