import { useEffect, useRef, useState } from "react";

type AutoSaveStatus = "idle" | "saving" | "saved" | "error";

export default function useAutoSave(
  id: number,
  data: Record<string, any>,
  updateFunction: (id: number, data: Record<string, any>) => Promise<void>,
  options?: { debounceTime?: number },
) {
  const { debounceTime = 500 } = options || {};

  const [autoSaveStatus, setAutoSaveStatus] = useState<AutoSaveStatus>("idle");
  const timeoutRef = useRef<NodeJS.Timeout>();
  const previousDataRef = useRef<string>(JSON.stringify(data));

  useEffect(() => {
    if (!id || id < 0) return;
    const currentDataStr = JSON.stringify(data);
    if (currentDataStr === previousDataRef.current) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setAutoSaveStatus("saving");

    timeoutRef.current = setTimeout(async () => {
      try {
        await updateFunction(id, data);
        previousDataRef.current = currentDataStr;
        setAutoSaveStatus("saved");
        setTimeout(() => setAutoSaveStatus("idle"), 1000);
      } catch (error) {
        console.error("Auto-save failed:", error);
        setAutoSaveStatus("error");
      }
    }, debounceTime);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [id, data, updateFunction, debounceTime]);

  return autoSaveStatus;
}
