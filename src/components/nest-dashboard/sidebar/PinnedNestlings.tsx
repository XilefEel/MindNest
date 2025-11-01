import { useState } from "react";
import NestlingItem from "./NestlingItem";
import { Pin } from "lucide-react";
import { motion } from "framer-motion";

export default function PinnedNestlings({
  pinnedNestlings,
  setIsSidebarOpen,
}: {
  pinnedNestlings: any[];
  setIsSidebarOpen: (isOpen: boolean) => void;
}) {
  const [isPinnedOpen, setIsPinnedOpen] = useState(true);

  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20, transition: { duration: 0.2 } }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
    >
      <div className="my-2 flex flex-col gap-1">
        <div
          onClick={() => setIsPinnedOpen((prev) => !prev)}
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

        {isPinnedOpen && (
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
    </motion.div>
  );
}
