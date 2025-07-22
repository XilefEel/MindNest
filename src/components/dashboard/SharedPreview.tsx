import DashboardCard from "./DashboardCard";

export default function SharedPreview() {
  return (
    <div className="flex flex-col gap-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-2">🤝 Shared With You</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ">
        <DashboardCard>
          <h3 className="font-semibold">title</h3>
          <p className="text-sm text-muted-foreground">Last updated: yes</p>
          <p className="text-sm text-muted-foreground">Shared by: John Doe</p>
          <span className="text-xs text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-200 px-2 py-0.5 rounded-full">
            Editor
          </span>
        </DashboardCard>
        <DashboardCard>
          <h3 className="font-semibold">title</h3>
          <p className="text-sm text-muted-foreground">Last updated: yes</p>
          <p className="text-sm text-muted-foreground">Shared by: John Doe</p>
          <span className="text-xs text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-200 px-2 py-0.5 rounded-full">
            Editor
          </span>
        </DashboardCard>
        <DashboardCard>
          <h3 className="font-semibold">title</h3>
          <p className="text-sm text-muted-foreground">Last updated: yes</p>
          <p className="text-sm text-muted-foreground">Shared by: John Doe</p>
          <span className="text-xs text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-200 px-2 py-0.5 rounded-full">
            Editor
          </span>
        </DashboardCard>
      </div>
    </div>
  );
}
