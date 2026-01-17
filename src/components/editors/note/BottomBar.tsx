import { Loader2, Check, AlertCircle } from "lucide-react";

export default function BottomBar({
  autoSaveStatus,
  wordCount,
}: {
  autoSaveStatus: "idle" | "saving" | "saved" | "error";
  wordCount: number;
}) {
  return (
    <div className="flex w-full items-center justify-between px-3 py-2 text-xs">
      <div className="flex items-center gap-2">
        {autoSaveStatus === "saving" && (
          <>
            <Loader2 className="h-3 w-3 animate-spin text-blue-500" />
            <span className="text-blue-600 dark:text-blue-400">Saving...</span>
          </>
        )}
        {autoSaveStatus === "saved" && (
          <>
            <Check className="h-3 w-3 text-green-500" />
            <span className="text-green-600 dark:text-green-400">
              All changes saved
            </span>
          </>
        )}
        {autoSaveStatus === "error" && (
          <>
            <AlertCircle className="h-3 w-3 text-red-500" />
            <span className="text-red-600 dark:text-red-400">
              Failed to save
            </span>
          </>
        )}
        {autoSaveStatus === "idle" && (
          <span className="text-gray-400 dark:text-gray-500">Ready</span>
        )}
      </div>

      <div className="flex items-center gap-4">
        <span className="font-medium">
          {wordCount.toLocaleString()} {wordCount === 1 ? "word" : "words"}
        </span>
      </div>
    </div>
  );
}
