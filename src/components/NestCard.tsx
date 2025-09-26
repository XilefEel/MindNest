import { useNavigate } from "react-router-dom";
import DashboardCard from "./DashboardCard";
import EditNestModal from "./modals/EditNestModal";
import { Button } from "./ui/button";
import { Nest } from "@/lib/types/nests";

export default function NestCard({
  nest,
  setActiveNest,
  refresh,
}: {
  nest: Nest;
  setActiveNest: (nest: Nest | null) => void;
  refresh?: () => void;
}) {
  const navigate = useNavigate();
  const handleNavigate = (nestId: number) => {
    navigate(`/nest/${nestId}`);
  };
  return (
    <DashboardCard>
      <div className="flex justify-between">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🪺</div>
            <h3
              className="cursor-pointer text-xl font-bold text-black dark:text-white"
              onClick={() => handleNavigate(nest.id)}
            >
              {nest.title}
            </h3>
          </div>
        </div>
        <Button onClick={() => setActiveNest(nest)} variant={"ghost"}>
          <EditNestModal nest={nest} refresh={refresh} />
        </Button>
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400">
        Created on <span className="italic">{nest.created_at}</span>
      </p>
    </DashboardCard>
  );
}
