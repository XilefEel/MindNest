import { Globe } from "lucide-react";

export default function DiscoverCard() {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-500/50">
      <div className="mb-3 flex items-start justify-between">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-500 dark:bg-blue-500/10 dark:text-blue-400">
          <Globe size={14} />
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 dark:bg-gray-700">
          <span className="text-xs">👤</span>
          <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
            Alex
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="line-clamp-2 font-semibold text-gray-800 transition-colors group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-400">
          Mind Mapping Vault
        </h3>
        <div className="flex flex-wrap gap-1.5">
          <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
            #brainstorm
          </span>
          <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
            #mindmap
          </span>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500">3d ago</p>
      </div>

      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-blue-400 to-blue-500 transition-all duration-500 group-hover:w-full" />
    </div>
  );
}
