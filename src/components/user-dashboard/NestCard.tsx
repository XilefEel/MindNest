import { useNavigate } from "react-router-dom";
import EditNestModal from "../modals/EditNestModal";
import { Nest } from "@/lib/types/nest";
import { useNestStore } from "@/stores/useNestStore";
import { Home, Pencil } from "lucide-react";

export default function NestCard({ nest }: { nest: Nest }) {
  const { setActiveNestId } = useNestStore();
  const navigate = useNavigate();
  const handleNavigate = (nestId: number) => {
    setActiveNestId(nestId);
    navigate(`/nest/${nestId}`);
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-md transition-all duration-300 hover:shadow-xl dark:bg-gray-800">
      <div className="flex items-start justify-between">
        <div className="flex flex-1 cursor-pointer items-center gap-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 shadow-sm">
            <Home className="text-white" size={20} />
          </div>

          <div className="flex flex-col gap-1">
            <h3
              onClick={() => handleNavigate(nest.id)}
              className="text-xl font-bold text-gray-900 dark:text-white"
            >
              {nest.title}
            </h3>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Updated on <span className="font-medium">{nest.updated_at}</span>
            </p>
          </div>
        </div>

        <EditNestModal nest={nest}>
          <div className="flex size-4 cursor-pointer items-center rounded-lg hover:text-teal-500 dark:text-white">
            <Pencil className="size-4" />
          </div>
        </EditNestModal>
      </div>

      <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-teal-400 to-teal-600 transition-all duration-500 group-hover:w-full" />
    </div>
  );
}
