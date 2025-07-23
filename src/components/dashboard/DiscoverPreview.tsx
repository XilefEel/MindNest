import { Button } from "../ui/button";
import DashboardCard from "./DashboardCard";

export default function DiscoverPreview() {
  return (
    <div className="flex flex-col gap-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-2">🌍 Discover Public Nests</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ">
        <DashboardCard>
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-lg font-semibold text-black dark:text-white">
              Mind Mapping Vault
            </h3>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              👤 Alex
            </span>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400">
            Explore creative ways to map your ideas visually.
          </p>

          <div className="flex flex-wrap gap-2 mt-3">
            <span className="text-xs font-medium px-2 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 rounded-full">
              #brainstorm
            </span>
            <span className="text-xs font-medium px-2 py-0.5 bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200 rounded-full">
              #mindmap
            </span>
          </div>

          <p className="text-xs text-muted-foreground mt-3">
            ⏱ Last updated: 3d ago
          </p>
        </DashboardCard>
        <DashboardCard>
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-lg font-semibold text-black dark:text-white">
              Mind Mapping Vault
            </h3>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              👤 Alex
            </span>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400">
            Explore creative ways to map your ideas visually.
          </p>

          <div className="flex flex-wrap gap-2 mt-3">
            <span className="text-xs font-medium px-2 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 rounded-full">
              #brainstorm
            </span>
            <span className="text-xs font-medium px-2 py-0.5 bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200 rounded-full">
              #mindmap
            </span>
          </div>

          <p className="text-xs text-muted-foreground mt-3">
            ⏱ Last updated: 3d ago
          </p>
        </DashboardCard>
        <DashboardCard>
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-lg font-semibold text-black dark:text-white">
              Mind Mapping Vault
            </h3>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              👤 Alex
            </span>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400">
            Explore creative ways to map your ideas visually.
          </p>

          <div className="flex flex-wrap gap-2 mt-3">
            <span className="text-xs font-medium px-2 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 rounded-full">
              #brainstorm
            </span>
            <span className="text-xs font-medium px-2 py-0.5 bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200 rounded-full">
              #mindmap
            </span>
          </div>

          <p className="text-xs text-muted-foreground mt-3">
            ⏱ Last updated: 3d ago
          </p>
        </DashboardCard>
      </div>
      <Button className="w-full mt-4 flex items-center gap-2">
        🔍 Search More Nests
      </Button>
    </div>
  );
}
