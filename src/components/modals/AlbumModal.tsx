import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useGalleryStore } from "@/stores/useGalleryStore";
import { GalleryAlbum } from "@/lib/types/gallery";
import BaseModal from "./BaseModal";
import { TextField } from "./TextField";

export default function AlbumModal({
  nestling_id,
  children,
  album,
}: {
  nestling_id: number;
  children: React.ReactNode;
  album?: GalleryAlbum | null;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { addAlbum, editAlbum, loading } = useGalleryStore();

  const handleExit = async () => {
    setTitle("");
    setDescription("");
    setIsOpen(false);
  };

  const handleSaveAlbum = async () => {
    try {
      if (album) {
        await editAlbum({
          ...album,
          name: title,
          description,
        });
        toast.success(`Album "${title}" updated successfully!`);
      } else {
        await addAlbum({
          nestling_id,
          name: title,
          description,
        });

        toast.success(`Album "${title}" created successfully!`);
      }
      handleExit();
    } catch (error) {
      toast.error("Failed to add album");
      console.error("Failed to add album:", error);
    }
  };

  useEffect(() => {
    if (isOpen && album) {
      setTitle(album.name || "");
      setDescription(album.description || "");
    } else if (isOpen && !album) {
      setTitle("");
      setDescription("");
    }
  }, [album, isOpen]);

  return (
    <BaseModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title={album ? "Edit Album" : "Create a New Album"}
      description={
        album
          ? "Update the details of your album"
          : "Create a new album to organize your pictures"
      }
      body={
        <>
          <TextField
            label="Album Title"
            text={title}
            setText={setTitle}
            placeholder="e.g. Family, Vacation, Work"
          />

          <TextField
            label="Description"
            text={description}
            setText={setDescription}
            placeholder="e.g. Photos from my trip to Italy"
          />
        </>
      }
      footer={
        <Button
          onClick={handleSaveAlbum}
          disabled={loading || !title.trim()}
          className="cursor-pointer rounded-lg bg-teal-500 text-white hover:bg-teal-600 disabled:opacity-50"
        >
          {loading ? "Saving..." : album ? "Update Album" : "Create Album"}
        </Button>
      }
    >
      {children}
    </BaseModal>
  );
}
