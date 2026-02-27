import { Nest } from "@/lib/types/nest";
import { useState } from "react";
import { Trash } from "lucide-react";
import { toast } from "@/lib/utils/toast";
import { useNestActions } from "@/stores/useNestStore";
import BaseModal from "./BaseModal";
import { TextField } from "./TextField";
import { clearLastNestling } from "@/lib/storage/nestling";

export default function EditNestModal({
  nest,
  children,
}: {
  nest: Nest | null;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState(nest?.title ?? "");

  const { updateNest, deleteNest } = useNestActions();

  const handleEditNest = async () => {
    if (!nest) return;
    try {
      await updateNest(nest.id, title);
      handleExit();
      toast.success("Nest updated");
    } catch (error) {
      toast.error("Failed to update nest");
      console.error("Failed to update nest:", error);
    }
  };

  const handleDeleteNest = async () => {
    if (!nest) return;
    try {
      await deleteNest(nest.id);
      await clearLastNestling(nest.id);
      toast.success("Nest deleted");
    } catch (error) {
      toast.error("Failed to delete nest");
      console.error("Failed to delete nest:", error);
    } finally {
      handleExit();
    }
  };

  const handleExit = () => {
    setTitle("");
    setIsOpen(false);
  };

  return (
    <div>
      <BaseModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onSubmit={handleEditNest}
        title="Edit Nest"
        description="Don't like the title? You can change it! or delete it."
        body={
          <TextField
            label="New Nest Title"
            text={title}
            setText={setTitle}
            placeholder="e.g. Personal, Work, School"
          />
        }
        footer={
          <>
            <button
              onClick={handleDeleteNest}
              className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-1.5 text-sm text-white shadow transition-colors hover:bg-red-600"
            >
              <Trash size={14} />
              Delete
            </button>
            <div className="flex gap-2">
              <button
                onClick={handleEditNest}
                disabled={!title}
                className="rounded-lg bg-teal-500 px-4 py-1.5 text-sm text-white shadow transition-colors hover:bg-teal-600 disabled:opacity-50 disabled:hover:bg-teal-500 disabled:dark:bg-teal-500"
              >
                Save
              </button>
            </div>
          </>
        }
      >
        {children}
      </BaseModal>
    </div>
  );
}
