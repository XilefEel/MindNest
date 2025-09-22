import { useGalleryStore } from "@/stores/useGalleryStore";
import * as ContextMenu from "@radix-ui/react-context-menu";
import { Edit3, Copy, Star, Folder, Tag, Download, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function ImageContextMenu({
  imageId,
  children,
}: {
  imageId: number;
  children: React.ReactNode;
}) {
  const { images, albums, addImage, editImage, removeImage, downloadImage } =
    useGalleryStore();
  const handleDownloadImage = async (id: number) => {
    await downloadImage(id);
    toast.success("Image downloaded successfully!");
  };

  const handleDuplicateImage = (id: number) => {
    const originalImage = images.find((i) => i.id === id);
    if (originalImage) {
      addImage(originalImage);
      toast.success("Image duplicated successfully!");
    }
  };

  const handleRenameImage = (id: number) => {
    console.log("Rename image", id);
  };

  const handleMoveImage = (id: number) => {
    editImage({
      id: imageId,
      albumId: id,
      title: null,
      description: null,
      tags: null,
    });
    toast.success(
      `Image moved to album "${albums.find((a) => a.id === id)?.name}"!`,
    );
  };

  const handleDeleteImage = async (id: number) => {
    await removeImage(id);
    toast.success("Image deleted successfully!");
  };

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger asChild>{children}</ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content className="animate-in fade-in-0 zoom-in-95 z-50 min-w-[220px] rounded-lg border border-gray-200 bg-white py-2 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <ContextMenu.Item
            className="mx-1 flex cursor-pointer items-center gap-3 rounded px-3 py-2 text-sm transition-colors outline-none hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={(e) => {
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
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleDuplicateImage(imageId);
            }}
          >
            <Copy className="h-4 w-4" />
            Duplicate
          </ContextMenu.Item>

          <ContextMenu.Item
            className="mx-1 flex cursor-pointer items-center gap-3 rounded px-3 py-2 text-sm transition-colors outline-none hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("Toggle favorite", imageId);
            }}
          >
            <Star className="h-4 w-4" />
            Add to Favorites
          </ContextMenu.Item>

          <ContextMenu.Sub>
            <ContextMenu.SubTrigger
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="mx-1 flex cursor-pointer items-center gap-3 rounded px-3 py-2 text-sm transition-colors outline-none hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Folder className="h-4 w-4" />
              Move to Album
            </ContextMenu.SubTrigger>
            <ContextMenu.Portal>
              <ContextMenu.SubContent className="animate-in fade-in-0 zoom-in-95 z-50 min-w-[220px] rounded-lg border border-gray-200 bg-white py-2 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                {albums.length === 0 ? (
                  <ContextMenu.Item
                    disabled
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    className="rounded px-3 py-2 text-sm text-gray-500 dark:text-gray-400"
                  >
                    No albums
                  </ContextMenu.Item>
                ) : (
                  albums.map((album) => (
                    <ContextMenu.Item
                      key={album.id}
                      className="mx-1 flex cursor-pointer items-center gap-3 rounded px-3 py-2 text-sm transition-colors outline-none hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleMoveImage(album.id);
                      }}
                    >
                      <Folder className="h-4 w-4" />
                      {album.name}
                    </ContextMenu.Item>
                  ))
                )}
              </ContextMenu.SubContent>
            </ContextMenu.Portal>
          </ContextMenu.Sub>

          <ContextMenu.Item
            className="mx-1 flex cursor-pointer items-center gap-3 rounded px-3 py-2 text-sm transition-colors outline-none hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("Manage tags for image", imageId);
            }}
          >
            <Tag className="h-4 w-4" />
            Edit Tags
          </ContextMenu.Item>

          <ContextMenu.Item
            className="mx-1 flex cursor-pointer items-center gap-3 rounded px-3 py-2 text-sm transition-colors outline-none hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleDownloadImage(imageId);
            }}
          >
            <Download className="h-4 w-4" />
            Download
          </ContextMenu.Item>

          <ContextMenu.Separator className="mx-2 my-1 h-px bg-gray-200 dark:bg-gray-700" />

          <ContextMenu.Item
            className="mx-1 flex cursor-pointer items-center gap-3 rounded px-3 py-2 text-sm text-red-600 transition-colors outline-none hover:bg-red-50 dark:hover:bg-red-900/40"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleDeleteImage(imageId);
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
