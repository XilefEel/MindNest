import AddNestModal from "../../modals/AddNestModal";
import { Nest } from "@/lib/types/nest";
import NestCard from "../NestCard";
import { useNestActions, useNests } from "@/stores/useNestStore";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Home, Plus } from "lucide-react";

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
    <div className="flex flex-col gap-5 overflow-y-auto rounded-lg border-l-4 border-teal-500 bg-white p-6 dark:bg-gray-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 shadow-lg">
            <Home className="text-white" size={20} />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Your Nests</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Personal collections and projects
            </p>
          </div>
        </div>
        <AddNestModal userId={user.id}>
          <div className="flex items-center rounded-lg bg-teal-500 p-2 px-3 text-sm font-semibold text-white transition hover:bg-teal-700">
            <Plus className="mr-1 size-4" /> Create Nest
          </div>
        </AddNestModal>
      </div>

      {nests.length === 0 ? (
        <p className="py-4 text-center text-gray-500 dark:text-gray-400">
          No nests yet. Create your first one! 🪺
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {nests.slice(0, 3).map((nest: Nest) => (
            <NestCard key={nest.id} nest={nest} />
          ))}
        </div>
      )}
    </div>
  );
}
