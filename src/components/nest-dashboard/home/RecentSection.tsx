import { useActiveNestId } from "@/stores/useNestStore";
import { Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { clearRecentNestlings } from "@/lib/storage/nestling";
import RecentCard from "./RecentCard";
import { useRecentNestlings } from "@/hooks/useRecentNestlings";
import { openNestling } from "@/lib/utils/nestlings";

export default function RecentSection() {
  const activeNestId = useActiveNestId();
  const { recentNestlings, setRecentNestlings } = useRecentNestlings();

  const [, forceUpdate] = useState(0);

  const handleClear = async () => {
    await clearRecentNestlings(activeNestId!);
    setRecentNestlings([]);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      forceUpdate((prev) => prev + 1);
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="size-6 flex-shrink-0" />
          <div className="flex justify-between">
            <h2 className="text-lg font-semibold md:text-xl">
              Recent Nestlings
            </h2>
          </div>
        </div>
        {recentNestlings.length > 0 && (
          <div
            onClick={handleClear}
            className="text-xs text-gray-500 transition-all duration-100 hover:text-gray-400 dark:text-zinc-400 dark:hover:text-zinc-300"
          >
            Clear all
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {recentNestlings.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            No recent nestlings
          </p>
        )}
        {recentNestlings.map((nestling) => (
          <RecentCard
            key={nestling.id}
            nestling={nestling}
            onClick={() => openNestling(nestling)}
          />
        ))}
      </div>
    </div>
  );
}
