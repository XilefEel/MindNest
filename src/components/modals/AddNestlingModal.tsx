import { useState } from "react";
import { createNestling } from "@/lib/nestlings";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useNestlingTreeStore } from "@/stores/useNestlingStore";

export default function AddNestModal({ nestId }: { nestId: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [nestlingType, setNestlingType] = useState("note");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshData = useNestlingTreeStore((s) => s.refreshData);

  const handleExit = async () => {
    await refreshData();
    setTitle("");
    setContent("");
    setIsOpen(false);
    setError(null);
  };

  const handleCreateNestling = async () => {
    if (!title.trim()) return;
    setLoading(true);
    try {
      await createNestling({
        nest_id: nestId,
        folder_id: null,
        nestling_type: nestlingType,
        title,
        content,
      });
      handleExit();
    } catch (err) {
      console.error("Failed to create nestling:", err);
    } finally {
      setLoading(false);
    }
    toast.success("Nestling created");
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger className="flex cursor-pointer items-center rounded-lg bg-black p-2 px-3 text-sm font-semibold text-white transition hover:scale-105 dark:bg-white dark:text-black">
          <Plus className="mr-1 size-4" /> Create Nest
        </DialogTrigger>
        <DialogContent className="rounded-2xl border-0 bg-white p-6 shadow-xl transition-all ease-in-out dark:bg-gray-800">
          <DialogHeader className="justify-between">
            <DialogTitle className="text-xl font-bold text-black dark:text-white">
              Create a New Nestling
            </DialogTitle>
            <DialogDescription>
              Give your nestling a title. You can always change it later.
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
              className="text-sm text-black dark:text-gray-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Select Nestling Type
            </label>
            <Select value={nestlingType} onValueChange={setNestlingType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a type" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800">
                <SelectGroup>
                  <SelectLabel>Nestling Type</SelectLabel>
                  <SelectItem value="note">Note</SelectItem>
                  <SelectItem value="board">Board</SelectItem>
                  <SelectItem value="journal">Journal</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
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
              onClick={handleCreateNestling}
              disabled={loading}
              className="cursor-pointer rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
