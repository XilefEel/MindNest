import { useState } from "react";
import { toast } from "@/lib/utils/toast";
import { useNestActions } from "@/stores/useNestStore";
import BaseModal from "./BaseModal";
import { TextField } from "./TextField";

export default function AddNestModal({
  userId,
  children,
}: {
  userId: number;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const { createNest } = useNestActions();

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
      onSubmit={handleCreateNest}
      title="Create a New Nest"
      description="Give your nest a title. You can always change it later."
      body={<TextField label="Title" text={title} setText={setTitle} />}
      footer={
        <button
          onClick={handleCreateNest}
          disabled={loading || !title.trim()}
          className="rounded-lg bg-teal-500 px-4 py-1.5 text-sm text-white shadow transition-colors hover:bg-teal-600 disabled:opacity-50 disabled:hover:bg-teal-500 disabled:dark:bg-teal-500"
        >
          {loading ? "Creating..." : "Create"}
        </button>
      }
    >
      {children}
    </BaseModal>
  );
}
