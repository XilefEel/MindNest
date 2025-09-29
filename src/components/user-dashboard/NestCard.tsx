import { useNavigate } from "react-router-dom";
import DashboardCard from "./DashboardCard";
import EditNestModal from "../modals/EditNestModal";
import { Button } from "../ui/button";
import { Nest } from "@/lib/types/nests";
import { useNestStore } from "@/stores/useNestStore";

export default function NestCard({ nest }: { nest: Nest }) {
  const { setActiveNestId } = useNestStore();
  const navigate = useNavigate();
  const handleNavigate = (nestId: number) => {
    setActiveNestId(nestId);
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
        <Button variant={"ghost"}>
          <EditNestModal nest={nest} />
        </Button>
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400">
        Created on <span className="italic">{nest.created_at}</span>
      </p>
    </DashboardCard>
  );
}
