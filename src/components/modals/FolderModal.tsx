import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  useFolders,
  useNestlingActions,
  useNestlingStore,
} from "@/stores/useNestlingStore";
import BaseModal from "./BaseModal";
import { TextField } from "./TextField";

export default function AddFolderModal({
  children,
  nestId,
  folderId,
  isOpen,
  setIsOpen,
}: {
  children: React.ReactNode;
  nestId: number;
  folderId?: number;
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
}) {
  const folders = useFolders();
  const activeFolderId = useNestlingStore((state) => state.activeFolderId);
  const { addFolder, updateFolder } = useNestlingActions();

  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const [internalOpen, setInternalOpen] = useState(false);
  const isActuallyOpen = isOpen ?? internalOpen;
  const setOpen = setIsOpen ?? setInternalOpen;

  const folder = folderId ? folders.find((f) => f.id === folderId) : undefined;

  const handleExit = async () => {
    setTitle("");
    setOpen(false);
  };

  const handleSave = async () => {
    if (!title.trim()) return;
    setLoading(true);
    try {
      if (folderId && folder) {
        await updateFolder(folderId, folder.parentId, title);
        toast.success(`Folder Renamed to "${title}"`);
      } else {
        await addFolder({
          nestId,
          parentId: activeFolderId,
          name: title,
        });
        toast.success(`Folder "${title}" created successfully!`);
      }
      handleExit();
    } catch (err) {
      toast.error("Failed to create folder");
      console.error("Failed to create Folder:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (folderId && folder) {
      setTitle(folder.name || "");
    }
  }, [folderId, folder]);

  return (
    <BaseModal
      isOpen={isActuallyOpen}
      setIsOpen={setOpen}
      title={folderId ? "Rename Folder" : "Create a New Folder"}
      description={
        folderId
          ? "Change the title of this folder."
          : "Create a new folder to organize your notes."
      }
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
          onClick={handleSave}
          disabled={loading || !title.trim()}
          className="cursor-pointer rounded-lg bg-teal-500 text-white hover:bg-teal-600 disabled:opacity-50"
        >
          {folderId
            ? loading
              ? "Saving..."
              : "Save"
            : loading
              ? "Creating..."
              : "Create"}
        </Button>
      }
    >
      {children}
    </BaseModal>
  );
}
