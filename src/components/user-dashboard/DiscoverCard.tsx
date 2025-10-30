export default function DiscoverCard() {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-md transition-all duration-300 hover:shadow-xl dark:bg-gray-800">
      <div className="flex items-start gap-4">
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

          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-200">
              #brainstorm
            </span>
            <span className="rounded-full bg-purple-100 px-2.5 py-1 text-xs font-medium text-purple-700 dark:bg-purple-900 dark:text-purple-200">
              #mindmap
            </span>
          </div>

          <p className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            Last updated <span className="font-bold">3d ago</span>
          </p>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500 group-hover:w-full" />
    </div>
  );
}
