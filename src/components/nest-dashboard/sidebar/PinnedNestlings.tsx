import { useState } from "react";
import NestlingItem from "./NestlingItem";
import { Pin } from "lucide-react";

export default function PinnedNestlings({
  pinnedNestlings,
  setIsSidebarOpen,
}: {
  pinnedNestlings: any[];
  setIsSidebarOpen: (isOpen: boolean) => void;
}) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="my-2">
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        onDoubleClick={(e) => {
          e.stopPropagation();
        }}
        className="flex cursor-pointer items-center justify-between rounded px-2 py-1 hover:bg-teal-50 dark:hover:bg-gray-700"
      >
        <div className="flex items-center gap-2 font-medium">
          <Pin className="size-4" />
          <span>Pinned</span>
        </div>
      </div>

      {isOpen && (
        <div className="ml-6">
          {pinnedNestlings.map((nestling) => (
            <NestlingItem
              key={`pinned-${nestling.id}`}
              nestling={nestling}
              setIsSidebarOpen={setIsSidebarOpen}
              isPinnedShortcut={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}
