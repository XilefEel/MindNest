import AddNestModal from "../modals/AddNestModal";
import { Nest } from "@/lib/types/nests";
import NestCard from "./NestCard";
import { useNestStore } from "@/stores/useNestStore";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function NestPreview() {
  const { user } = useAuth();
  const userId = user?.id;
  if (!userId) return;

  const { nests, fetchNests } = useNestStore();

  useEffect(() => {
    fetchNests(userId);
  }, [fetchNests, userId]);

  return (
    <div className="flex flex-col gap-5 overflow-y-auto rounded-lg bg-white p-6 shadow dark:bg-gray-800">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">🐣 Your Nests</h2>
        <AddNestModal userId={user.id} />
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
