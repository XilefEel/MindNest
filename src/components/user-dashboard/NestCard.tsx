import { useNavigate } from "react-router-dom";
import EditNestModal from "../modals/EditNestModal";
import { Nest } from "@/lib/types/nest";
import { useNestActions } from "@/stores/useNestStore";
import { EllipsisVertical } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function NestCard({ nest }: { nest: Nest }) {
  const { setActiveNestId } = useNestActions();
  const navigate = useNavigate();
  const handleNavigate = (nestId: number) => {
    setActiveNestId(nestId);
    navigate(`/nest/${nestId}`);
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl dark:bg-gray-800">
      <div
        onClick={() => handleNavigate(nest.id)}
        className="flex cursor-pointer items-center"
      >
        <div className="flex w-full flex-col space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {nest.title}
            </h3>
            <EditNestModal nest={nest}>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="flex size-4 cursor-pointer items-center rounded-lg hover:text-teal-500 dark:text-white"
              >
                <EllipsisVertical className="size-4" />
              </div>
            </EditNestModal>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400">
            Updated{" "}
            {formatDistanceToNow(new Date(nest.updatedAt), {
              addSuffix: true,
            })}
          </p>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-teal-400 to-teal-600 transition-all duration-500 group-hover:w-full" />
    </div>
  );
}
