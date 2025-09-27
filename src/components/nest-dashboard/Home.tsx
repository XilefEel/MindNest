import { Button } from "@/components/ui/button";
import DashboardCard from "../user-dashboard/DashboardCard";
import AddNestlingModal from "../modals/AddNestlingModal";
import AddFolderModal from "../modals/AddFolderModal";
import { Plus } from "lucide-react";

export default function Home({ nestId }: { nestId: number }) {
  return (
    <main className="flex flex-col gap-10 p-8">
      <header className="space-y-1">
        <h1 className="text-4xl font-bold tracking-tight">🏡 Home</h1>
        <p className="text-muted-foreground text-sm">
          Welcome back! Start where you left off or create something new.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-sm font-bold tracking-wide text-gray-500 uppercase dark:text-gray-300">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <AddNestlingModal nestId={nestId}>
            <div className="flex cursor-pointer items-center rounded-lg bg-black p-2 px-3 text-sm font-semibold text-white transition hover:scale-105 dark:bg-teal-400">
              <Plus className="mr-1 size-4" /> Create Nestling
            </div>
          </AddNestlingModal>
          <AddFolderModal nestId={nestId}>
            <div className="flex cursor-pointer items-center rounded-lg bg-black p-2 px-3 text-sm font-semibold text-white transition hover:scale-105 dark:bg-teal-400">
              <Plus className="mr-1 size-4" /> Create Folder
            </div>
          </AddFolderModal>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">
            🕘 Recent Nestlings
          </h2>
          <Button
            variant="ghost"
            className="text-muted-foreground cursor-pointer text-sm hover:text-gray-700"
          >
            View all
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <DashboardCard key={i}>
              <p className="font-medium">🌱 July 24 Journal</p>
              <p className="text-muted-foreground text-sm">
                Folder: Daily Logs · edited just now
              </p>
            </DashboardCard>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">
            📁 Recent Folders
          </h2>
          <Button
            variant="ghost"
            className="text-muted-foreground cursor-pointer text-sm hover:text-gray-700"
          >
            View all
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[...Array(4)].map((_, i) => (
            <DashboardCard key={i}>
              <p className="font-medium">Personal Projects</p>
              <p className="text-muted-foreground text-sm">
                5 nestlings · updated 2h ago
              </p>
            </DashboardCard>
          ))}
        </div>
      </section>
    </main>
  );
}
