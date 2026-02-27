import { useGalleryActions, useImages } from "@/stores/useGalleryStore";
import { useEffect, useState } from "react";
import { toast } from "@/lib/utils/toast";
import BaseModal from "./BaseModal";
import { TextField } from "./TextField";
import { useImageModal } from "@/stores/useModalStore";

export default function RenameImageModal() {
  const images = useImages();
  const { updateImage } = useGalleryActions();

  const { isImageOpen, imageId, closeImageModal } = useImageModal();

  const currentImage = imageId
    ? images.find((img) => img.id === imageId)
    : null;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleEditImage = () => {
    if (!imageId) return;

    try {
      updateImage(imageId, { title, description });
      closeImageModal();
      toast.success("Image updated successfully!");
    } catch (error) {
      toast.error("Failed to edit image");
      console.error("Failed to edit image:", error);
    }
  };

  useEffect(() => {
    if (isImageOpen && currentImage) {
      setTitle(currentImage.title || "");
      setDescription(currentImage.description || "");
    }
  }, [currentImage, isImageOpen]);

  return (
    <BaseModal
      isOpen={isImageOpen}
      setIsOpen={closeImageModal}
      onSubmit={handleEditImage}
      title="Edit Image"
      description="Update your image title and description."
      body={
        <>
          <TextField
            label="Title"
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
        <button
          onClick={handleEditImage}
          className="rounded-lg bg-teal-500 px-4 py-1.5 text-sm text-white shadow transition-colors hover:bg-teal-600 disabled:opacity-50 disabled:hover:bg-teal-500 disabled:dark:bg-teal-500"
        >
          Save
        </button>
      }
    >
      <div />
    </BaseModal>
  );
}
