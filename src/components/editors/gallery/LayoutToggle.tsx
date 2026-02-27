import BaseToolTip from "@/components/BaseToolTip";
import { cn } from "@/lib/utils/general";
import { Rows3, Columns3 } from "lucide-react";

export default function LayoutToggle({
  layoutMode,
  setLayoutMode,
}: {
  layoutMode: "row" | "column";
  setLayoutMode: (mode: "row" | "column") => void;
}) {
  return (
    <div className="flex rounded border border-gray-200 bg-gray-100 p-1 dark:border-gray-700 dark:bg-gray-800">
      <BaseToolTip label="Row view">
        <button
          onClick={() => setLayoutMode("row")}
          className={cn(
            "rounded p-2 transition duration-100",
            layoutMode === "row"
              ? "bg-teal-50 text-teal-500 shadow-sm dark:bg-teal-400 dark:text-white"
              : "text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700",
          )}
        >
          <Rows3 size={18} />
        </button>
      </BaseToolTip>

      <BaseToolTip label="Column view">
        <button
          onClick={() => setLayoutMode("column")}
          className={cn(
            "rounded p-2 transition duration-100",
            layoutMode === "column"
              ? "bg-teal-50 text-teal-500 shadow-sm dark:bg-teal-400 dark:text-white"
              : "text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700",
          )}
        >
          <Columns3 size={18} />
        </button>
      </BaseToolTip>
    </div>
  );
}
