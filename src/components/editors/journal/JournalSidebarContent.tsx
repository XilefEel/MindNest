import { JournalEntry } from "@/lib/types/journal";
import { cn } from "@/lib/utils/general";
import { useJournalStore } from "@/stores/useJournalStore";
import { useNestStore } from "@/stores/useNestStore";
import { Clock, Search, Trash } from "lucide-react";
import { useMemo, useState } from "react";

export default function JournalSidebarContent({
  setIsEntryOpen,
  setIsDrawerOpen,
}: {
  setIsEntryOpen: (isOpen: boolean) => void;
  setIsDrawerOpen: (isOpen: boolean) => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSwitching, setIsSwitching] = useState(false);

  const { activeBackgroundId } = useNestStore();
  const { entries, setActiveEntry, deleteEntry } = useJournalStore();

  const filteredEntries = useMemo(() => {
    if (!searchQuery.trim()) return entries;

    const query = searchQuery.toLowerCase();
    return entries.filter(
      (entry) =>
        entry.title.toLowerCase().includes(query) ||
        entry.content.toLowerCase().includes(query),
    );
  }, [entries, searchQuery]);

  const handleSelectEntry = async (entry: JournalEntry) => {
    if (isSwitching || !entry) return;
    setIsSwitching(true);
    setActiveEntry(entry);
    setIsEntryOpen(true);
    setIsDrawerOpen(false);

    console.log("Selected entry:", entry);
    setTimeout(() => setIsSwitching(false), 200);
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
    <div className="flex h-full flex-col">
      <div
        className={cn(
          "flex-shrink-0 border-b border-slate-200 p-4 dark:border-slate-700",
          activeBackgroundId && "border-black/50 dark:border-white/50",
        )}
      >
        <div
          className={cn(
            "flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-2 text-sm focus-within:border-teal-300 focus-within:ring-1 focus-within:ring-teal-200 dark:border-slate-600 dark:bg-slate-800 dark:focus-within:border-teal-400 dark:focus-within:ring-teal-400",
            activeBackgroundId &&
              "border-0 bg-white/30 backdrop-blur-sm dark:bg-black/10",
          )}
        >
          <Search className="h-4 w-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search entries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-slate-900 placeholder:text-slate-500 focus:outline-none dark:text-slate-100 dark:placeholder:text-slate-400"
          />
        </div>

        {searchQuery && (
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            {filteredEntries.length} of {entries.length} entries
          </div>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {filteredEntries.length > 0 ? (
            filteredEntries.map((entry) => (
              <div
                key={entry.id}
                onClick={() => handleSelectEntry(entry)}
                className={cn(
                  "cursor-pointer rounded-xl border border-slate-200 bg-white p-3 transition-all duration-200 hover:border-teal-300 hover:text-teal-600 hover:shadow-md dark:border-slate-600 dark:bg-slate-800 dark:hover:border-teal-400 dark:hover:text-teal-400",
                  activeBackgroundId &&
                    "border-none bg-white/30 backdrop-blur-sm dark:bg-black/20",
                )}
              >
                <div className="mb-2 flex items-start justify-between gap-2">
                  <h3 className="line-clamp-2 flex-1 text-sm font-medium text-slate-900 transition-colors dark:text-slate-100">
                    {entry.title}
                  </h3>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDeleteEntry(entry.id);
                    }}
                    className="flex-shrink-0 rounded-lg p-1.5 text-slate-600 transition-colors hover:bg-red-100 hover:text-red-500 dark:text-slate-400 dark:hover:bg-red-900 dark:hover:text-red-300"
                  >
                    <Trash className="size-4" />
                  </button>
                </div>

                <p className="mb-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <Clock className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">
                    {new Date(entry.entry_date).toLocaleDateString()}
                  </span>
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    {
                      entry.content.split(/\s+/).filter((w) => w.length > 0)
                        .length
                    }{" "}
                    words
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center">
              <div className="text-sm text-slate-400 dark:text-slate-500">
                {searchQuery ? "No entries found" : "No entries yet"}
              </div>
            </div>
          )}
        </div>
      </div>

      <div
        className={cn(
          "flex-shrink-0 border-t border-slate-200 py-4 dark:border-slate-700",
          activeBackgroundId && "border-black/50 dark:border-white/50",
        )}
      >
        <div className="text-center">
          <div className="mb-1 text-2xl font-bold text-teal-500 dark:text-teal-400">
            {searchQuery ? filteredEntries.length : entries.length}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {searchQuery ? "Matching" : "Total"} Entries
          </div>
        </div>
      </div>
    </div>
  );
}
