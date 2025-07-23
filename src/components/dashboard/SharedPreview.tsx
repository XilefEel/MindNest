import DashboardCard from "./DashboardCard";

export default function SharedPreview() {
  return (
    <div className="flex flex-col gap-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-2">🤝 Shared With You</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ">
        <DashboardCard>
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-lg font-bold text-black dark:text-white">
              📄 Title Here
            </h3>
            <span className="text-xs font-medium text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-200 px-2 py-0.5 rounded-full">
              Editor
            </span>
          </div>

          <p className="text-sm text-muted-foreground">Shared by: John Doe</p>
          <p className="text-sm text-muted-foreground">
            Last updated: Jul 21, 2025
          </p>
        </DashboardCard>
        <DashboardCard>
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-lg font-bold text-black dark:text-white">
              📄 Title Here
            </h3>
            <span className="text-xs font-medium text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-200 px-2 py-0.5 rounded-full">
              Editor
            </span>
          </div>

          <p className="text-sm text-muted-foreground">Shared by: John Doe</p>
          <p className="text-sm text-muted-foreground">
            Last updated: Jul 21, 2025
          </p>
        </DashboardCard>
        <DashboardCard>
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-lg font-bold text-black dark:text-white">
              📄 Title Here
            </h3>
            <span className="text-xs font-medium text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-200 px-2 py-0.5 rounded-full">
              Editor
            </span>
          </div>

          <p className="text-sm text-muted-foreground">Shared by: John Doe</p>
          <p className="text-sm text-muted-foreground">
            Last updated: Jul 21, 2025
          </p>
        </DashboardCard>
      </div>
    </div>
  );
}
