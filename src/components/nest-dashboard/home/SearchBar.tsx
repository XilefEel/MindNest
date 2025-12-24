import { Input } from "@/components/ui/input";
import { saveLastNestling } from "@/lib/storage/nestling";
import { cn } from "@/lib/utils/general";
import { getNestlingIcon } from "@/lib/utils/nestlings";
import { useNestlingActions, useNestlings } from "@/stores/useNestlingStore";
import { useActiveBackgroundId, useActiveNestId } from "@/stores/useNestStore";
import { Search } from "lucide-react";
import { useState } from "react";

export default function SearchBar() {
  const activeNestId = useActiveNestId();
  const activeBackgroundId = useActiveBackgroundId();
  const nestlings = useNestlings();
  const { setActiveNestlingId } = useNestlingActions();

  const [searchQuery, setSearchQuery] = useState("");
  const filteredNestlings = nestlings.filter((nestling) =>
    nestling.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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
            <Search className="absolute top-2.5 left-4 h-5 w-5 text-slate-400" />
            <Input
              placeholder="Search your nestlings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                "h-10 rounded-xl border-0 pl-12 text-base transition-shadow",
                "bg-white text-black placeholder-gray-400",
                "shadow-sm hover:shadow focus:shadow-md",
                "focus:border-teal-500 focus:ring-teal-500",
                "dark:bg-gray-700 dark:text-gray-100",
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
                filteredNestlings.map((nestling) => {
                  const Icon = getNestlingIcon(nestling.nestlingType);
                  return (
                    <div
                      key={nestling.id}
                      onClick={() => handleClick(nestling.id)}
                      className={cn(
                        "flex cursor-pointer flex-row items-center p-2 px-4 transition-all duration-100 hover:bg-gray-100 dark:hover:bg-gray-700",
                        activeBackgroundId &&
                          "hover:bg-white/30 hover:dark:bg-black/30",
                      )}
                    >
                      <div className="flex items-center gap-1">
                        <div className="flex w-6 items-center justify-center">
                          {nestling.icon ? (
                            <p>{nestling.icon}</p>
                          ) : (
                            <Icon className="size-4 flex-shrink-0" />
                          )}
                        </div>

                        <span>{nestling.title}</span>
                      </div>
                    </div>
                  );
                })
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
