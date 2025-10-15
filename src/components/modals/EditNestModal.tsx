import { Nest } from "@/lib/types/nest";
import { useState } from "react";
import { Button } from "../ui/button";
import { Pencil, Trash } from "lucide-react";
import { toast } from "sonner";
import { useNestStore } from "@/stores/useNestStore";
import BaseModal from "./BaseModal";
import { TextField } from "./TextField";
import { clearLastNestling } from "@/lib/storage/session";

export default function EditNestModal({ nest }: { nest: Nest | null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState(nest?.title ?? "");

  const { updateNest, deleteNest } = useNestStore();

  const handleEdit = async () => {
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
  const handleDelete = async () => {
    if (!nest) return;
    try {
      await deleteNest(nest.id);
      await clearLastNestling(nest.id);
      handleExit();
      toast.success("Nest deleted");
    } catch (error) {
      toast.error("Failed to delete nest");
      console.error("Failed to delete nest:", error);
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
            <Button
              onClick={handleDelete}
              className="mr-auto cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
            >
              <Trash size={14} />
              Delete
            </Button>
            <div className="flex gap-2">
              <Button
                onClick={handleEdit}
                disabled={!title}
                className="cursor-pointer rounded-lg bg-teal-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-700 disabled:opacity-50"
              >
                Save
              </Button>
            </div>
          </>
        }
      >
        <div className="flex size-4 cursor-pointer items-center rounded-lg dark:text-white">
          <Pencil className="size-4" />
        </div>
      </BaseModal>
    </div>
  );
}
