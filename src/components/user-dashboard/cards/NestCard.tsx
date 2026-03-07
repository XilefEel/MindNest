import { useNavigate } from "react-router-dom";
import EditNestModal from "../../modals/EditNestModal";
import { Nest } from "@/lib/types/nest";
import { useNestActions } from "@/stores/useNestStore";
import { EllipsisVertical, FolderOpen } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function NestCard({ nest }: { nest: Nest }) {
  const { setActiveNestId } = useNestActions();
  const navigate = useNavigate();

  const handleNavigate = (nestId: number) => {
    setActiveNestId(nestId);
    navigate(`/nest/${nestId}`);
  };

  return (
    <div
      onClick={() => handleNavigate(nest.id)}
      className="group relative overflow-hidden rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-teal-500/50"
    >
      <div className="mb-2 flex items-start justify-between">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-500 dark:bg-teal-500/10 dark:text-teal-400">
          <FolderOpen size={14} />
        </div>
        <EditNestModal nest={nest}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="rounded-lg p-0.5 text-gray-400 transition-colors hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-300"
          >
            <EllipsisVertical size={14} />
          </div>
        </EditNestModal>
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="line-clamp-2 text-base font-semibold text-gray-800 transition-colors group-hover:text-teal-600 dark:text-gray-100 dark:group-hover:text-teal-400">
          {nest.title}
        </h3>
        <p className="text-xs text-gray-400 dark:text-gray-500">
          {formatDistanceToNow(new Date(nest.updatedAt), { addSuffix: true })}
        </p>
      </div>

      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-teal-400 to-teal-500 transition-all duration-500 group-hover:w-full" />
    </div>
  );
}
