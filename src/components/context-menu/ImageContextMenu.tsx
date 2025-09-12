import { useGalleryStore } from "@/stores/useGalleryStore";
import * as ContextMenu from "@radix-ui/react-context-menu";
import {
  Edit3,
  Copy,
  Star,
  Folder,
  Tag,
  Archive,
  Download,
  Trash2,
} from "lucide-react";

export default function ImageContextMenu({
  imageId,
  children,
}: {
  imageId: number;
  children: React.ReactNode;
}) {
  const { albums } = useGalleryStore();
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger asChild>{children}</ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content className="animate-in fade-in-0 zoom-in-95 z-50 min-w-[220px] rounded-lg border border-gray-200 bg-white py-2 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          {/* Core actions */}
          <ContextMenu.Item
            className="mx-1 flex cursor-pointer items-center gap-3 rounded px-3 py-2 text-sm transition-colors outline-none hover:bg-gray-100 dark:hover:bg-gray-700"
            onSelect={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("Rename image", imageId);
            }}
          >
            <Edit3 className="h-4 w-4" />
            Rename
          </ContextMenu.Item>

          <ContextMenu.Item
            className="mx-1 flex cursor-pointer items-center gap-3 rounded px-3 py-2 text-sm transition-colors outline-none hover:bg-gray-100 dark:hover:bg-gray-700"
            onSelect={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("Duplicate image", imageId);
            }}
          >
            <Copy className="h-4 w-4" />
            Duplicate
          </ContextMenu.Item>

          <ContextMenu.Item
            className="mx-1 flex cursor-pointer items-center gap-3 rounded px-3 py-2 text-sm transition-colors outline-none hover:bg-gray-100 dark:hover:bg-gray-700"
            onSelect={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("Toggle favorite", imageId);
            }}
          >
            <Star className="h-4 w-4" />
            Add to Favorites
          </ContextMenu.Item>

          {/* Submenu for albums */}
          <ContextMenu.Sub>
            <ContextMenu.SubTrigger className="mx-1 flex cursor-pointer items-center gap-3 rounded px-3 py-2 text-sm transition-colors outline-none hover:bg-gray-100 dark:hover:bg-gray-700">
              <Folder className="h-4 w-4" />
              Move to Album
            </ContextMenu.SubTrigger>
            <ContextMenu.Portal>
              <ContextMenu.SubContent className="min-w-[180px] rounded-md border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                {albums.length === 0 ? (
                  <ContextMenu.Item
                    disabled
                    className="rounded px-3 py-2 text-sm text-gray-500 dark:text-gray-400"
                  >
                    No albums
                  </ContextMenu.Item>
                ) : (
                  albums.map((album) => (
                    <ContextMenu.Item
                      key={album.id}
                      className="rounded px-3 py-2 text-sm outline-none hover:bg-gray-100 dark:hover:bg-gray-700"
                      onSelect={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log(
                          `Move image ${imageId} to album ${album.id}`,
                        );
                      }}
                    >
                      {album.name}
                    </ContextMenu.Item>
                  ))
                )}
              </ContextMenu.SubContent>
            </ContextMenu.Portal>
          </ContextMenu.Sub>

          <ContextMenu.Item
            className="mx-1 flex cursor-pointer items-center gap-3 rounded px-3 py-2 text-sm transition-colors outline-none hover:bg-gray-100 dark:hover:bg-gray-700"
            onSelect={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("Manage tags for image", imageId);
            }}
          >
            <Tag className="h-4 w-4" />
            Edit Tags
          </ContextMenu.Item>

          <ContextMenu.Separator className="mx-2 my-1 h-px bg-gray-200 dark:bg-gray-700" />

          {/* Secondary actions */}
          <ContextMenu.Item
            className="mx-1 flex cursor-pointer items-center gap-3 rounded px-3 py-2 text-sm transition-colors outline-none hover:bg-gray-100 dark:hover:bg-gray-700"
            onSelect={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("Archive image", imageId);
            }}
          >
            <Archive className="h-4 w-4" />
            Archive
          </ContextMenu.Item>

          <ContextMenu.Item
            className="mx-1 flex cursor-pointer items-center gap-3 rounded px-3 py-2 text-sm transition-colors outline-none hover:bg-gray-100 dark:hover:bg-gray-700"
            onSelect={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("Download image", imageId);
            }}
          >
            <Download className="h-4 w-4" />
            Download
          </ContextMenu.Item>

          <ContextMenu.Separator className="mx-2 my-1 h-px bg-gray-200 dark:bg-gray-700" />

          {/* Destructive */}
          <ContextMenu.Item
            className="mx-1 flex cursor-pointer items-center gap-3 rounded px-3 py-2 text-sm text-red-600 transition-colors outline-none hover:bg-red-50 dark:hover:bg-red-900/40"
            onSelect={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("Delete image", imageId);
            }}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
}
