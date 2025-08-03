import { Nestling } from "@/lib/types";
import { useEffect, useRef, useState } from "react";
import { editNote } from "@/lib/nestlings";
import TextareaAutosize from "react-textarea-autosize";
import ReactMarkdown from "react-markdown";
import { BookOpen, Pencil } from "lucide-react";
import ToolBar from "./ToolBar";
import { useNestlingTree } from "@/hooks/useNestlingTree";
import { useNestlingTreeStore } from "@/stores/useNestlingStore";

export default function NoteEditor({
  nestling,
  onClose,
}: {
  nestling: Nestling;
  onClose: () => void;
}) {
  const [title, setTitle] = useState(nestling.title);
  const [content, setContent] = useState(nestling.content ?? "");
  const [previewMode, setPreviewMode] = useState(false);
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

    saveTimeout.current = setTimeout(() => {
      const updated = {
        title,
        content,
        updated_at: new Date().toISOString(),
      };

      updateNestling(nestling.id, updated);

      editNote(nestling.id, title, content)
        .then(() => refreshData())
        .catch((err) => console.error("Failed to save note", err));
    }, 500);

    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
    };
  }, [title, content]);

  return (
    <div className="mx-auto h-full w-full space-y-4 overflow-y-auto px-4">
      <div className="sticky top-0 z-10 flex justify-between bg-white px-3">
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

      <div className="flex justify-between">
        <TextareaAutosize
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full resize-none bg-transparent text-3xl font-bold outline-none"
          placeholder="Note title..."
        />
      </div>

      <div className="h-full">
        {previewMode ? (
          <div className="prose dark:prose-invert h-[calc(100vh-200px)] max-w-none overflow-y-auto">
            <ReactMarkdown>
              {content || "*Nothing to preview yet.*"}
            </ReactMarkdown>
          </div>
        ) : (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start typing..."
            className="h-[calc(100vh-200px)] w-full resize-none overflow-y-auto bg-transparent text-base leading-relaxed outline-none"
          />
        )}
      </div>
    </div>
  );
}
