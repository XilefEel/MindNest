import { Trash } from "lucide-react";
import { toast } from "@/lib/utils/toast";
import { useNestlingActions } from "@/stores/useNestlingStore";
import BaseModal from "./BaseModal";
import { useActiveNestId } from "@/stores/useNestStore";
import { clearLastNestling, getLastNestling } from "@/lib/storage/nestling";
import { useDeleteModal } from "@/stores/useModalStore";

export default function DeleteModal() {
  const activeNestId = useActiveNestId();
  const { setActiveNestlingId, deleteNestling, deleteFolder } =
    useNestlingActions();
  const { isDeleteOpen, deleteType, deleteId, clearDeleteTarget } =
    useDeleteModal();

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
        <button
          onClick={handleDelete}
          className="flex items-center gap-2 rounded-lg bg-red-500 px-3 py-1.5 text-sm text-white shadow transition-colors hover:bg-red-600"
        >
          <Trash size={14} />
          Delete
        </button>
      }
    >
      <div />
    </BaseModal>
  );
}
