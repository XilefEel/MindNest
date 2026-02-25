import { Input } from "@/components/ui/input";
import { saveLastNestling } from "@/lib/storage/nestling";
import { cn } from "@/lib/utils/general";
import {
  useNestlingActions,
  useNestlings,
  useNestlingTagsMap,
} from "@/stores/useNestlingStore";
import { useActiveBackgroundId, useActiveNestId } from "@/stores/useNestStore";
import { Search } from "lucide-react";
import { useState } from "react";
import SearchItem from "./SearchItem";

export default function SearchBar() {
  const activeNestId = useActiveNestId();
  const activeBackgroundId = useActiveBackgroundId();
  const nestlings = useNestlings();
  const nestlingTagsMap = useNestlingTagsMap();
  const { setActiveNestlingId } = useNestlingActions();

  const [searchQuery, setSearchQuery] = useState("");
  const isTagSearch = searchQuery.startsWith("#") && searchQuery.length > 1;
  const query = (
    isTagSearch ? searchQuery.slice(1) : searchQuery
  ).toLowerCase();

  const filteredNestlings = nestlings.filter((nestling) => {
    if (isTagSearch) {
      const nestlingTags = nestlingTagsMap[nestling.id] || [];
      return nestlingTags.some((tag) => tag.name.toLowerCase().includes(query));
    } else {
      return nestling.title.toLowerCase().includes(query);
    }
  });

  const handleClick = (nestlingId: number) => {
    setActiveNestlingId(nestlingId);
    saveLastNestling(activeNestId!, nestlingId);
    setSearchQuery("");
  };

  return (
    <section>
      <div className="relative">
        <section className="relative">
          <div className="relative">
            <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search your nestlings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                "h-10 rounded-xl border-0 pl-12 text-base transition-shadow",
                "bg-white text-black placeholder-gray-400",
                "shadow-sm hover:shadow focus:shadow-md",
                "focus:border-teal-500 focus:ring-teal-500",
                "dark:bg-gray-800 dark:text-gray-100",
                "dark:focus:border-teal-400 dark:focus:ring-teal-400",
                activeBackgroundId &&
                  "bg-white/10 backdrop-blur-sm dark:bg-black/10",
              )}
            />
          </div>

          {searchQuery && (
            <div
              className={cn(
                "absolute z-50 mt-2 max-h-60 w-full overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800",
                activeBackgroundId &&
                  "border-0 bg-white/10 backdrop-blur-sm dark:bg-black/30",
              )}
            >
              {filteredNestlings.length > 0 ? (
                filteredNestlings.map((nestling) => (
                  <SearchItem
                    key={nestling.id}
                    nestling={nestling}
                    handleClick={handleClick}
                  />
                ))
              ) : (
                <div className="p-3 text-center text-sm text-gray-400">
                  No results found
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </section>
  );
}
