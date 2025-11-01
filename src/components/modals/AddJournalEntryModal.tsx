import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNestlingStore } from "@/stores/useNestlingStore";
import { useJournalStore } from "@/stores/useJournalStore";
import { JournalEntry } from "@/lib/types/journal";
import BaseModal from "./BaseModal";
import { TextField } from "./TextField";
import { toast } from "sonner";
import { useNestStore } from "@/stores/useNestStore";
import useActiveNestling from "@/hooks/useActiveNestling";

export default function AddJournalEntryModal({
  setActiveEntry,
  children,
}: {
  setActiveEntry: (entry: JournalEntry) => void;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");

  const { activeNestId } = useNestStore();
  const { activeNestling } = useActiveNestling();
  const { fetchSidebar } = useNestlingStore();
  const { addEntry, loading } = useJournalStore();

  const handleExit = async () => {
    await fetchSidebar(activeNestId!);
    setTitle("");
    setIsOpen(false);
  };

  const createNewEntry = async () => {
    try {
      const newEntry = await addEntry({
        nestlingId: activeNestling.id,
        title: title,
        content: "",
        entry_date: new Date().toISOString().split("T")[0],
      });
      setActiveEntry(newEntry);
      handleExit();
      toast.success(`Journal entry "${title}" created successfully!`);
    } catch (error) {
      toast.error("Failed to create a new journal entry.");
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Create a New Journal Entry"
      description="Start writing your journal entry."
      body={
        <TextField
          label="Entry Title"
          text={title}
          setText={setTitle}
          placeholder="e.g. My First Journal Entry"
        />
      }
      footer={
        <Button
          onClick={createNewEntry}
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
