import { Button } from "../ui/button";
import DashboardCard from "./DashboardCard";

export default function DiscoverPreview() {
  return (
    <div className="flex flex-col gap-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-2">🌍 Discover Public Nests</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ">
        <DashboardCard>
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Mind Mapping Vault</h3>
            <span className="text-xs text-muted-foreground">👤 by Alex</span>
          </div>
          <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">
            Explore creative ways to map your ideas visually.
          </p>
          <div className="flex gap-2 mt-2">
            <span className="badge">#brainstorm</span>
            <span className="badge">#mindmap</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Last updated: 3d ago
          </p>
        </DashboardCard>
        <DashboardCard>
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Mind Mapping Vault</h3>
            <span className="text-xs text-muted-foreground">👤 by Alex</span>
          </div>
          <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">
            Explore creative ways to map your ideas visually.
          </p>
          <div className="flex gap-2 mt-2">
            <span className="badge">#brainstorm</span>
            <span className="badge">#mindmap</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Last updated: 3d ago
          </p>
        </DashboardCard>
        <DashboardCard>
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Mind Mapping Vault</h3>
            <span className="text-xs text-muted-foreground">👤 by Alex</span>
          </div>
          <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">
            Explore creative ways to map your ideas visually.
          </p>
          <div className="flex gap-2 mt-2">
            <span className="badge">#brainstorm</span>
            <span className="badge">#mindmap</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Last updated: 3d ago
          </p>
        </DashboardCard>
      </div>
      <Button className="w-full mt-4 flex items-center gap-2">
        🔍 Search More Nests
      </Button>
    </div>
  );
}
