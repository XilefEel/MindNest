import { useState } from "react";
import { createFolder } from "@/lib/nestlings";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useNestlingTreeStore } from "@/stores/useNestlingStore";
import { useJournalStore } from "@/stores/useJournalStore";
import { JournalEntry } from "@/lib/types";

export default function AddJournalEntryModal({
  setActiveEntry,
  children,
}: {
  setActiveEntry: (entry: JournalEntry) => void;
  children: React.ReactNode;
}) {
  const { activeNestling } = useNestlingTreeStore();
  if (!activeNestling) return null;

  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const refreshData = useNestlingTreeStore((s) => s.refreshData);

  const { addEntry } = useJournalStore();

  const handleExit = async () => {
    await refreshData();
    setTitle("");
    setIsOpen(false);
    setError(null);
  };

  const createNewEntry = async () => {
    const newEntry = await addEntry({
      nestling_id: activeNestling.id,
      title: title,
      content: "",
      entry_date: new Date().toISOString().split("T")[0],
    });
    setActiveEntry(newEntry);
    handleExit();
    console.log("New entry created!");
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger className="w-full">{children}</DialogTrigger>
        <DialogContent className="w-full rounded-2xl border border-gray-200 bg-white p-6 shadow-xl transition-all ease-in-out dark:border-gray-700 dark:bg-gray-800">
          <DialogHeader className="justify-between">
            <DialogTitle className="text-xl font-bold text-black dark:text-white">
              Create a New Journal Entry
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              Start writing your journal entry.
            </DialogDescription>
          </DialogHeader>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Entry Title
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. My First Journal Entry"
              className="border-gray-300 bg-white text-sm text-black placeholder-gray-400 focus:border-teal-500 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-teal-400 dark:focus:ring-teal-400"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
          )}

          <DialogFooter className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button
                variant="ghost"
                className="cursor-pointer rounded-lg bg-gray-200 text-black hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
              >
                Cancel
              </Button>
            </DialogClose>

            <Button
              onClick={createNewEntry}
              disabled={loading}
              className="cursor-pointer rounded-lg bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-50 dark:bg-teal-600 dark:hover:bg-teal-700"
            >
              {loading ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
