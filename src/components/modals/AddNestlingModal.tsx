import { useState } from "react";
import { createNestling } from "@/lib/api/nestlings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useNestlingTreeStore } from "@/stores/useNestlingStore";
import BaseModal from "./BaseModal";
import { inputBase } from "@/lib/utils/styles";
import { TextField } from "./TextField";
import { useNestStore } from "@/stores/useNestStore";

export default function AddNestlingModal({
  nestId,
  children,
}: {
  nestId: number;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [nestlingType, setNestlingType] = useState("note");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const { fetchSidebar, activeFolderId } = useNestlingTreeStore();
  const { activeNestId } = useNestStore();

  const handleExit = async () => {
    await fetchSidebar(activeNestId!);
    setTitle("");
    setContent("");
    setIsOpen(false);
  };

  const handleCreateNestling = async () => {
    if (!title.trim()) {
      return;
    }
    setLoading(true);
    try {
      await createNestling({
        nest_id: nestId,
        folder_id: activeFolderId,
        nestling_type: nestlingType,
        title,
        content,
      });
      handleExit();
    } catch (err) {
      console.error("Failed to create nestling:", err);
    } finally {
      setLoading(false);
    }
    toast.success("Nestling created");
  };

  return (
    <div>
      <BaseModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Create a New Nestling"
        description="Give your nestling a title. You can always change it later."
        body={
          <>
            <TextField label="Title">
              <Input
                value={title}
                autoFocus
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. My First Note, My Journal, My Board"
                className={inputBase}
              />
            </TextField>
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
        }
        footer={
          <Button
            onClick={handleCreateNestling}
            disabled={loading || !title.trim()}
            className="cursor-pointer rounded-lg bg-teal-500 text-white hover:bg-teal-600 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create"}
          </Button>
        }
      >
        {children}
      </BaseModal>
    </div>
  );
}
