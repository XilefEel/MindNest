import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNestStore } from "@/stores/useNestStore";
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
      body={<TextField label="Title" text={title} setText={setTitle} />}
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
      {children}
    </BaseModal>
  );
}
