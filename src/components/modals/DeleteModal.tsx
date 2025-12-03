import { Button } from "../ui/button";
import { Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNestlingActions } from "@/stores/useNestlingStore";
import BaseModal from "./BaseModal";
import { useActiveNestId } from "@/stores/useNestStore";
import { clearLastNestling, getLastNestling } from "@/lib/storage/session";

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

  const activeNestId = useActiveNestId();
  const { setActiveNestlingId, deleteNestling, deleteFolder } =
    useNestlingActions();

  const handleExit = () => {
    setIsOpen(false);
  };

  const handleDelete = async (type: "nestling" | "folder") => {
    if (!nestlingId && !folderId) return;

    handleExit();
    // lets the modal exit first then delete
    await new Promise((resolve) => setTimeout(resolve, 200));

    const lastNestlingId = await getLastNestling(activeNestId);

    try {
      if (type === "nestling") {
        await deleteNestling(nestlingId!);
        if (lastNestlingId === nestlingId) {
          await clearLastNestling(activeNestId!);
          setActiveNestlingId(null);
        }
        toast.success("Nestling deleted");
      } else if (type === "folder") {
        await deleteFolder(folderId!);
        toast.success("Folder deleted");
      }
    } catch (error) {
      console.error("Failed to delete:", error);
      toast.error("Failed to delete");
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && isOpen) {
        e.preventDefault();
        handleDelete(type);
      }
    };

    if (isOpen) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, type]);

  return (
    <BaseModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Are you sure you want to delete?"
      description={`This action cannot be undone. This will permanently delete this ${type} and all its contents.`}
      footer={
        <Button
          onClick={() => handleDelete(type)}
          className="cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
        >
          <Trash size={14} />
          Delete
        </Button>
      }
    >
      {children}
    </BaseModal>
  );
}
