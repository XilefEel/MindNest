import React, { useEffect, useMemo, useState } from "react";
import { Calendar, Plus } from "lucide-react";
import NestlingTitle from "../NestlingTitle";
import { useNestlingTreeStore } from "@/stores/useNestlingStore";
import { useJournalStore } from "@/stores/useJournalStore";
import JournalSidebar from "./JournalSidebar";
import useAutoSave from "@/hooks/useAutoSave";
import { editNote } from "@/lib/nestlings";
import AddJournalEntryModal from "@/components/modals/AddJournalEntryModal";

export default function JournalingApp() {
  const { activeEntry, entries, setActiveEntry, fetchEntries, updateEntry } =
    useJournalStore();

  const { activeNestling } = useNestlingTreeStore();
  if (!activeNestling) return null;
  const [title, setTitle] = useState(activeNestling.title);

  const [currentTitle, setCurrentTitle] = useState("");
  const [currentContent, setCurrentContent] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [isEntryOpen, setIsEntryOpen] = useState(false);

  useAutoSave({
    nestling: activeNestling,
    currentData: useMemo(() => ({ title }), [title]),
    saveFunction: (id, data) => editNote(id, data.title, ""),
  });

  useAutoSave({
    nestling: activeEntry as any,
    currentData: useMemo(() => {
      const data = {
        title: currentTitle,
        content: currentContent,
      };
      return data;
    }, [currentTitle, currentContent]),
    context: activeEntry,
    saveFunction: async (id, data, entry) => {
      if (entry) {
        await updateEntry({
          ...entry,
          title: data.title,
          content: data.content,
        });
        console.log("Entry updated!");
      } else {
        console.log("No entry passed");
      }
    },
  });

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setCurrentContent(newContent);

    const words = newContent
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);
    setWordCount(words.length);
  };

  useEffect(() => {
    fetchEntries(activeNestling.id);
    console.log("Fetching entries for nestling:", activeNestling.id);
  }, [fetchEntries, activeNestling.id]);

  // Add this useEffect
  useEffect(() => {
    if (activeEntry) {
      setCurrentTitle(activeEntry.title);
      setCurrentContent(activeEntry.content);
    } else {
      setCurrentTitle("");
      setCurrentContent("");
    }
  }, [activeEntry]);

  return (
    <div className="flex h-full gap-5">
      {/* Main Writing Area */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="rounded-lg px-6 py-3">
          <div className="items-center justify-between sm:flex">
            <div className="flex items-center md:w-1/2">
              <NestlingTitle title={title} setTitle={setTitle} />
            </div>
            <div className="flex items-center justify-between gap-3">
              <div className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">
                {wordCount} words
              </div>
              <AddJournalEntryModal setActiveEntry={setActiveEntry}>
                <button className="flex items-center gap-1 rounded-lg bg-teal-600 px-3 py-2 text-sm text-white transition-colors hover:bg-teal-700">
                  <Plus className="size-4" />
                  New Entry
                </button>
              </AddJournalEntryModal>
            </div>
          </div>
        </header>

        {isEntryOpen && activeEntry ? (
          <div className="flex-1 py-2">
            <div className="flex h-full flex-col rounded-xl bg-white">
              {/* Entry Header */}
              <div className="border-b border-slate-100 p-5">
                <div className="mb-3 flex items-center justify-between gap-4 text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <Calendar className="size-4" />
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
                <input
                  type="text"
                  value={currentTitle}
                  onChange={(e) => setCurrentTitle(e.target.value)}
                  placeholder="Give your entry a title..."
                  className="w-full border-none bg-transparent text-2xl font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none"
                />
              </div>

              {/* Text Area */}
              <div className="flex-1 p-5">
                <textarea
                  value={currentContent}
                  onChange={handleContentChange}
                  placeholder="What's on your mind today? Start writing your thoughts, experiences, or reflections..."
                  className="h-full w-full resize-none border-none bg-transparent text-base leading-relaxed text-slate-700 placeholder:text-slate-400 focus:outline-none"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center text-slate-400">
            {entries.length === 0
              ? "No entries yet"
              : "Select an entry or create a new one"}
          </div>
        )}
      </div>

      {/* Sidebar */}
      <JournalSidebar setIsEntryOpen={setIsEntryOpen} />
    </div>
  );
}
