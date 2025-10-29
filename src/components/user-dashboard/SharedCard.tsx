import { Users } from "lucide-react";

export function SharedCard() {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-md transition-all duration-300 hover:shadow-xl dark:bg-gray-800">
      <div className="flex items-start justify-between">
        <div className="flex flex-1 items-center gap-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-sm">
            <Users className="text-white" size={20} />
          </div>

          <div className="flex flex-col gap-1">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Title Here
            </h3>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Shared by <span className="font-medium">John Doe</span>
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Updated on <span className="font-medium">Jul 21, 2025</span>
            </p>
          </div>
        </div>

        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-600 dark:bg-blue-900 dark:text-blue-200">
          Editor
        </span>
      </div>

      <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-purple-400 to-purple-600 transition-all duration-500 group-hover:w-full" />
    </div>
  );
}
