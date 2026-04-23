import { Construction } from "lucide-react";

export default function SharedSection() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 p-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Shared
        </h1>
        <p className="text-sm text-gray-400 dark:text-gray-500">
          Nests shared by others
        </p>
      </div>

      <div className="flex flex-col items-center justify-center gap-4 py-52 text-center">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-teal-50 text-teal-400 dark:bg-teal-500/10">
          <Construction className="size-8 flex-shrink-0" />
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-base font-semibold text-gray-700 dark:text-gray-200">
            Coming soon
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            This feature is still being built
          </p>
        </div>

        <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-600 dark:bg-teal-500/10 dark:text-teal-400">
          In progress
        </span>
      </div>
    </div>
  );
}
