import AddNestModal from "../modals/AddNestModal";
import { Nest, User } from "@/lib/types";
import NestCard from "../NestCard";

export default function NestPreview({
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
  return (
    <div className="flex flex-col gap-5 overflow-y-auto rounded-lg bg-white p-6 shadow dark:bg-gray-800">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">🐣 Your Nests</h2>
        <AddNestModal user={user} refresh={refresh} />
      </div>
      {nests.length === 0 ? (
        <p className="py-4 text-center text-gray-500 dark:text-gray-400">
          No nests yet. Create your first one! 🪺
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {nests.slice(0, 3).map((nest: Nest) => (
            <NestCard
              key={nest.id}
              nest={nest}
              setActiveNest={setActiveNest}
              refresh={refresh}
            />
          ))}
        </div>
      )}
    </div>
  );
}
