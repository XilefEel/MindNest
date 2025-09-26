import { Nest } from "@/lib/types/nests";
import { User } from "@/lib/types/user";
import NestCard from "../NestCard";

export default function NestSection({
  user,
  nests,
  activeNest,
  setActiveNest,
  refresh,
}: {
  user: User | null;
  nests: Nest[];
  activeNest: Nest | null;
  setActiveNest: (nest: Nest | null) => void;
  refresh?: () => void;
}) {
  const userId = user?.id;
  if (!userId) return null;

  if (nests.length === 0) {
    return (
      <div className="py-10 text-center text-gray-500 dark:text-gray-400">
        🪺 You haven't created any nests yet.
      </div>
    );
  }

  console.log(activeNest);

  return (
    <section>
      <h2 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">
        🧠 Your Nests
      </h2>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {nests.map((nest: Nest) => (
          <NestCard
            nest={nest}
            setActiveNest={setActiveNest}
            refresh={refresh}
          />
        ))}
      </div>
    </section>
  );
}
