import { GalleryAlbum } from "@/lib/types/gallery";
import { useGalleryActions } from "@/stores/useGalleryStore";
import * as ContextMenu from "@radix-ui/react-context-menu";
import { Edit3, PlusSquare, Download, Trash2 } from "lucide-react";
import { toast } from "sonner";
import ContextMenuItem from "./ContextMenuItem";
import BaseContextMenu from "./BaseContextMenu";
import { useActiveNestlingId } from "@/stores/useNestlingStore";
import { useAlbumModal } from "@/stores/useModalStore";

export default function AlbumContextMenu({
  album,
  children,
}: {
  album: GalleryAlbum;
  children: React.ReactNode;
}) {
  const activeNestlingId = useActiveNestlingId();
  if (!activeNestlingId) return;

  const { downloadAlbum, selectImages, deleteAlbum } = useGalleryActions();
  const { openAlbumModal } = useAlbumModal();

  const handleSelectImage = async (albumId: number) => {
    try {
      const selected = await selectImages(activeNestlingId, albumId);
      if (selected) {
        toast.success("Image uploaded successfully!");
      } else {
        toast.error("No image selected");
      }
    } catch (error) {
      toast.error("Failed to upload image");
    }
  };

  const handleDownloadAlbum = async (id: number) => {
    try {
      await downloadAlbum(id);
      toast.success("Album downloaded successfully!");
    } catch (error) {
      toast.error("Failed to download album");
    }
  };

  const handleDeleteAlbum = async (id: number) => {
    try {
      await deleteAlbum(id);
      toast.success("Album deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete album");
    }
  };

  return (
    <BaseContextMenu
      content={
        <>
          <ContextMenuItem
            Icon={Edit3}
            text="Edit"
            action={() => {
              // setTimeout is REQUIRED for the modal to close properly
              // when called in context menu item
              setTimeout(() => openAlbumModal(activeNestlingId, album), 0);
            }}
          />

          <ContextMenuItem
            Icon={PlusSquare}
            text="Add Images"
            action={() => {
              handleSelectImage(album.id);
              console.log("Add images to album");
            }}
          />

          <ContextMenuItem
            Icon={Download}
            text="Download All"
            action={() => {
              handleDownloadAlbum(album.id);
              console.log("Download album");
            }}
          />

          <ContextMenu.Separator className="mx-2 my-1 h-px bg-gray-200 dark:bg-gray-700" />

          <ContextMenuItem
            Icon={Trash2}
            text="Delete Album"
            isDelete
            action={() => {
              handleDeleteAlbum(album.id);
              console.log("Delete album");
            }}
          />
        </>
      }
    >
      {children}
    </BaseContextMenu>
  );
}
