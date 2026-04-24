import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandSeparator,
  CommandItem,
} from "../ui/command";
import { useActiveBackgroundId } from "@/stores/useNestStore";
import { cn } from "@/lib/utils/general";
import { useSearchModal } from "@/stores/useModalStore";
import SearchItem from "./SearchItem";
import { useNestlingSearch } from "@/hooks/useNestlingSearch.ts";
import { FileText, Pin } from "lucide-react";
import { useRecentNestlings } from "@/hooks/useRecentNestlings";
import { openNestling } from "@/lib/utils/nestlings";
import { Nestling } from "@/lib/types/nestling";

export default function SearchModal() {
  const activeBackgroundId = useActiveBackgroundId();
  const { recentNestlings } = useRecentNestlings();

  const { isSearchOpen, setIsSearchOpen } = useSearchModal();

  const { searchQuery, setSearchQuery, filteredNestlings } =
    useNestlingSearch();

  const handleSelectNestling = (nestling: Nestling) => {
    openNestling(nestling);
    setSearchQuery("");
    setIsSearchOpen?.(false);
  };

  const visibleNestlings =
    searchQuery.trim() === "" ? recentNestlings : filteredNestlings;

  const pinnedNestlings = filteredNestlings.filter((n) => n.isPinned);
  const regularNestlings = visibleNestlings.filter((n) => !n.isPinned);

  return (
    <CommandDialog
      open={isSearchOpen}
      onOpenChange={setIsSearchOpen}
      className={cn(
        "rounded-lg border-0 bg-white p-0 shadow-md select-none md:min-w-[600px] dark:bg-gray-800",
        activeBackgroundId && "bg-white/50 backdrop-blur-sm dark:bg-black/30",
      )}
    >
      <div className="relative">
        <CommandInput
          placeholder="Search your nestlings..."
          value={searchQuery}
          onValueChange={(value) => setSearchQuery(value)}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
        />
        {!searchQuery && (
          <span className="pointer-events-none absolute top-1/2 right-10 -translate-y-1/2 text-xs text-gray-400">
            type # to filter by tags
          </span>
        )}
      </div>

      <CommandList>
        <CommandEmpty className="p-6 text-center text-sm text-gray-400 dark:text-gray-500">
          No nestlings matched "{searchQuery}"
        </CommandEmpty>

        {pinnedNestlings.length > 0 && (
          <CommandGroup
            heading={
              <div className="flex flex-row items-center gap-2">
                <div className="rounded-lg bg-linear-to-r from-pink-400 to-pink-500 p-1.5 text-white">
                  <Pin size={14} />
                </div>
                <p className="text-sm">Pinned Nestlings</p>
              </div>
            }
          >
            {pinnedNestlings.map((nestling) => (
              <CommandItem
                key={nestling.id}
                value={String(nestling.id)}
                onSelect={() => handleSelectNestling(nestling)}
                className={cn(
                  "flex flex-row items-center justify-between px-4 py-2 transition-colors",
                  "data-[selected=true]:bg-gray-50 dark:data-[selected=true]:bg-gray-700/50",
                  activeBackgroundId &&
                    "data-[selected=true]:bg-black/5 dark:data-[selected=true]:bg-white/5",
                )}
              >
                <SearchItem nestling={nestling} />
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        <CommandSeparator className="my-1" />

        {regularNestlings.length > 0 && (
          <CommandGroup
            heading={
              <div className="flex flex-row items-center gap-2">
                <div className="rounded-lg bg-linear-to-r from-teal-400 to-teal-500 p-1.5 text-white">
                  <FileText size={14} />
                </div>
                <p className="text-sm">
                  {searchQuery.trim() === "" ? "Recent Nestlings" : "Nestlings"}
                </p>
              </div>
            }
          >
            {regularNestlings.map((nestling) => (
              <CommandItem
                key={nestling.id}
                value={String(nestling.id)}
                onSelect={() => handleSelectNestling(nestling)}
                className={cn(
                  "flex flex-row items-center justify-between px-4 py-2 transition-colors",
                  "data-[selected=true]:bg-gray-50 dark:data-[selected=true]:bg-gray-700/50",
                  activeBackgroundId &&
                    "data-[selected=true]:bg-black/5 dark:data-[selected=true]:bg-white/5",
                )}
              >
                <SearchItem nestling={nestling} />
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
