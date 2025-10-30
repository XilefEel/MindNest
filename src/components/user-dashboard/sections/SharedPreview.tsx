import { Users } from "lucide-react";
import { SharedCard } from "../SharedCard";

export default function SharedPreview() {
  return (
    <div className="flex flex-col gap-2 rounded-lg border-l-4 border-purple-500 bg-white p-6 shadow dark:bg-gray-800">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg">
          <Users className="text-white" size={20} />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Shared with You</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Collaborative nests from your team
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SharedCard />
        <SharedCard />
        <SharedCard />
      </div>
    </div>
  );
}
