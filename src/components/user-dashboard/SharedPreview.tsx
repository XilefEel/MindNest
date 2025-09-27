import DashboardCard from "./DashboardCard";

export default function SharedPreview() {
  return (
    <div className="flex flex-col gap-2 rounded-lg bg-white p-6 shadow dark:bg-gray-800">
      <h2 className="mb-2 text-xl font-bold">🤝 Shared With You</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <DashboardCard>
          <div className="mb-1 flex items-center justify-between">
            <h3 className="text-lg font-bold text-black dark:text-white">
              📄 Title Here
            </h3>
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-600 dark:bg-blue-900 dark:text-blue-200">
              Editor
            </span>
          </div>

          <p className="text-muted-foreground text-sm">Shared by: John Doe</p>
          <p className="text-muted-foreground text-sm">
            Last updated: Jul 21, 2025
          </p>
        </DashboardCard>
        <DashboardCard>
          <div className="mb-1 flex items-center justify-between">
            <h3 className="text-lg font-bold text-black dark:text-white">
              📄 Title Here
            </h3>
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-600 dark:bg-blue-900 dark:text-blue-200">
              Editor
            </span>
          </div>

          <p className="text-muted-foreground text-sm">Shared by: John Doe</p>
          <p className="text-muted-foreground text-sm">
            Last updated: Jul 21, 2025
          </p>
        </DashboardCard>
        <DashboardCard>
          <div className="mb-1 flex items-center justify-between">
            <h3 className="text-lg font-bold text-black dark:text-white">
              📄 Title Here
            </h3>
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-600 dark:bg-blue-900 dark:text-blue-200">
              Editor
            </span>
          </div>

          <p className="text-muted-foreground text-sm">Shared by: John Doe</p>
          <p className="text-muted-foreground text-sm">
            Last updated: Jul 21, 2025
          </p>
        </DashboardCard>
      </div>
    </div>
  );
}
