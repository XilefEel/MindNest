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
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useNestStore } from "@/stores/useNestStore";

export default function AddNestModal({ userId }: { userId: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { createNest } = useNestStore();

  const handleExit = () => {
    setTitle("");
    setIsOpen(false);
    setError(null);
  };

  const handleCreateNest = async () => {
    if (!title.trim()) return;
    setLoading(true);
    try {
      await createNest(userId, title);
      handleExit();
      toast.success(`Nest "${title}" created successfully!`);
    } catch (err) {
      toast.error("Failed to create Nest");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger className="flex cursor-pointer items-center rounded-lg bg-black p-2 px-3 text-sm font-semibold text-white transition hover:scale-105 dark:bg-white dark:text-black">
          <Plus className="mr-1 size-4" /> Create Nest
        </DialogTrigger>
        <DialogContent className="space-y-2 rounded-2xl border-0 bg-white p-6 shadow-xl transition-all ease-in-out dark:bg-gray-800">
          <DialogHeader className="justify-between">
            <DialogTitle className="text-xl font-bold text-black dark:text-white">
              Create a New Nest
            </DialogTitle>
            <DialogDescription>
              Give your nest a title. You can always change it later.
            </DialogDescription>
          </DialogHeader>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Nest Title
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Personal, Work, School"
              className="text-sm text-black focus:border-teal-500 focus:ring-teal-500 dark:text-gray-100"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

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
              onClick={handleCreateNest}
              disabled={loading}
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
