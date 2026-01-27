import { Button } from "../ui/button";
import { Trash } from "lucide-react";
import { toast } from "sonner";
import { useNestlingActions } from "@/stores/useNestlingStore";
import BaseModal from "./BaseModal";
import { useActiveNestId } from "@/stores/useNestStore";
import { clearLastNestling, getLastNestling } from "@/lib/storage/nestling";
import { useModalStore } from "@/stores/useModalStore";

export default function DeleteModal() {
  const { isDeleteOpen, deleteType, deleteId, clearDeleteTarget } =
    useModalStore();

  const activeNestId = useActiveNestId();
  const { setActiveNestlingId, deleteNestling, deleteFolder } =
    useNestlingActions();

  const handleDelete = async () => {
    if (!deleteId || !deleteType) return;

    clearDeleteTarget();

    const lastNestlingId = await getLastNestling(activeNestId);

    try {
      if (deleteType === "nestling") {
        await deleteNestling(deleteId);
        if (lastNestlingId === deleteId) {
          await clearLastNestling(activeNestId!);
          setActiveNestlingId(null);
        }
        toast.success("Nestling deleted");
      } else if (deleteType === "folder") {
        await deleteFolder(deleteId);
        toast.success("Folder deleted");
      }
    } catch (error) {
      console.error("Failed to delete:", error);
      toast.error("Failed to delete");
    }
  };

  return (
    <BaseModal
      isOpen={isDeleteOpen}
      setIsOpen={(open) => !open && clearDeleteTarget()}
      title="Are you sure you want to delete?"
      description={`This action cannot be undone. This will permanently delete this ${deleteType} and all its contents.`}
      footer={
        <Button
          onClick={handleDelete}
          className="cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
        >
          <Trash size={14} />
          Delete
        </Button>
      }
    >
      <div />
    </BaseModal>
  );
}
