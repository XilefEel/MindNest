import { Nestling } from "@/lib/types/nestling";

import { useNestlingActions, useNestlings } from "@/stores/useNestlingStore";
import { useActiveNestId } from "@/stores/useNestStore";
import { Clock } from "lucide-react";
import { useEffect, useState } from "react";
import {
  clearRecentNestlings,
  saveLastNestling,
  getRecentNestlings,
} from "@/lib/storage/nestling";
import RecentCard from "./RecentCard";

export default function RecentSection() {
  const activeNestId = useActiveNestId();
  const nestlings = useNestlings();
  const { setActiveNestlingId } = useNestlingActions();

  const [recentNestlings, setRecentNestlings] = useState<Nestling[]>([]);
  const [, forceUpdate] = useState(0);

  const handleClear = async () => {
    await clearRecentNestlings(activeNestId!);
    setRecentNestlings([]);
  };

  const handleClick = (nestlingId: number) => {
    setActiveNestlingId(nestlingId);
    saveLastNestling(activeNestId!, nestlingId);
  };

  useEffect(() => {
    async function fetchRecent() {
      const recentIds = (await getRecentNestlings(activeNestId)) || [];

      const recents = recentIds
        .map((recent) => nestlings.find((n) => n.id === recent))
        .filter((n): n is Nestling => Boolean(n));

      setRecentNestlings(recents);
    }

    if (activeNestId) fetchRecent();
  }, [activeNestId, nestlings]);

  useEffect(() => {
    const interval = setInterval(() => {
      forceUpdate((prev) => prev + 1);
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-gradient-to-br from-blue-400 to-blue-500 p-2 shadow-md">
            <Clock className="h-5 w-5 text-white" />
          </div>
          <div className="flex justify-between">
            <h2 className="text-xl font-bold md:text-2xl">Recent Nestlings</h2>
          </div>
        </div>
        {recentNestlings.length > 0 && (
          <div
            onClick={handleClear}
            className="text-xs text-gray-500 transition-all duration-100 hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-300"
          >
            Clear all
          </div>
        )}
      </div>

      <div className="space-y-3">
        {recentNestlings.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No recent nestlings
          </p>
        )}
        {recentNestlings.map((nestling) => (
          <RecentCard
            key={nestling.id}
            nestling={nestling}
            onClick={handleClick}
          />
        ))}
      </div>
    </div>
  );
}
