import { GalleryAlbum } from "@/lib/types";
import { useGalleryStore } from "@/stores/useGalleryStore";
import * as ContextMenu from "@radix-ui/react-context-menu";
import { Edit3, PlusSquare, Download, Trash2 } from "lucide-react";
import AddAlbumModal from "../modals/AddAlbumModal";
import { useNestlingTreeStore } from "@/stores/useNestlingStore";
import { toast } from "sonner";

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
    <ContextMenu.Root>
      <ContextMenu.Trigger asChild>{children}</ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content className="animate-in fade-in-0 zoom-in-95 z-50 min-w-[220px] rounded-lg border border-gray-200 bg-white py-2 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <AddAlbumModal nestling_id={activeNestling.id} album={album}>
            <ContextMenu.Item
              className="mx-1 flex cursor-pointer items-center gap-3 rounded px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
              onSelect={(e) => {
                e.preventDefault();
                console.log("Rename album");
              }}
            >
              <Edit3 className="size-4" />
              Edit
            </ContextMenu.Item>
          </AddAlbumModal>

          <ContextMenu.Item
            className="mx-1 flex cursor-pointer items-center gap-3 rounded px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
            onSelect={(e) => {
              e.preventDefault();
              handleSelectImage(album.id);
              console.log("Add images to album");
            }}
          >
            <PlusSquare className="size-4" />
            Add Images
          </ContextMenu.Item>

          <ContextMenu.Item
            className="mx-1 flex cursor-pointer items-center gap-3 rounded px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
            onSelect={(e) => {
              e.preventDefault();
              handleDownloadAlbum(album.id);
              console.log("Download album");
            }}
          >
            <Download className="size-4" />
            Download All
          </ContextMenu.Item>

          <ContextMenu.Separator className="mx-2 my-1 h-px bg-gray-200 dark:bg-gray-700" />

          <ContextMenu.Item
            className="mx-1 flex cursor-pointer items-center gap-3 rounded px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/40"
            onSelect={(e) => {
              e.preventDefault();
              handleDeleteAlbum(album.id);
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
