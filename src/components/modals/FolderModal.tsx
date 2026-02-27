import { useState } from "react";
import { toast } from "@/lib/utils/toast";
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
        <button
          onClick={handleSaveFolder}
          disabled={isSaving || !title.trim()}
          className="rounded-lg bg-teal-500 px-4 py-1.5 text-sm text-white shadow transition-colors hover:bg-teal-600 disabled:opacity-50 disabled:hover:bg-teal-500 disabled:dark:bg-teal-500"
        >
          {isSaving ? "Creating..." : "Create"}
        </button>
      }
    >
      <div />
    </BaseModal>
  );
}
