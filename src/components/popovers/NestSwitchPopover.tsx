import { useAuth } from "@/context/AuthContext";
import { Nest } from "@/lib/types/nest";
import { cn } from "@/lib/utils/general";
import {
  useActiveBackgroundId,
  useActiveNestId,
  useNests,
} from "@/stores/useNestStore";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NestSwitchPopover({
  onClose,
}: {
  onClose: () => void;
}) {
  const { user } = useAuth();
  const userId = user?.id;
  if (!userId) return;

  const navigate = useNavigate();
  const nests = useNests();
  const activeNestId = useActiveNestId();
  const activeBackgroundId = useActiveBackgroundId();

  const handleClick = (nest: Nest) => {
    navigate(`/nest/${nest.id}`);
    onClose();
  };

  return (
    <>
      <p className="my-1 mb-2 text-xs font-semibold text-gray-400 uppercase">
        Your Nests
      </p>

      <div className="flex flex-col gap-1">
        {nests
          .filter((n) => n.id !== activeNestId)
          .map((nest) => (
            <div
              key={nest.id}
              className={cn(
                "flex flex-row gap-2 rounded-md px-2 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-700",
                activeBackgroundId &&
                  "hover:bg-white/30 hover:dark:bg-black/30",
              )}
              onClick={() => handleClick(nest)}
            >
              <span>🪹</span>
              <span>{nest.title}</span>
            </div>
          ))}
      </div>

      <button
        onClick={onClose}
        className={cn(
          "absolute top-4 right-4 rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 hover:dark:bg-gray-700 hover:dark:text-gray-200",
          activeBackgroundId && "hover:bg-white/30 hover:dark:bg-black/30",
        )}
      >
        <X size={18} />
      </button>
    </>
  );
}
