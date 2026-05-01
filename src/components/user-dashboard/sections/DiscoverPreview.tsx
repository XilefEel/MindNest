import { Globe } from "lucide-react";
import DiscoverCard from "../cards/DiscoverCard";

export default function DiscoverPreview() {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-blue-500">
            <Globe className="text-white" size={18} />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-800 dark:text-zinc-100">
              Discover Public Nests
            </h2>
            <p className="text-xs text-gray-400 dark:text-zinc-500">
              Explore popular community nests
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 3 }).map((_, idx) => (
          <DiscoverCard key={idx} />
        ))}
      </div>
    </div>
  );
}
