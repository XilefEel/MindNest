import { Nest, User } from "@/lib/types";
import DashboardCard from "./DashboardCard";
import EditNestModal from "../modals/EditNestModal";
import { Button } from "../ui/button";
import { Pencil } from "lucide-react";

export default function NestSection({
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
  const userId = user?.id;
  if (!userId) return null;

  if (nests.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-10">
        🪺 You haven't created any nests yet.
      </div>
    );
  }

  return (
    <section>
      <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
        🧠 Your Nests
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {nests.map((nest: Nest) => (
          <DashboardCard key={nest.id}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-2xl">🪺</div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                  {nest.title}
                </h3>
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
      {activeNest && (
        <EditNestModal
          nest={activeNest}
          refresh={() => {
            refresh?.();
            setActiveNest(null);
          }}
        />
      )}
    </section>
  );
}
