import {
  clearRecentNestlings,
  getRecentNestlings,
  saveLastNestling,
} from "@/lib/storage/session";
import { Nestling } from "@/lib/types/nestling";
import { findFolderPath } from "@/lib/utils/folders";
import { cn } from "@/lib/utils/general";
import { getNestlingIcon } from "@/lib/utils/nestlings";
import {
  useFolders,
  useNestlingActions,
  useNestlings,
} from "@/stores/useNestlingStore";
import { useActiveBackgroundId, useActiveNestId } from "@/stores/useNestStore";
import { ArrowRight, Clock, Folder } from "lucide-react";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import NestlingContextMenu from "@/components/context-menu/NestlingContextMenu";

export default function RecentSection() {
  const activeNestId = useActiveNestId();
  const activeBackgroundId = useActiveBackgroundId();
  const nestlings = useNestlings();
  const folders = useFolders();
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
            className="cursor-pointer text-xs text-gray-500 transition-all duration-100 hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-300"
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
        {recentNestlings.map((nestling, i) => {
          const Icon = getNestlingIcon(nestling.nestlingType);
          return (
            <NestlingContextMenu nestlingId={nestling.id}>
              <div
                key={i}
                onClick={() => handleClick(nestling.id)}
                className={cn(
                  "group cursor-pointer rounded-xl border border-l-4 p-4 hover:shadow-md",
                  "bg-white dark:bg-gray-800",
                  "border-gray-200 border-l-blue-500 hover:border-blue-500 dark:border-gray-800 dark:border-l-blue-500 dark:hover:hover:border-blue-500",
                  "transition hover:scale-105",
                  activeBackgroundId &&
                    "border-t-0 border-r-0 border-b-0 bg-white/10 backdrop-blur-sm dark:bg-black/10",
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1 font-semibold">
                      <div className="flex w-6 items-center justify-center">
                        {nestling.icon ? (
                          <p>{nestling.icon}</p>
                        ) : (
                          <Icon className="size-4 flex-shrink-0" />
                        )}
                      </div>
                      <span>{nestling.title}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                      <Folder className="h-4 w-6" />
                      <span>
                        {findFolderPath(nestling.folderId, folders) ||
                          "No Folder"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDistanceToNow(new Date(nestling.updatedAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-300 transition" />
                </div>
              </div>
            </NestlingContextMenu>
          );
        })}
      </div>
    </div>
  );
}
