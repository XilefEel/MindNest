import * as ContextMenu from "@radix-ui/react-context-menu";
import {
  Edit3,
  PlusSquare,
  Star,
  Archive,
  Download,
  Trash2,
  Edit,
} from "lucide-react";

export default function AlbumContextMenu({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger asChild>{children}</ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content className="animate-in fade-in-0 zoom-in-95 z-50 min-w-[220px] rounded-lg border border-gray-200 bg-white py-2 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <ContextMenu.Item
            className="mx-1 flex cursor-pointer items-center gap-3 rounded px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
            onSelect={(e) => {
              e.preventDefault();
              console.log("Rename album");
            }}
          >
            <Edit3 className="size-4" />
            Rename
          </ContextMenu.Item>

          <ContextMenu.Item
            className="mx-1 flex cursor-pointer items-center gap-3 rounded px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
            onSelect={(e) => {
              e.preventDefault();
              console.log("Rename album");
            }}
          >
            <Edit className="size-4" />
            Edit Description
          </ContextMenu.Item>

          <ContextMenu.Item
            className="mx-1 flex cursor-pointer items-center gap-3 rounded px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
            onSelect={(e) => {
              e.preventDefault();
              console.log("Add images to album");
            }}
          >
            <PlusSquare className="size-4" />
            Add Images
          </ContextMenu.Item>

          <ContextMenu.Separator className="mx-2 my-1 h-px bg-gray-200 dark:bg-gray-700" />

          <ContextMenu.Item
            className="mx-1 flex cursor-pointer items-center gap-3 rounded px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
            onSelect={(e) => {
              e.preventDefault();
              console.log("Toggle favorite album");
            }}
          >
            <Star className="size-4" />
            Favorite Album
          </ContextMenu.Item>

          <ContextMenu.Item
            className="mx-1 flex cursor-pointer items-center gap-3 rounded px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
            onSelect={(e) => {
              e.preventDefault();
              console.log("Archive album");
            }}
          >
            <Archive className="size-4" />
            Archive
          </ContextMenu.Item>

          <ContextMenu.Item
            className="mx-1 flex cursor-pointer items-center gap-3 rounded px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
            onSelect={(e) => {
              e.preventDefault();
              console.log("Download album");
            }}
          >
            <Download className="size-4" />
            Download
          </ContextMenu.Item>

          <ContextMenu.Separator className="mx-2 my-1 h-px bg-gray-200 dark:bg-gray-700" />

          <ContextMenu.Item
            className="mx-1 flex cursor-pointer items-center gap-3 rounded px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/40"
            onSelect={(e) => {
              e.preventDefault();
              console.log("Delete album");
            }}
          >
            <Trash2 className="size-4" />
            Delete Album
          </ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
}
