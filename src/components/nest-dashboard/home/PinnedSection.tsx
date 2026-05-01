import { useNestlings } from "@/stores/useNestlingStore";
import { Pin } from "lucide-react";
import PinnedCard from "./PinnedCard";
import { openNestling } from "@/lib/utils/nestlings";

export default function PinnedSection() {
  const nestlings = useNestlings();

  const pinnedNestlings = nestlings.filter((n) => n.isPinned === true);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Pin className="size-6 flex-shrink-0" />
        <h2 className="text-lg font-semibold md:text-xl">Pinned Nestlings</h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {pinnedNestlings.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            No pinned nestlings
          </p>
        )}

        {pinnedNestlings.map((nestling) => (
          <PinnedCard
            key={nestling.id}
            nestling={nestling}
            onClick={() => openNestling(nestling)}
          />
        ))}
      </div>
    </div>
  );
}
