import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  useNestlingActions,
  useNestlingStore,
} from "@/stores/useNestlingStore";
import BaseModal from "./BaseModal";
import { TextField } from "./TextField";

export default function FolderModal({
  children,
  nestId,
  parentId,
  isOpen,
  setIsOpen,
}: {
  children: React.ReactNode;
  nestId: number;
  parentId?: number;
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
}) {
  const activeFolderId = useNestlingStore((state) => state.activeFolderId);
  const { addFolder } = useNestlingActions();

  const [title, setTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [isInternalModalOpen, setIsInternalModalOpen] = useState(false);
  const isModalOpen = isOpen ?? isInternalModalOpen;
  const setModalOpen = setIsOpen ?? setIsInternalModalOpen;

  const effectiveParentId = parentId ?? activeFolderId;

  const handleCloseModal = async () => {
    setTitle("");
    setModalOpen(false);
  };

  const handleSaveFolder = async () => {
    if (!title.trim()) return;
    setIsSaving(true);
    try {
      await addFolder({
        nestId,
        parentId: effectiveParentId!,
        name: title,
      });
      toast.success(`Folder "${title}" created successfully!`);

      handleCloseModal();
    } catch (error) {
      toast.error("Failed to create folder");
      console.error("Failed to create Folder:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <BaseModal
      isOpen={isModalOpen}
      setIsOpen={setModalOpen}
      onSubmit={handleSaveFolder}
      title="Create a New Folder"
      description="Create a new folder to organize your notes."
      body={
        <TextField
          label="Folder Title"
          text={title}
          setText={setTitle}
          placeholder="e.g. Personal, Work, School"
        />
      }
      footer={
        <Button
          onClick={handleSaveFolder}
          disabled={isSaving || !title.trim()}
          className="cursor-pointer rounded-lg bg-teal-500 text-white hover:bg-teal-600 disabled:opacity-50"
        >
          {isSaving ? "Creating..." : "Create"}
        </Button>
      }
    >
      {children}
    </BaseModal>
  );
}
