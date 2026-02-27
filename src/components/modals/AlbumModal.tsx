import { useEffect, useState } from "react";
import { toast } from "@/lib/utils/toast";
import { useGalleryActions, useGalleryStore } from "@/stores/useGalleryStore";
import BaseModal from "./BaseModal";
import { TextField } from "./TextField";
import { useAlbumModal } from "@/stores/useModalStore";

export default function AlbumModal() {
  const loading = useGalleryStore((state) => state.loading);
  const { addAlbum, updateAlbum } = useGalleryActions();

  const { isAlbumOpen, albumNestlingId, albumToEdit, closeAlbumModal } =
    useAlbumModal();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleExit = async () => {
    setName("");
    setDescription("");
    closeAlbumModal();
  };

  const handleSaveAlbum = async () => {
    if (!name.trim() || !albumNestlingId) return;

    try {
      if (albumToEdit) {
        await updateAlbum(albumToEdit.id, { name, description });
        toast.success(`Album "${name}" updated successfully!`);
      } else {
        await addAlbum({
          nestlingId: albumNestlingId,
          name,
          description,
        });
        toast.success(`Album "${name}" created successfully!`);
      }
      handleExit();
    } catch (error) {
      toast.error("Failed to save album.");
    }
  };

  useEffect(() => {
    if (isAlbumOpen && albumToEdit) {
      setName(albumToEdit.name || "");
      setDescription(albumToEdit.description || "");
    } else if (isAlbumOpen && !albumToEdit) {
      setName("");
      setDescription("");
    }
  }, [albumToEdit, isAlbumOpen]);

  return (
    <BaseModal
      isOpen={isAlbumOpen}
      setIsOpen={closeAlbumModal}
      onSubmit={handleSaveAlbum}
      title={albumToEdit ? "Edit Album" : "Create a New Album"}
      description={
        albumToEdit
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
        <button
          onClick={handleSaveAlbum}
          disabled={loading || !name.trim()}
          className="rounded-lg bg-teal-500 px-4 py-1.5 text-sm text-white shadow transition-colors hover:bg-teal-600 disabled:opacity-50 disabled:hover:bg-teal-500 disabled:dark:bg-teal-500"
        >
          {loading
            ? "Saving..."
            : albumToEdit
              ? "Update Album"
              : "Create Album"}
        </button>
      }
    >
      <div />
    </BaseModal>
  );
}
