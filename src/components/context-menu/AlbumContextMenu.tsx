import { GalleryAlbum } from "@/lib/types/gallery";
import { useGalleryStore } from "@/stores/useGalleryStore";
import * as ContextMenu from "@radix-ui/react-context-menu";
import { Edit3, PlusSquare, Download, Trash2 } from "lucide-react";
import AddAlbumModal from "../modals/AddAlbumModal";
import { useNestlingTreeStore } from "@/stores/useNestlingStore";
import { toast } from "sonner";
import ContextMenuItem from "./ContextMenuItem";
import BaseContextMenu from "./BaseContextMenu";

export default function AlbumContextMenu({
  album,
  children,
}: {
  album: GalleryAlbum;
  children: React.ReactNode;
}) {
  const { activeNestling } = useNestlingTreeStore();
  if (!activeNestling) return;
  const { downloadAlbum, selectImages, removeAlbum } = useGalleryStore();

  const handleSelectImage = async (albumId: number) => {
    try {
      const selected = await selectImages(activeNestling.id, albumId);
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
      await removeAlbum(id);
      toast.success("Album deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete album");
    }
  };

  return (
    <BaseContextMenu
      content={
        <>
          {/* Using ContextMenu.Item instead of ContextMenuItem
              because modal triggers don't work with custom ContextMenuItem component*/}
          <AddAlbumModal nestling_id={activeNestling.id} album={album}>
            <ContextMenu.Item
              className="mx-1 flex cursor-pointer items-center gap-3 rounded px-3 py-2 text-sm transition-colors outline-none hover:bg-gray-100 dark:hover:bg-gray-700"
              onSelect={(e) => {
                e.preventDefault();
                console.log("Rename album");
              }}
            >
              <Edit3 className="size-4" />
              Edit
            </ContextMenu.Item>
          </AddAlbumModal>

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
