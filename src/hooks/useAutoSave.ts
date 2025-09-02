import { saveLastNestling } from "@/lib/session";
import { Nestling } from "@/lib/types";
import { debounce } from "@/lib/utils";
import { useNestlingTreeStore } from "@/stores/useNestlingStore";
import { useEffect, useMemo, useRef, useState } from "react";

type AutoSaveStatus = "idle" | "saving" | "saved" | "error";

export default function useAutoSave<T = any>({
  nestling,
  currentData,
  saveFunction,
  context,
}: {
  nestling: Nestling;
  currentData: Record<string, any>;
  saveFunction: (
    id: number,
    data: Record<string, any>,
    context?: T,
  ) => Promise<void>;
  context?: T;
}) {
  const [autoSaveStatus, setAutoSaveStatus] = useState<AutoSaveStatus>("idle");
  const latestNestlingRef = useRef(nestling);
  const latestDataRef = useRef(currentData);
  const latestContextRef = useRef(context);

  const { refreshData, updateNestling } = useNestlingTreeStore();

  const debouncedSave = useRef(
    debounce(async () => {
      const currentNestling = latestNestlingRef.current;
      const currentFields = latestDataRef.current;
      const currentContext = latestContextRef.current;

      const updatedData = {
        ...currentFields,
        updated_at: new Date().toISOString(),
      };

      updateNestling(currentNestling.id, updatedData);

      try {
        await saveFunction(currentNestling.id, currentFields, currentContext);
        setAutoSaveStatus("saved");
        setTimeout(() => setAutoSaveStatus("idle"), 1000);
        refreshData?.();
        if (currentData.nestling_type) {
          saveLastNestling({ ...currentNestling, ...updatedData });
        }
      } catch (err) {
        console.error("Failed to save nestling", err);
        setAutoSaveStatus("error");
      }
    }, 400),
  ).current;

  // Update refs on every render
  useEffect(() => {
    latestNestlingRef.current = nestling;
    latestDataRef.current = currentData;
    latestContextRef.current = context;
  }, [nestling, currentData, context]);

  // Cancel debounced save on nestling id change
  useEffect(() => {
    debouncedSave.cancel();
  }, [nestling?.id]);

  // Memoize keys to avoid recalculating on every render
  const dataKeys = useMemo(() => Object.keys(currentData), [currentData]);

  // Track previous data to avoid unnecessary re-renders
  const prevDataRef = useRef<string>();

  useEffect(() => {
    if (!nestling) return;

    // Only proceed if data actually changed
    const currentDataStr = JSON.stringify(currentData);
    if (currentDataStr === prevDataRef.current) return;

    const hasChanges = dataKeys.some((key) => {
      return currentData[key] !== (nestling as any)[key];
    });

    if (!hasChanges) return;

    prevDataRef.current = currentDataStr;
    setAutoSaveStatus("saving");
    debouncedSave();
  }, [currentData, nestling?.id]);

  return { autoSaveStatus, debouncedSave };
}
