import AddFolderModal from "@/components/modals/FolderModal";
import NestlingModal from "@/components/modals/NestlingModal";
import { Plus } from "lucide-react";

export default function Header({ nestId }: { nestId: number }) {
  return (
    <header className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
      <div>
        <h1 className="relative inline-block text-2xl font-bold tracking-tight text-slate-900 md:text-3xl dark:text-white">
          Welcome back 👋
          <span className="absolute -bottom-2 left-0 h-1 w-40 rounded-full bg-gradient-to-r from-teal-500 to-teal-600 dark:from-teal-300 dark:to-teal-400"></span>
        </h1>
        <p className="mt-3 text-sm text-slate-600 md:text-base dark:text-slate-400">
          Pick up where you left off or start something new.
        </p>
      </div>

      <div className="flex gap-3 text-sm font-semibold md:text-base">
        <NestlingModal nestId={nestId}>
          <div className="flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 px-4 py-2 text-white shadow-lg transition hover:scale-105 hover:shadow-xl">
            <Plus className="size-4" /> Nestling
          </div>
        </NestlingModal>
        <AddFolderModal nestId={nestId}>
          <div className="flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 px-4 py-2 text-white shadow-lg transition hover:scale-105 hover:shadow-xl">
            <Plus className="size-4" /> Folder
          </div>
        </AddFolderModal>
      </div>
    </header>
  );
}
