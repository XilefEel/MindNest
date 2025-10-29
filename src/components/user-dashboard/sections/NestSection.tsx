import { Nest } from "@/lib/types/nest";
import NestCard from "../NestCard";
import { useNestStore } from "@/stores/useNestStore";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function NestSection() {
  const { user } = useAuth();
  const userId = user?.id;

  const { nests, fetchNests } = useNestStore();

  useEffect(() => {
    if (!userId) return;
    fetchNests(userId);
  }, [fetchNests, userId]);

  if (nests.length === 0) {
    return (
      <div className="py-10 text-center text-gray-500 dark:text-gray-400">
        🪺 You haven't created any nests yet.
      </div>
    );
  }

  return (
    <section>
      <h2 className="mb-8 pt-6 text-3xl font-bold text-gray-900 dark:text-white">
        🧠 Your Nests
      </h2>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {nests.map((nest: Nest) => (
          <NestCard nest={nest} />
        ))}
      </div>
    </section>
  );
}
