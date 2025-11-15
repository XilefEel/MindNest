import React, { useEffect, useMemo, useState } from "react";
import { Calendar } from "lucide-react";
import NestlingTitle from "../NestlingTitle";
import {
  useEntries,
  useJournalActions,
  useJournalStore,
} from "@/stores/useJournalStore";
import JournalSidebar from "./JournalSidebar";
import useAutoSave from "@/hooks/useAutoSave";
import { NewEntryButton } from "./NewEntryButton";
import { useActiveBackgroundId } from "@/stores/useNestStore";
import { cn } from "@/lib/utils/general";
import {
  useActiveNestling,
  useNestlingActions,
} from "@/stores/useNestlingStore";

export default function JournalingApp() {
  const activeNestling = useActiveNestling();
  if (!activeNestling) return;

  const activeBackgroundId = useActiveBackgroundId();

  const activeEntry = useJournalStore((state) => state.activeEntry);
  const entries = useEntries();
  const { getEntries, updateEntry } = useJournalActions();

  const [title, setTitle] = useState(activeNestling.title);
  const [currentTitle, setCurrentTitle] = useState("");
  const [currentContent, setCurrentContent] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [isEntryOpen, setIsEntryOpen] = useState(false);

  const { updateNestling } = useNestlingActions();
  const nestlingData = useMemo(() => ({ title }), [title]);
  useAutoSave(activeNestling.id!, nestlingData, updateNestling);

  const entryData = useMemo(
    () => ({ title: currentTitle, content: currentContent }),
    [currentTitle, currentContent],
  );
  useAutoSave(activeEntry?.id!, entryData, updateEntry);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setCurrentContent(newContent);
  };

  const calculateWordCount = (content: string) => {
    const words = content.trim().split(/\s+/).filter(Boolean);
    setWordCount(words.length);
  };

  useEffect(() => {
    getEntries(activeNestling.id);
  }, [getEntries, activeNestling.id]);

  useEffect(() => {
    if (activeEntry) {
      setCurrentTitle(activeEntry.title);
      setCurrentContent(activeEntry.content);
      calculateWordCount(activeEntry.content);
    } else {
      setCurrentTitle("");
      setCurrentContent("");
      setWordCount(0);
    }
  }, [activeEntry]);

  useEffect(() => {
    setWordCount(0);
  }, [activeNestling?.id]);

  return (
    <div className="flex h-full gap-5">
      <div className="flex flex-1 flex-col">
        <header className="rounded-lg px-6 py-3">
          <div className="items-center justify-between gap-y-4 sm:flex">
            <div className="min-w-0 flex-1">
              <NestlingTitle
                title={title}
                setTitle={setTitle}
                nestling={activeNestling}
              />
            </div>
            <div className="flex items-center justify-between gap-3">
              <div className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">
                {wordCount} words
              </div>
              <NewEntryButton setIsEntryOpen={setIsEntryOpen} />
            </div>
          </div>
        </header>

        {isEntryOpen && activeEntry ? (
          <div className="flex-1 py-2">
            <div
              className={cn(
                "flex h-full flex-col rounded-xl bg-white dark:bg-gray-800",
                activeBackgroundId &&
                  "bg-white/30 backdrop-blur-sm dark:bg-black/10",
              )}
            >
              <div
                className={cn(
                  "border-b border-slate-100 p-5 dark:border-slate-700",
                  activeBackgroundId &&
                    "border-black/50 p-5 dark:border-white/50",
                )}
              >
                <div className="mb-3 flex items-center justify-between gap-4 text-sm text-slate-500 dark:text-gray-200">
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
                  className="w-full border-none bg-transparent text-2xl font-semibold placeholder:text-slate-400 focus:outline-none"
                />
              </div>

              <div className="flex-1 p-5">
                <textarea
                  value={currentContent}
                  onChange={handleContentChange}
                  placeholder="What's on your mind today? Start writing your thoughts, experiences, or reflections..."
                  className="h-full w-full resize-none border-none bg-transparent text-base leading-relaxed placeholder:text-slate-400 focus:outline-none"
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

      <JournalSidebar setIsEntryOpen={setIsEntryOpen} />
    </div>
  );
}
