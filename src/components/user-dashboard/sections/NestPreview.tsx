import AddNestModal from "../../modals/AddNestModal";
import { Nest } from "@/lib/types/nest";
import NestCard from "../cards/NestCard";
import { useNestActions, useNests } from "@/stores/useNestStore";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { FolderOpen, Plus } from "lucide-react";

export default function NestPreview() {
  const { user } = useAuth();
  const userId = user?.id;
  if (!userId) return;

  const nests = useNests();
  const { getNests } = useNestActions();

  useEffect(() => {
    getNests(userId);
  }, [getNests, userId]);

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-teal-500">
            <FolderOpen className="text-white" size={18} />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-800 dark:text-zinc-100">
              Your Nests
            </h2>
            <p className="text-xs text-gray-400 dark:text-zinc-500">
              Personal collections and projects
            </p>
          </div>
        </div>

        <AddNestModal userId={user.id}>
          <button className="flex items-center gap-1.5 rounded-lg bg-teal-500 px-3 py-1.5 text-sm text-white shadow transition-colors hover:bg-teal-600">
            <Plus size={14} className="flex-shrink-0" />
            <span>Create Nest</span>
          </button>
        </AddNestModal>
      </div>

      {nests.length === 0 ? (
        <div className="py-10 text-center text-sm text-gray-400 dark:text-zinc-500">
          No nests yet. Create your first one! 🪺
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {nests.slice(0, 8).map((nest: Nest) => (
            <NestCard key={nest.id} nest={nest} />
          ))}
        </div>
      )}
    </div>
  );
}
