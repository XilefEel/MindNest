import { useAlbums, useGalleryActions } from "@/stores/useGalleryStore";
import * as ContextMenu from "@radix-ui/react-context-menu";
import { Edit3, Copy, Star, Folder, Download, Trash2 } from "lucide-react";
import { toast } from "@/lib/utils/toast";
import ContextMenuItem from "./ContextMenuItem";
import BaseContextMenu from "./BaseContextMenu";
import { cn } from "@/lib/utils/general";
import { useActiveBackgroundId } from "@/stores/useNestStore";
import { useImageModal } from "@/stores/useModalStore";
import ContextMenuSeparator from "./ContextMenuSeparator";

export default function ImageContextMenu({
  imageId,
  children,
  handleDeleteImage,
  handleAddToFavorites,
}: {
  imageId: number;
  children: React.ReactNode;
  handleDeleteImage: (id: number) => Promise<void>;
  handleAddToFavorites: (id: number) => Promise<void>;
}) {
  const activeBackgroundId = useActiveBackgroundId();

  const albums = useAlbums();
  const { duplicateImage, updateImage, downloadImage } = useGalleryActions();
  const { openImageModal } = useImageModal();

  const handleDownloadImage = async (id: number) => {
    try {
      await downloadImage(id);
      toast.success("Album downloaded successfully!");
    } catch (error) {
      toast.error("Failed to download image");
    }
  };

  const handleDuplicateImage = async (id: number) => {
    try {
      await duplicateImage(id);
      toast.success("Image duplicated successfully!");
    } catch (error) {
      toast.error("Failed to duplicate image");
      console.error("Failed to duplicate image:", error);
    }
  };

  const handleMoveImage = (id: number) => {
    updateImage(imageId, { albumId: id });
    toast.success(
      `Image moved to album "${albums.find((a) => a.id === id)?.name}"!`,
    );
  };

  return (
    <BaseContextMenu
      content={
        <>
          <ContextMenuItem
            action={() => {
              // setTimeout is REQUIRED for the modal to close properly
              // when called in context menu item
              setTimeout(() => openImageModal(imageId), 0);
            }}
            Icon={Edit3}
            text="Rename"
          />

          <ContextMenuItem
            action={() => handleDuplicateImage(imageId)}
            Icon={Copy}
            text="Duplicate"
          />

          <ContextMenuItem
            action={() => handleAddToFavorites(imageId)}
            Icon={Star}
            text="Add to Favorites"
          />

          <ContextMenu.Sub>
            <ContextMenu.SubTrigger
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className={cn(
                "mx-1 flex cursor-pointer items-center gap-3 rounded px-3 py-2 text-sm transition-colors outline-none hover:bg-gray-100 dark:hover:bg-gray-700",
                activeBackgroundId &&
                  "hover:bg-white/30 dark:hover:bg-black/30",
              )}
            >
              <Folder className="h-4 w-4" />
              <span>Move to Album</span>
            </ContextMenu.SubTrigger>

            <ContextMenu.Portal>
              <ContextMenu.SubContent
                className={cn(
                  "animate-in fade-in-0 zoom-in-95 z-50 min-w-[220px] rounded-lg border border-gray-200 bg-white py-2 shadow-lg dark:border-gray-700 dark:bg-gray-800",
                  activeBackgroundId &&
                    "border-0 bg-white/30 backdrop-blur-sm hover:bg-white/30 dark:bg-black/30 dark:hover:bg-black/30",
                )}
              >
                {albums.length === 0 ? (
                  <ContextMenuItem
                    action={() => {}}
                    Icon={Folder}
                    text="No Albums"
                  />
                ) : (
                  albums.map((album) => (
                    <ContextMenuItem
                      key={album.id}
                      action={() => handleMoveImage(album.id)}
                      Icon={Folder}
                      text={album.name}
                    />
                  ))
                )}
              </ContextMenu.SubContent>
            </ContextMenu.Portal>
          </ContextMenu.Sub>

          <ContextMenuItem
            action={() => handleDownloadImage(imageId)}
            Icon={Download}
            text="Download"
          />

          <ContextMenuSeparator />

          <ContextMenuItem
            action={() => handleDeleteImage(imageId)}
            Icon={Trash2}
            text="Delete"
            isDelete
          />
        </>
      }
    >
      {children}
    </BaseContextMenu>
  );
}
