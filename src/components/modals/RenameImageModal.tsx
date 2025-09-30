import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGalleryStore } from "@/stores/useGalleryStore";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils/general";
import { useNestStore } from "@/stores/useNestStore";

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

  const { activeBackgroundId } = useNestStore();

  const handleEditImage = () => {
    try {
      editImage({
        id: imageId,
        albumId: currentImage?.album_id ?? null,
        title,
        description,
        is_favorite: currentImage?.is_favorite ?? false,
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div onClick={(e) => e.stopPropagation()}>{children}</div>
      </DialogTrigger>
      <DialogContent
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "w-full rounded-2xl border-0 p-6 shadow-xl transition-all ease-in-out",
          activeBackgroundId
            ? "bg-white/30 backdrop-blur-sm dark:bg-black/30"
            : "bg-white dark:bg-gray-800",
        )}
      >
        <DialogHeader className="justify-between">
          <DialogTitle className="text-xl font-bold text-black dark:text-white">
            Edit Image
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Update your image title and description.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Image Title
            </label>
            <Input
              placeholder="Enter image title"
              value={title}
              autoFocus
              onChange={(e) => setTitle(e.target.value)}
              className="border-gray-300 bg-white text-sm text-black placeholder-gray-400 focus:border-teal-500 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-teal-400 dark:focus:ring-teal-400"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Enter description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full resize-none rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-black placeholder-gray-400 focus:border-teal-500 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-teal-400 dark:focus:ring-teal-400"
            />
          </div>
        </div>

        <DialogFooter className="flex justify-end gap-2">
          <DialogClose asChild>
            <Button
              variant="ghost"
              className="cursor-pointer rounded-lg bg-gray-200 text-black hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            >
              Cancel
            </Button>
          </DialogClose>

          <Button
            onClick={handleEditImage}
            className="cursor-pointer rounded-lg bg-teal-600 text-white hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-700"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
