import { useState } from "react";
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

export default function AddAlbumModal({
  nestling_id,
  children,
}: {
  nestling_id: number;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addAlbum } = useGalleryStore();

  const handleExit = async () => {
    setTitle("");
    setIsOpen(false);
    setError(null);
  };

  const handleAddAlbum = async () => {
    try {
      await addAlbum({
        nestling_id,
        name: title,
        description: "",
      });
    } catch (error) {
      console.error("Failed to add album:", error);
    } finally {
      handleExit();
      toast.success("Album created");
    }
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger className="w-full">{children}</DialogTrigger>
        <DialogContent className="w-full rounded-2xl border-0 bg-white p-6 shadow-xl transition-all ease-in-out dark:bg-gray-800">
          <DialogHeader className="justify-between">
            <DialogTitle className="text-xl font-bold text-black dark:text-white">
              Create a New Album
            </DialogTitle>
            <DialogDescription>
              Create a new album to organize your pictures.
            </DialogDescription>
          </DialogHeader>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Album Name
            </label>
            <Input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Family, Vacation, Work"
              className="text-sm text-black dark:text-gray-100"
            />
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
              onClick={handleAddAlbum}
              disabled={loading || !title.trim()}
              className="cursor-pointer rounded-lg bg-teal-500 text-white hover:bg-teal-600 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
