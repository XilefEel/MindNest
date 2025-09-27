import { ReactNode } from "react";
import { Card, CardContent } from "../ui/card";

type DashboardCardProps = {
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  children: ReactNode;
};
export default function DashboardCard({
  onClick,
  children,
}: DashboardCardProps) {
  return (
    <Card
      onClick={onClick}
      className="rounded-2xl border-gray-200 bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-800 dark:bg-gray-700"
    >
      <CardContent className="space-y-1 p-4">{children}</CardContent>
    </Card>
  );
}
