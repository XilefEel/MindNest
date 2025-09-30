import { Nest } from "@/lib/types/nests";
import { useState } from "react";
import { Button } from "../ui/button";
import { Pencil, Trash } from "lucide-react";
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
import { Input } from "../ui/input";
import { toast } from "sonner";
import { useNestStore } from "@/stores/useNestStore";
import { cn } from "@/lib/utils/general";

export default function EditNestModal({ nest }: { nest: Nest | null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState(nest?.title ?? "");
  const [error, setError] = useState<string | null>(null);

  const { updateNest, deleteNest, activeBackgroundId } = useNestStore();

  const handleEdit = async () => {
    if (!nest) return setError("Nest not found");
    try {
      await updateNest(nest.id, title);
      handleExit();
      toast.success("Nest updated");
    } catch (error) {
      setError(String(error));
      console.error("Failed to update nest:", error);
    }
  };
  const handleDelete = async () => {
    if (!nest) return setError("Nest not found");
    try {
      await deleteNest(nest.id);
      handleExit();
      toast.success("Nest deleted");
    } catch (error) {
      setError(String(error));
      console.error("Failed to delete nest:", error);
    }
  };

  const handleExit = () => {
    setTitle("");
    setIsOpen(false);
    setError(null);
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger className="flex size-4 cursor-pointer items-center rounded-lg dark:text-white">
          <Pencil className="size-4" />
        </DialogTrigger>
        <DialogContent
          className={cn(
            "w-full rounded-2xl border-0 p-6 shadow-xl transition-all ease-in-out",
            activeBackgroundId
              ? "bg-white/30 backdrop-blur-sm dark:bg-black/30"
              : "bg-white dark:bg-gray-800",
          )}
        >
          <DialogHeader className="justify-between">
            <DialogTitle className="text-xl font-bold text-black dark:text-white">
              Edit Nest
            </DialogTitle>
            <DialogDescription>
              Don't like the title? You can change it! or delete it.
            </DialogDescription>
          </DialogHeader>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              New Nest Title
            </label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Personal, Work, School"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-black focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <DialogFooter className="flex justify-between gap-2">
            <Button
              onClick={handleDelete}
              className="mr-auto cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
            >
              <Trash size={14} />
              Delete
            </Button>
            <div className="flex gap-2">
              <DialogClose asChild>
                <Button
                  variant="ghost"
                  className="cursor-pointer rounded-lg bg-gray-200 text-black hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                >
                  Cancel
                </Button>
              </DialogClose>

              <Button
                onClick={handleEdit}
                className="cursor-pointer rounded-lg bg-teal-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-700 disabled:opacity-50"
              >
                Save
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
