export default function BottomBar({
  autoSaveStatus,
  content,
}: {
  autoSaveStatus: string;
  content: string;
}) {
  return (
    <div className="flex w-full items-center justify-between px-3 py-2 text-xs">
      <span>
        {autoSaveStatus === "saving" && "Saving..."}
        {autoSaveStatus === "saved" && "All changes saved"}
        {autoSaveStatus === "error" && "Failed to save"}
        {autoSaveStatus === "idle" && ""}
      </span>

      <span>
        Word count: {content.trim().split(/\s+/).filter(Boolean).length}
      </span>
    </div>
  );
}
