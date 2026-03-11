import { toast } from "@/lib/utils/toast";
import { useGalleryActions, useImages } from "@/stores/useGalleryStore";
import { useImageModal } from "@/stores/useModalStore";
import { Copy, Download, Edit3, Star, StarOff, Trash2 } from "lucide-react";
import BaseContextMenu from "./BaseContextMenu";
import ContextMenuItem from "./ContextMenuItem";
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
  // const albums = useAlbums();
  const { duplicateImage, downloadImage } = useGalleryActions();
  const { openImageModal } = useImageModal();

  const images = useImages();
  const image = images.find((i) => i.id === imageId);
  if (!image) return null;

  const isFavorite = image.isFavorite;

  const handleDownloadImage = async (id: number) => {
    try {
      const success = await downloadImage(id);
      if (success) {
        toast.success("Image downloaded successfully!");
      }
    } catch (error) {
      toast.error("Failed to download image.");
    }
  };

  const handleDuplicateImage = async (id: number) => {
    try {
      await duplicateImage(id);
      toast.success("Image duplicated successfully!");
    } catch (error) {
      toast.error("Failed to duplicate image.");
    }
  };

  // const handleMoveImage = (id: number) => {
  //   updateImage(imageId, { albumId: id });
  //   toast.success(
  //     `Image moved to album "${albums.find((a) => a.id === id)?.name}"!`,
  //   );
  // };

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
            Icon={isFavorite ? StarOff : Star}
            text={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          />

          {/*<ContextSubMenu
            trigger={
              <>
                <FolderInput className="size-4 flex-shrink-0" />
                <span>Move to Album</span>
                <ChevronRight className="ml-auto" size={16} />
              </>
            }
            content={
              <>
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
              </>
            }
          />*/}

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
