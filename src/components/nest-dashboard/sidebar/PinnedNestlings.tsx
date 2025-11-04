import { useState } from "react";
import NestlingItem from "./NestlingItem";
import { Pin } from "lucide-react";
import { motion } from "framer-motion";
import { useNestStore } from "@/stores/useNestStore";
import { cn } from "@/lib/utils/general";

export default function PinnedNestlings({
  pinnedNestlings,
  setIsSidebarOpen,
}: {
  pinnedNestlings: any[];
  setIsSidebarOpen: (isOpen: boolean) => void;
}) {
  const { activeBackgroundId } = useNestStore();

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
          className={cn(
            "flex cursor-pointer items-center gap-2 rounded px-2 py-1 font-medium transition-all duration-150 ease-in-out hover:bg-teal-50 dark:hover:bg-gray-700",
            activeBackgroundId && "hover:bg-white/20 dark:hover:bg-black/20",
          )}
        >
          <div className="rounded-lg bg-linear-to-r from-pink-400 to-pink-500 p-1.5 text-white">
            <Pin className="size-4" />
          </div>
          <span>Pinned</span>
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
