import { Nest } from "@/lib/types/nest";
import NestCard from "../cards/NestCard";
import { useNestActions, useNests } from "@/stores/useNestStore";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Search, Plus, FolderOpen } from "lucide-react";
import AddNestModal from "@/components/modals/AddNestModal";
import { cn } from "@/lib/utils/general";
import { Input } from "@/components/ui/input";

export default function NestSection() {
  const { user } = useAuth();
  const userId = user?.id;
  if (!userId) return null;

  const nests = useNests();
  const { getNests } = useNestActions();

  const [query, setQuery] = useState("");
  const filtered = nests.filter((nest: Nest) =>
    nest.title.toLowerCase().includes(query.toLowerCase()),
  );

  useEffect(() => {
    if (!userId) return;
    getNests(userId);
  }, [getNests, userId]);

  return (
    <div className="mx-auto flex w-full flex-col gap-5 md:p-4 md:pt-8">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            🪹 My Nests
          </h1>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Your personal collections and projects
          </p>
        </div>

        <AddNestModal userId={userId}>
          <button className="flex items-center gap-1.5 rounded-lg bg-teal-500 px-3 py-1.5 text-sm text-white shadow transition-colors hover:bg-teal-600">
            <Plus size={14} className="flex-shrink-0" />
            <span>Create Nest</span>
          </button>
        </AddNestModal>
      </div>

      <div className="relative">
        <Search
          size={14}
          className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400 dark:text-gray-500"
        />

        <Input
          type="text"
          placeholder="Search nests..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={cn(
            "h-10 rounded-xl border pl-10 text-base transition-shadow",
            "bg-white dark:bg-gray-800",
            "shadow-sm hover:shadow focus:shadow-md",
            "text-gray-900 placeholder-gray-500 dark:text-gray-100 dark:placeholder-gray-400",
            "focus:ring-teal-500 dark:focus:ring-teal-400",
            "border-gray-300 focus:border-teal-50 dark:border-gray-600 dark:focus:border-teal-400",
          )}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-teal-50 text-teal-400 dark:bg-teal-500/10">
            <FolderOpen size={32} />
          </div>

          <div className="flex flex-col gap-1">
            {query ? (
              <>
                <p className="text-base font-semibold text-gray-700 dark:text-gray-200">
                  No nests match "{query}"
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Try a different search term
                </p>
              </>
            ) : (
              <>
                <p className="text-base font-semibold text-gray-700 dark:text-gray-200">
                  No nests yet
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Create your first nest to get started 🪺
                </p>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((nest: Nest) => (
            <NestCard key={nest.id} nest={nest} />
          ))}
        </div>
      )}
    </div>
  );
}
