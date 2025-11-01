import { Button } from "@/components/ui/button";
import { useGalleryStore } from "@/stores/useGalleryStore";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import BaseModal from "./BaseModal";
import { TextField } from "./TextField";

export default function RenameImageModal({
  children,
  imageId,
}: {
  children: React.ReactNode;
  imageId: number;
}) {
  const { images, editImage } = useGalleryStore();
  const currentImage = images.find((img) => img.id === imageId);

  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState(currentImage?.title || "");
  const [description, setDescription] = useState(
    currentImage?.description || "",
  );

  const handleEditImage = () => {
    try {
      editImage({
        id: imageId,
        albumId: currentImage?.albumId ?? null,
        title,
        description,
        isFavorite: currentImage?.isFavorite ?? false,
      });
      setIsOpen(false);
      toast.success("Image updated successfully!");
    } catch (error) {
      toast.error("Failed to edit image");
      console.error("Failed to edit image:", error);
    }
  };

  useEffect(() => {
    setTitle(currentImage?.title || "");
    setDescription(currentImage?.description || "");
  }, [currentImage]);

  return (
    <BaseModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
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
        <Button
          onClick={handleEditImage}
          className="cursor-pointer rounded-lg bg-teal-600 text-white hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-700"
        >
          Save
        </Button>
      }
    >
      <div onClick={(e) => e.stopPropagation()}>{children}</div>
    </BaseModal>
  );
}
