import { Globe } from "lucide-react";

export default function DiscoverCard() {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-md transition-all duration-300 hover:shadow-xl dark:bg-gray-800">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm">
          <Globe className="text-white" size={20} />
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Mind Mapping Vault
            </h3>
            <div className="flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 dark:bg-gray-700">
              <span className="text-sm">👤</span>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                Alex
              </span>
            </div>
          </div>

          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            Explore creative ways to map your ideas visually.
          </p>

          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-200">
              #brainstorm
            </span>
            <span className="rounded-full bg-purple-100 px-2.5 py-1 text-xs font-medium text-purple-700 dark:bg-purple-900 dark:text-purple-200">
              #mindmap
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <span>
              Last updated <span className="font-medium">3d ago</span>
            </span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500 group-hover:w-full" />
    </div>
  );
}
