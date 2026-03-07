import { Users } from "lucide-react";

export function SharedCard() {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-purple-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-purple-500/50">
      <div className="mb-3 flex items-start justify-between">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-purple-500 dark:bg-purple-500/10 dark:text-purple-400">
          <Users size={14} />
        </div>
        <span className="rounded-full bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-600 dark:bg-purple-500/10 dark:text-purple-400">
          Editor
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="line-clamp-2 font-semibold text-gray-800 transition-colors group-hover:text-purple-600 dark:text-gray-100 dark:group-hover:text-purple-400">
          Title Here
        </h3>
        <p className="text-xs text-gray-400 dark:text-gray-500">
          Shared by John Doe · 3d ago
        </p>
      </div>

      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-purple-400 to-purple-500 transition-all duration-500 group-hover:w-full" />
    </div>
  );
}
