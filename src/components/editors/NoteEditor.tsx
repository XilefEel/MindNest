import { Nestling } from "@/lib/types";
import { useEffect, useRef, useState } from "react";
import { editNote } from "@/lib/nestlings";
import TextareaAutosize from "react-textarea-autosize";
import ReactMarkdown from "react-markdown";
import { BookOpen, Pencil } from "lucide-react";
import ToolBar from "./ToolBar";
import { useNestlingTree } from "@/hooks/useNestlingTree";
import { useNestlingTreeStore } from "@/stores/useNestlingStore";
import BottomBar from "./BottomBar";
import { saveLastNestling } from "@/lib/session";

export default function NoteEditor({ nestling }: { nestling: Nestling }) {
  const [title, setTitle] = useState(nestling.title);
  const [content, setContent] = useState(nestling.content ?? "");
  const [previewMode, setPreviewMode] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");

  const saveTimeout = useRef<NodeJS.Timeout | null>(null);

  const { refreshData } = useNestlingTree(nestling.nest_id);
  const updateNestling = useNestlingTreeStore((s) => s.updateNestling);

  useEffect(() => {
    if (nestling) {
      setTitle(nestling.title);
      setContent(nestling.content);
    }
  }, [nestling]);

  useEffect(() => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);

    setAutoSaveStatus("saving");

    saveTimeout.current = setTimeout(() => {
      const updated = {
        title,
        content,
        updated_at: new Date().toISOString(),
      };

      updateNestling(nestling.id, updated);

      editNote(nestling.id, title, content)
        .then(() => {
          setAutoSaveStatus("saved");
          setTimeout(() => setAutoSaveStatus("idle"), 1000);
          refreshData();
          saveLastNestling({
            ...nestling,
            ...updated,
          });
        })
        .catch((err) => {
          console.error("Failed to save note", err);
          setAutoSaveStatus("error");
        });
    }, 500);

    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
    };
  }, [title, content]);

  return (
    <div className="flex h-full w-full flex-col space-y-2 overflow-hidden px-4">
      <div className="flex justify-between rounded-lg bg-white px-3 dark:bg-gray-800">
        <ToolBar />
        <button
          onClick={() => setPreviewMode(!previewMode)}
          className="cursor-pointer transition-all duration-200 hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-300"
        >
          {previewMode ? (
            <Pencil className="size-4" />
          ) : (
            <BookOpen className="size-4" />
          )}
        </button>
      </div>

      <TextareaAutosize
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full resize-none bg-transparent text-3xl font-bold outline-none"
        placeholder="Note title..."
      />

      <div className="flex-1 overflow-y-auto">
        {previewMode ? (
          <div className="prose dark:prose-invert max-w-none">
            <ReactMarkdown>
              {content || "*Nothing to preview yet.*"}
            </ReactMarkdown>
          </div>
        ) : (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start typing..."
            className="h-full w-full resize-none bg-transparent text-base leading-relaxed outline-none"
          />
        )}
      </div>

      <div className="flex justify-between rounded-lg bg-white px-3 dark:bg-gray-800">
        <BottomBar autoSaveStatus={autoSaveStatus} content={content} />
      </div>
    </div>
  );
}
