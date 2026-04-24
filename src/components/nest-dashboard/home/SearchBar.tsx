import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/general";
import { useActiveBackgroundId } from "@/stores/useNestStore";
import { Search } from "lucide-react";
import SearchItem from "./SearchItem";
import { useNestlingSearch } from "@/hooks/useNestlingSearch.ts";
import { openNestling } from "@/lib/utils/nestlings";
import { Nestling } from "@/lib/types/nestling";

export default function SearchBar() {
  const activeBackgroundId = useActiveBackgroundId();

  const { searchQuery, setSearchQuery, filteredNestlings } =
    useNestlingSearch();

  const handleClick = (nestling: Nestling) => {
    openNestling(nestling);
    setSearchQuery("");
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search your nestlings..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          className={cn(
            "h-9 rounded-xl border pl-10 text-xs transition-shadow md:text-sm",
            "bg-white dark:bg-gray-800",
            "shadow-sm focus:shadow-md",
            "text-gray-900 placeholder-gray-500 dark:text-gray-100 dark:placeholder-gray-400",
            "focus:ring-teal-500 dark:focus:ring-teal-400",
            "border-gray-100 focus:border-teal-50 dark:border-gray-700 dark:focus:border-teal-400",
            activeBackgroundId &&
              "border-transparent bg-white/10 backdrop-blur-sm dark:border-transparent dark:bg-black/10",
          )}
        />

        {!searchQuery && (
          <span className="pointer-events-none absolute top-1/2 right-3.5 hidden -translate-y-1/2 text-xs text-gray-400 md:block">
            type # to filter by tags
          </span>
        )}
      </div>

      {searchQuery && (
        <div
          className={cn(
            "absolute z-50 mt-2 max-h-60 w-full overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800",
            activeBackgroundId &&
              "border-transparent bg-white/10 backdrop-blur-sm dark:border-transparent dark:bg-black/30",
          )}
        >
          {filteredNestlings.length > 0 ? (
            filteredNestlings.map((nestling) => (
              <SearchItem
                key={nestling.id}
                nestling={nestling}
                handleClick={() => handleClick(nestling)}
              />
            ))
          ) : (
            <div className="p-3 text-center text-sm text-gray-400 dark:text-gray-500">
              No nestlings matched "{searchQuery}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
