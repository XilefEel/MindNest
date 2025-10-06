import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useNestlingStore } from "@/stores/useNestlingStore";
import BaseModal from "./BaseModal";
import { TextField } from "./TextField";
import { inputBase } from "@/lib/utils/styles";

export default function AddFolderModal({
  nestId,
  children,
  folderId,
}: {
  nestId: number;
  children: React.ReactNode;
  folderId?: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const { addFolder, updateFolder, folders } = useNestlingStore();

  const handleExit = async () => {
    setTitle("");
    setIsOpen(false);
  };

  const handleSave = async () => {
    if (!title.trim()) return;
    setLoading(true);
    try {
      if (folderId) {
        await updateFolder(folderId, title);
      } else {
        await addFolder({ nest_id: nestId, name: title });
      }
      handleExit();
    } catch (err) {
      console.error("Failed to create Folder:", err);
    } finally {
      setLoading(false);
      toast.success(folderId ? "Folder Renamed" : "Folder created");
    }
  };

  useEffect(() => {
    if (folderId) {
      const folder = folders.find((f) => f.id === folderId);
      if (folder) {
        setTitle(folder.name || "");
      }
    }
  }, [folderId]);

  return (
    <BaseModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title={folderId ? "Rename Folder" : "Create a New Folder"}
      description={
        folderId
          ? "Change the title of this folder."
          : "Create a new folder to organize your notes."
      }
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
          onClick={handleSave}
          disabled={loading || !title.trim()}
          className="cursor-pointer rounded-lg bg-teal-500 text-white hover:bg-teal-600 disabled:opacity-50"
        >
          {loading ? "Saving..." : folderId ? "Rename Folder" : "Create Folder"}
        </Button>
      }
    >
      {children}
    </BaseModal>
  );
}
