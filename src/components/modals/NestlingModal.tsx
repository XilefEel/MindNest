import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useNestlingStore } from "@/stores/useNestlingStore";
import BaseModal from "./BaseModal";
import { TextField } from "./TextField";

export default function NestlingModal({
  children,
  nestId,
  nestlingId,
  isOpen,
  setIsOpen,
}: {
  children: React.ReactNode;
  nestId?: number;
  nestlingId?: number;
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
}) {
  const [title, setTitle] = useState("");
  const [nestlingType, setNestlingType] = useState("note");
  const [loading, setLoading] = useState(false);

  const [internalOpen, setInternalOpen] = useState(false);
  const isActuallyOpen = isOpen ?? internalOpen;
  const setOpen = setIsOpen ?? setInternalOpen;

  const { addNestling, activeFolderId, updateNestling, nestlings } =
    useNestlingStore();
  const nestling = nestlings.find((n) => n.id === nestlingId);

  const handleExit = async () => {
    setTitle("");
    setOpen(false);
  };

  const handleCreateNestling = async () => {
    if (!title.trim()) {
      return;
    }
    setLoading(true);
    try {
      if (nestlingId) {
        await updateNestling(nestlingId, {
          title,
          folder_id: nestling?.folder_id,
        });
        toast.success(`Nestling Renamed to "${title}!"`);
      } else {
        await addNestling({
          nest_id: nestId!,
          folder_id: activeFolderId,
          title,
          content: "",
          nestling_type: nestlingType,
        });
        toast.success(`Nestling "${title}" created successfully!`);
      }
      handleExit();
    } catch (err) {
      console.error("Failed to create nestling:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (nestlingId) {
      setTitle(nestling?.title || "");
    }
  }, [nestlingId, nestling]);

  return (
    <BaseModal
      isOpen={isActuallyOpen}
      setIsOpen={setOpen}
      title={nestlingId ? "Rename Nestling" : "Create Nestling"}
      description={
        nestlingId
          ? "Don't like the title? You can change it here."
          : "Give your nestling a title. You can always change it later."
      }
      body={
        <>
          <TextField
            label={nestlingId ? "New Title" : "Nestling Title"}
            text={title}
            setText={setTitle}
            placeholder="e.g. My First Note, My Journal, My Board"
          />

          {!nestlingId && (
            <>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Select Nestling Type
              </label>
              <Select value={nestlingType} onValueChange={setNestlingType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800">
                  <SelectGroup>
                    <SelectLabel>Nestling Type</SelectLabel>
                    <SelectItem value="note">Note</SelectItem>
                    <SelectItem value="board">Board</SelectItem>
                    <SelectItem value="calendar">Calendar</SelectItem>
                    <SelectItem value="journal">Journal</SelectItem>
                    <SelectItem value="gallery">Gallery</SelectItem>
                    <SelectItem value="mindmap">Mindmap</SelectItem>
                    <SelectItem value="database">Database</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </>
          )}
        </>
      }
      footer={
        <Button
          onClick={handleCreateNestling}
          disabled={loading || !title.trim()}
          className="cursor-pointer rounded-lg bg-teal-500 text-white hover:bg-teal-600 disabled:opacity-50"
        >
          {nestlingId
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
