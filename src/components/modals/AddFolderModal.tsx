import { useState } from "react";
import { createFolder } from "@/lib/api/folders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useNestlingTreeStore } from "@/stores/useNestlingStore";
import BaseModal from "./BaseModal";
import { TextField } from "./TextField";
import { inputBase } from "@/lib/utils/styles";
import { useNestStore } from "@/stores/useNestStore";

export default function AddFolderModal({
  nestId,
  children,
}: {
  nestId: number;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const { activeNestId } = useNestStore();
  const { fetchSidebar } = useNestlingTreeStore();

  const handleExit = async () => {
    await fetchSidebar(activeNestId!);
    setTitle("");
    setIsOpen(false);
  };

  const handleCreateFolder = async () => {
    if (!title.trim()) return;
    setLoading(true);
    try {
      await createFolder({ nest_id: nestId, name: title });
      handleExit();
    } catch (err) {
      console.error("Failed to create Folder:", err);
    } finally {
      setLoading(false);
      toast.success("Folder created");
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Create a New Folder"
      description="Create a new folder to organize your notes."
      body={
        <TextField label="Folder Title">
          <Input
            placeholder="e.g. Personal, Work, School"
            value={title}
            autoFocus
            onChange={(e) => setTitle(e.target.value)}
            className={inputBase}
          />
        </TextField>
      }
      footer={
        <Button
          onClick={handleCreateFolder}
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
