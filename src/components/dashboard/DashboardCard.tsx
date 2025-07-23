import { ReactNode } from "react";
import { Card, CardContent } from "../ui/card";

interface DashboardCardProps {
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  children: ReactNode;
}
export default function DashboardCard({
  onClick,
  children,
}: DashboardCardProps) {
  return (
    <Card
      onClick={onClick}
      className="rounded-2xl bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-800 p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
    >
      <CardContent className="p-4 space-y-1">{children}</CardContent>
    </Card>
  );
}
