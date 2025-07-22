import { ReactNode } from "react";
import { Card, CardContent } from "../ui/card";

interface DashboardCardProps {
  children: ReactNode;
}
export default function DashboardCard({ children }: DashboardCardProps) {
  return (
    <Card className="shadow-md rounded-lg p-4 hover:scale-105 transition cursor-pointer">
      <CardContent className="p-4 space-y-1">{children}</CardContent>
    </Card>
  );
}
