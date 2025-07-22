import { Nest } from "@/lib/types";
import DashboardCard from "./DashboardCard";
import { useAuth } from "@/context/AuthContext";
import useNests from "@/hooks/useNests";

export default function NestSection() {
  const { user } = useAuth();
  const userId = user?.id;
  if (!userId) return alert("User not logged in");
  const { nests } = useNests(userId);
  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {nests.map((nest: Nest) => (
          <DashboardCard>
            <div className="flex items-center gap-2">
              <span className="text-lg">🪺</span>
              <h3 className="font-semibold text-lg">{nest.title}</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Created: {nest.created_at}
            </p>
          </DashboardCard>
        ))}
      </div>
    </section>
  );
}
