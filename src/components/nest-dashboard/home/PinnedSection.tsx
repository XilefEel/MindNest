import { saveLastNestling } from "@/lib/storage/nestling";
import { useNestlingActions, useNestlings } from "@/stores/useNestlingStore";
import { useActiveNestId } from "@/stores/useNestStore";
import { Pin } from "lucide-react";
import PinnedCard from "./PinnedCard";

export default function PinnedSection() {
  const activeNestId = useActiveNestId();
  const nestlings = useNestlings();
  const { setActiveNestlingId } = useNestlingActions();

  const pinnedNestlings = nestlings.filter((n) => n.isPinned === true);

  const handleClick = (nestlingId: number) => {
    setActiveNestlingId(nestlingId);
    saveLastNestling(activeNestId!, nestlingId);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-gradient-to-br from-pink-400 to-pink-500 p-2 shadow-md">
          <Pin className="h-5 w-5 text-white" />
        </div>
        <h2 className="text-xl font-bold md:text-2xl">Pinned Nestlings</h2>
      </div>

      <div className="space-y-3">
        {pinnedNestlings.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No pinned nestlings
          </p>
        )}

        {pinnedNestlings.map((nestling) => (
          <PinnedCard
            key={nestling.id}
            nestling={nestling}
            onClick={handleClick}
          />
        ))}
      </div>
    </div>
  );
}
