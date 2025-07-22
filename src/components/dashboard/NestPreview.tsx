import DashboardCard from "./DashboardCard";
import AddNestModal from "./AddNestModal";
import { Nest } from "@/lib/types";
import useNests from "@/hooks/useNests";
import { useAuth } from "@/context/AuthContext";

export default function NestPreview() {
  const { user } = useAuth();
  const userId = user?.id;
  if (!userId) return alert("User not logged in");
  const { nests, refetch } = useNests(userId);

  return (
    <div className="flex flex-col gap-5 bg-white dark:bg-gray-800 p-6 rounded-lg shadow overflow-y-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">🐣 Your Nests</h2>
        <AddNestModal onSuccess={refetch} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ">
        {nests.slice(0, 3).map((nest: Nest) => (
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
    </div>
  );
}
