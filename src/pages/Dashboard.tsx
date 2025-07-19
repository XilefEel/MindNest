import { Navigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "../context/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">
        Welcome back, {user?.username || "User"} 👋
      </h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <h2 className="text-sm text-muted-foreground">Total Notes</h2>
            <p className="text-2xl font-bold">23</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h2 className="text-sm text-muted-foreground">Tasks Completed</h2>
            <p className="text-2xl font-bold">15</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h2 className="text-sm text-muted-foreground">Boards</h2>
            <p className="text-2xl font-bold">3</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-medium">Create a new note</h3>
            <p className="text-sm text-muted-foreground">
              Quickly jot something down.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-medium">View Today’s Plan</h3>
            <p className="text-sm text-muted-foreground">
              Stay focused with your planner.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-medium">Open Boards</h3>
            <p className="text-sm text-muted-foreground">
              Organize tasks visually.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
