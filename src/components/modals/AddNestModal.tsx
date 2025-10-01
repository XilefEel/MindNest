import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useNestStore } from "@/stores/useNestStore";
import BaseModal from "./BaseModal";
import { inputBase } from "@/lib/utils/styles";
import { TextField } from "./TextField";

export default function AddNestModal({ userId }: { userId: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const { createNest } = useNestStore();

  const handleExit = () => {
    setTitle("");
    setIsOpen(false);
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
    <BaseModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Create a New Nest"
      description="Give your nest a title. You can always change it later."
      body={
        <TextField label="Title">
          <Input
            value={title}
            autoFocus
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Personal, Work, School"
            className={inputBase}
          />
        </TextField>
      }
      footer={
        <Button
          onClick={handleCreateNest}
          disabled={loading || !title.trim()}
          className="cursor-pointer rounded-lg bg-teal-500 text-white hover:bg-teal-600 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create"}
        </Button>
      }
    >
      <div className="flex cursor-pointer items-center rounded-lg bg-black p-2 px-3 text-sm font-semibold text-white transition hover:scale-105 dark:bg-white dark:text-black">
        <Plus className="mr-1 size-4" /> Create Nest
      </div>
    </BaseModal>
  );
}
