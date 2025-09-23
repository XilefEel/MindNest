import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";
import { useState } from "react";
import { deleteFolder, deleteNestling } from "@/lib/nestlings";
import { toast } from "sonner";
import { useNestlingTreeStore } from "@/stores/useNestlingStore";
export default function DeleteModal({
  type,
  nestlingId,
  folderId,
  children,
}: {
  type: "nestling" | "folder";
  nestlingId?: number;
  folderId?: number;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const refreshData = useNestlingTreeStore((s) => s.refreshData);
  const setActiveNestling = useNestlingTreeStore((s) => s.setActiveNestling);
  const [error, setError] = useState<string | null>(null);

  const handleExit = async () => {
    await refreshData();
    setIsOpen(false);
    setError(null);
    console.error(error);
    setActiveNestling(null);
  };

  const handleDelete = async (type: "nestling" | "folder") => {
    if (!nestlingId && !folderId) return;
    try {
      if (type === "nestling") {
        await deleteNestling(nestlingId!);
        toast.error("Nestling deleted");
      } else if (type === "folder") {
        await deleteFolder(folderId!);
        toast.error("Folder deleted");
      }
      handleExit();
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        className="space-y-2 rounded-2xl bg-white p-6 shadow-xl transition-all ease-in-out dark:bg-gray-800"
      >
        <DialogHeader>
          <DialogTitle>Are you sure you want to delete?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete this{" "}
            {type} and all its contents.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setIsOpen(false)}
              className="mr-auto cursor-pointer rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
              Cancel
            </Button>

            <Button
              onClick={() => handleDelete(type)}
              className="mr-auto cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
            >
              <Trash size={14} />
              Delete
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
