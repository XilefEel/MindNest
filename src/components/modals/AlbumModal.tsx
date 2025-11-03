import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useGalleryStore } from "@/stores/useGalleryStore";
import { GalleryAlbum } from "@/lib/types/gallery";
import BaseModal from "./BaseModal";
import { TextField } from "./TextField";

export default function AlbumModal({
  nestlingId,
  children,
  album,
}: {
  nestlingId: number;
  children: React.ReactNode;
  album?: GalleryAlbum | null;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { addAlbum, updateAlbum, loading } = useGalleryStore();

  const handleExit = async () => {
    setName("");
    setDescription("");
    setIsOpen(false);
  };

  const handleSaveAlbum = async () => {
    try {
      if (album) {
        await updateAlbum(album.id, { name, description });
        toast.success(`Album "${name}" updated successfully!`);
      } else {
        await addAlbum({
          nestlingId,
          name,
          description,
        });
        toast.success(`Album "${name}" created successfully!`);
      }
      handleExit();
    } catch (error) {
      toast.error("Failed to add album");
      console.error("Failed to add album:", error);
    }
  };

  useEffect(() => {
    if (isOpen && album) {
      setName(album.name || "");
      setDescription(album.description || "");
    } else if (isOpen && !album) {
      setName("");
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
            label="Album Name"
            text={name}
            setText={setName}
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
          disabled={loading || !name.trim()}
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
