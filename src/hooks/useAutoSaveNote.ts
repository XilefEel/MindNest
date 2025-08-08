import { editNote } from "@/lib/nestlings";
import { saveLastNestling } from "@/lib/session";
import { Nestling } from "@/lib/types";
import { debounce } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

export default function useAutoSaveNote({
  nestling,
  title,
  content,
  updateNestling,
  refreshData,
}: {
  nestling: Nestling;
  title: string;
  content: string;
  updateNestling: (id: number, data: Partial<Nestling>) => void;
  refreshData: () => void;
}) {
  const [autoSaveStatus, setAutoSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const latestNestlingRef = useRef(nestling);
  const latestTitleRef = useRef(title);
  const latestContentRef = useRef(content);

  const debouncedSave = useRef(
    debounce(() => {
      const currentNestling = latestNestlingRef.current;
      const currentTitle = latestTitleRef.current;
      const currentContent = latestContentRef.current;

      const updated = {
        title: currentTitle,
        content: currentContent,
        updated_at: new Date().toISOString(),
      };

      updateNestling(currentNestling.id, updated);

      editNote(currentNestling.id, currentTitle, currentContent)
        .then(() => {
          setAutoSaveStatus("saved");
          setTimeout(() => setAutoSaveStatus("idle"), 1000);
          refreshData?.();
          saveLastNestling({ ...currentNestling, ...updated });
        })
        .catch((err) => {
          console.error("Failed to save note", err);
          setAutoSaveStatus("error");
        });
    }, 500),
  ).current;

  useEffect(() => {
    latestNestlingRef.current = nestling;
    latestTitleRef.current = title;
    latestContentRef.current = content;
  }, [nestling, title, content]);

  useEffect(() => {
    debouncedSave.cancel();
  }, [nestling?.id]);

  useEffect(() => {
    if (!nestling) return;
    if (title === nestling.title && content === nestling.content) return;
    setAutoSaveStatus("saving");
    debouncedSave();
  }, [title, content, nestling?.id]);

  return { autoSaveStatus, debouncedSave };
}
