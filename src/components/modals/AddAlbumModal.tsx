import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useGalleryStore } from "@/stores/useGalleryStore";
import { AlertCircle } from "lucide-react";
import { GalleryAlbum } from "@/lib/types/gallery";

export default function AddAlbumModal({
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addAlbum, editAlbum } = useGalleryStore();

  const handleExit = async () => {
    setTitle("");
    setIsOpen(false);
    setError(null);
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
    } catch (error) {
      setError(String(error));
      console.error("Failed to add album:", error);
    } finally {
      handleExit();
      setLoading(false);
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
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger className="w-full">{children}</DialogTrigger>
        <DialogContent className="w-full rounded-2xl border-0 bg-white p-6 shadow-xl transition-all ease-in-out dark:bg-gray-800">
          <DialogHeader className="justify-between">
            <DialogTitle className="text-xl font-bold text-black dark:text-white">
              {album ? "Edit Album" : "Create a New Album"}
            </DialogTitle>
            <DialogDescription>
              {album
                ? "Update the details of your album"
                : "Create a new album to organize your pictures"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Album Title
              </label>
              <Input
                placeholder="e.g. Family, Vacation, Work"
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
                placeholder="e.g. Photos from my trip to Italy"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full resize-none rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-black placeholder-gray-400 focus:border-teal-500 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-teal-400 dark:focus:ring-teal-400"
              />
            </div>
          </div>

          {error && (
            <div className="mt-2 flex items-center gap-2 rounded-md bg-red-50 p-2 text-sm text-red-600 dark:bg-red-900/40 dark:text-red-400">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

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
              onClick={handleSaveAlbum}
              disabled={loading || !title.trim()}
              className="cursor-pointer rounded-lg bg-teal-500 text-white hover:bg-teal-600 disabled:opacity-50"
            >
              {loading ? "Saving..." : album ? "Update Album" : "Create Album"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
