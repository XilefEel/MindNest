import { saveLastNestling } from "@/lib/storage/session";
import { Nestling } from "@/lib/types/nestlings";
import { debounce } from "@/lib/utils/general";
import { useNestlingTreeStore } from "@/stores/useNestlingStore";
import { useEffect, useMemo, useRef, useState } from "react";

type AutoSaveStatus = "idle" | "saving" | "saved" | "error";

export default function useAutoSave<T = any>({
  target,
  currentData,
  saveFunction,
  context,
}: {
  target: { id: number } & Record<string, any>;
  currentData: Record<string, any>;
  saveFunction: (
    id: number,
    data: Record<string, any>,
    context?: T,
  ) => Promise<void>;
  context?: T;
}) {
  const [autoSaveStatus, setAutoSaveStatus] = useState<AutoSaveStatus>("idle");
  const latestTargetRef = useRef(target);
  const latestDataRef = useRef(currentData);
  const latestContextRef = useRef(context);

  const { refreshData, updateNestling } = useNestlingTreeStore();

  const debouncedSave = useRef(
    debounce(async () => {
      const currentTarget = latestTargetRef.current;
      const currentFields = latestDataRef.current;
      const currentContext = latestContextRef.current;

      const updatedData = {
        ...currentFields,
        updated_at: new Date().toISOString(),
      };

      try {
        await saveFunction(currentTarget.id, currentFields, currentContext);
        setAutoSaveStatus("saved");
        setTimeout(() => setAutoSaveStatus("idle"), 1000);
        refreshData?.();
        if ((currentTarget as Nestling).nestling_type) {
          saveLastNestling({ ...(currentTarget as Nestling), ...updatedData });
          updateNestling(currentTarget.id, updatedData);
        }
      } catch (err) {
        console.error("Failed to autosave: ", err);
        setAutoSaveStatus("error");
      }
    }, 400),
  ).current;

  // Update refs on every render
  useEffect(() => {
    latestTargetRef.current = target;
    latestDataRef.current = currentData;
    latestContextRef.current = context;
  }, [target, currentData, context]);

  // Cancel debounced save on nestling id change
  useEffect(() => {
    debouncedSave.cancel();
  }, [target?.id]);

  // Memoize keys to avoid recalculating on every render
  const dataKeys = useMemo(() => Object.keys(currentData), [currentData]);

  // Track previous data to avoid unnecessary re-renders
  const prevDataRef = useRef<string>();

  useEffect(() => {
    if (!target) return;

    // Only proceed if data actually changed
    const currentDataStr = JSON.stringify(currentData);
    if (currentDataStr === prevDataRef.current) return;

    const hasChanges = dataKeys.some((key) => {
      return currentData[key] !== (target as any)[key];
    });

    if (!hasChanges) return;

    prevDataRef.current = currentDataStr;
    setAutoSaveStatus("saving");
    debouncedSave();
  }, [currentData, target?.id]);

  return { autoSaveStatus, debouncedSave };
}
