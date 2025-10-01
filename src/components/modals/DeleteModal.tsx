import { Button } from "../ui/button";
import { Trash } from "lucide-react";
import { useState } from "react";
import { deleteNestling } from "@/lib/api/nestlings";
import { deleteFolder } from "@/lib/api/folders";
import { toast } from "sonner";
import { useNestlingTreeStore } from "@/stores/useNestlingStore";
import BaseModal from "./BaseModal";
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
    <BaseModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Are you sure you want to delete?"
      description={`This action cannot be undone. This will permanently delete this ${type} and all its contents.`}
      showCancel={false}
      footer={
        <div className="flex w-full items-center gap-2">
          <Button
            onClick={() => setIsOpen(false)}
            className="cursor-pointer rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            Cancel
          </Button>

          <Button
            onClick={() => handleDelete(type)}
            className="cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
          >
            <Trash size={14} />
            Delete
          </Button>
        </div>
      }
    >
      {children}
    </BaseModal>
  );
}
