import { JournalEntry } from "@/lib/types";
import { useJournalStore } from "@/stores/useJournalStore";
import { Clock, Trash } from "lucide-react";

export default function JournalSidebar({
  setIsEntryOpen,
}: {
  setIsEntryOpen: (isOpen: boolean) => void;
}) {
  const { entries, setActiveEntry, deleteEntry } = useJournalStore();

  const handleSelectEntry = (entry: JournalEntry) => {
    setActiveEntry(entry);
    setIsEntryOpen(true);
    console.log("Selected entry:", entry);
  };

  const handleDeleteEntry = async (id: number) => {
    try {
      await deleteEntry(id);
      console.log("Entry deleted!");
    } catch (error) {
      console.error("Failed to delete entry:", error);
    }
  };
  return (
    <div className="flex w-64 flex-col rounded-lg bg-white">
      {/* Sidebar Header */}
      <div className="flex flex-col gap-2 border-b border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Your Entries</h2>
        </div>

        {/* Search */}
        <div className="flex rounded-lg border border-slate-200 p-2 text-sm">
          <input
            type="text"
            placeholder="Search entries..."
            className="focus:outline-none"
          />
        </div>
      </div>

      {/* Entries List */}
      <div className="overflow-y-auto p-4">
        <div className="space-y-3">
          {entries.map((entry) => (
            <div
              key={entry.id}
              onClick={() => handleSelectEntry(entry)}
              className="cursor-pointer rounded-xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-teal-300 hover:text-teal-600 hover:shadow-md"
            >
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-medium transition-colors">{entry.title}</h3>
                <div
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDeleteEntry(entry.id);
                  }}
                  className="rounded-lg p-2 transition-colors hover:bg-red-100 hover:text-red-500"
                >
                  <Trash className="size-4" />
                </div>
              </div>

              <p className="mb-3 flex items-center gap-2 text-xs text-slate-500">
                <Clock className="h-3 w-3" />
                {new Date(entry.entry_date).toLocaleDateString()}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  {
                    entry.content.split(/\s+/).filter((w) => w.length > 0)
                      .length
                  }{" "}
                  words
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className="border-t border-slate-200 py-4">
        <div className="text-center">
          <div className="mb-1 text-2xl font-bold text-teal-500">
            {entries.length}
          </div>
          <div className="text-xs text-slate-500">Total Entries</div>
        </div>
      </div>
    </div>
  );
}
