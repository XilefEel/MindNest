import { Button } from "../ui/button";
import DashboardCard from "../DashboardCard";

export default function DiscoverPreview() {
  return (
    <div className="flex flex-col gap-2 rounded-lg bg-white p-6 shadow dark:bg-gray-800">
      <h2 className="mb-2 text-xl font-bold">🌍 Discover Public Nests</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <DashboardCard>
          <div className="mb-1 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-black dark:text-white">
              Mind Mapping Vault
            </h3>
            <span className="text-muted-foreground flex items-center gap-1 text-xs">
              👤 Alex
            </span>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400">
            Explore creative ways to map your ideas visually.
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-200">
              #brainstorm
            </span>
            <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700 dark:bg-purple-900 dark:text-purple-200">
              #mindmap
            </span>
          </div>

          <p className="text-muted-foreground mt-3 text-xs">
            ⏱ Last updated: 3d ago
          </p>
        </DashboardCard>
        <DashboardCard>
          <div className="mb-1 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-black dark:text-white">
              Mind Mapping Vault
            </h3>
            <span className="text-muted-foreground flex items-center gap-1 text-xs">
              👤 Alex
            </span>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400">
            Explore creative ways to map your ideas visually.
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-200">
              #brainstorm
            </span>
            <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700 dark:bg-purple-900 dark:text-purple-200">
              #mindmap
            </span>
          </div>

          <p className="text-muted-foreground mt-3 text-xs">
            ⏱ Last updated: 3d ago
          </p>
        </DashboardCard>
        <DashboardCard>
          <div className="mb-1 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-black dark:text-white">
              Mind Mapping Vault
            </h3>
            <span className="text-muted-foreground flex items-center gap-1 text-xs">
              👤 Alex
            </span>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400">
            Explore creative ways to map your ideas visually.
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-200">
              #brainstorm
            </span>
            <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700 dark:bg-purple-900 dark:text-purple-200">
              #mindmap
            </span>
          </div>

          <p className="text-muted-foreground mt-3 text-xs">
            ⏱ Last updated: 3d ago
          </p>
        </DashboardCard>
      </div>
      <Button className="mt-4 flex w-full items-center gap-2">
        🔍 Search More Nests
      </Button>
    </div>
  );
}
