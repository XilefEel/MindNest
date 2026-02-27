import BaseToolTip from "@/components/BaseToolTip";
import { cn } from "@/lib/utils/general";
import { Grid, List } from "lucide-react";

export default function ViewToggle({
  viewMode,
  setViewMode,
}: {
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
}) {
  return (
    <div className="flex rounded border border-gray-200 bg-gray-100 p-1 dark:border-gray-700 dark:bg-gray-800">
      <BaseToolTip label="Grid view">
        <button
          onClick={() => setViewMode("grid")}
          className={cn(
            "rounded p-2 transition duration-100",
            viewMode === "grid"
              ? "bg-teal-50 text-teal-500 shadow-sm dark:bg-teal-400 dark:text-white"
              : "text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700",
          )}
        >
          <Grid size={18} />
        </button>
      </BaseToolTip>

      <BaseToolTip label="List view">
        <button
          onClick={() => setViewMode("list")}
          className={cn(
            "rounded p-2 transition duration-100",
            viewMode === "list"
              ? "bg-teal-50 text-teal-500 shadow-sm dark:bg-teal-400 dark:text-white"
              : "text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700",
          )}
        >
          <List size={18} />
        </button>
      </BaseToolTip>
    </div>
  );
}
