import DashboardCard from "./DashboardCard";
import AddNestModal from "../modals/AddNestModal";
import { Nest, User } from "@/lib/types";
import EditNestModal from "../modals/EditNestModal";
import { Button } from "../ui/button";
import { Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NestPreview({
  user,
  nests,
  activeNest,
  setActiveNest,
  refresh,
}: {
  user: User | null;
  nests: Nest[];
  activeNest: Nest | null;
  setActiveNest: (nest: Nest | null) => void;
  refresh?: () => void;
}) {
  const navigate = useNavigate();

  const handleNavigate = (nestId: number) => {
    navigate(`/nest/${nestId}`);
  };
  return (
    <div className="flex flex-col gap-5 bg-white dark:bg-gray-800 p-6 rounded-lg shadow overflow-y-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">🐣 Your Nests</h2>
        <AddNestModal user={user} refresh={refresh} />
      </div>
      {nests.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 py-4">
          No nests yet. Create your first one! 🪺
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ">
          {nests.slice(0, 3).map((nest: Nest) => (
            <DashboardCard
              key={nest.id}
              onClick={() => handleNavigate(nest.id)}
            >
              <div className="flex justify-between">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">🪺</div>
                    <h3 className="text-xl font-bold text-black dark:text-white">
                      {nest.title}
                    </h3>
                  </div>
                </div>
                <Button onClick={() => setActiveNest(nest)} variant={"ghost"}>
                  <Pencil />
                </Button>
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Created on <span className="italic">{nest.created_at}</span>
              </p>
            </DashboardCard>
          ))}
        </div>
      )}

      {activeNest && (
        <EditNestModal
          nest={activeNest}
          refresh={() => {
            refresh?.();
            setActiveNest(null);
          }}
        />
      )}
    </div>
  );
}
