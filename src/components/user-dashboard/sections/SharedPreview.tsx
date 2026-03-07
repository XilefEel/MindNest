import { Users } from "lucide-react";
import { SharedCard } from "../cards/SharedCard";

export default function SharedPreview() {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-700 dark:bg-gray-800/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-purple-500">
            <Users className="text-white" size={18} />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-800 dark:text-gray-100">
              Shared with You
            </h2>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Nests shared by others
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 2 }).map((_, idx) => (
          <SharedCard key={idx} />
        ))}
      </div>
    </div>
  );
}
