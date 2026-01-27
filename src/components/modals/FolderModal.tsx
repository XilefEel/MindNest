import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  useNestlingActions,
  useNestlingStore,
} from "@/stores/useNestlingStore";
import BaseModal from "./BaseModal";
import { TextField } from "./TextField";
import { useFolderModal } from "@/stores/useModalStore";

export default function FolderModal() {
  const activeFolderId = useNestlingStore((state) => state.activeFolderId);
  const { addFolder } = useNestlingActions();

  const [title, setTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const { isFolderOpen, folderNestId, folderParentId, closeFolderModal } =
    useFolderModal();

  const effectiveParentId = folderParentId ?? activeFolderId;

  const handleCloseModal = async () => {
    setTitle("");
    closeFolderModal();
  };

  const handleSaveFolder = async () => {
    if (!title.trim()) return;
    setIsSaving(true);
    try {
      await addFolder({
        nestId: folderNestId!,
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
      isOpen={isFolderOpen}
      setIsOpen={handleCloseModal}
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
      <div />
    </BaseModal>
  );
}
