import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandSeparator,
  CommandItem,
} from "../ui/command";
import { useActiveBackgroundId, useActiveNestId } from "@/stores/useNestStore";
import { cn } from "@/lib/utils/general";
import { useNestlingActions } from "@/stores/useNestlingStore";
import { saveLastNestling } from "@/lib/storage/nestling";
import { useSearchModal } from "@/stores/useModalStore";
import SearchItem from "./SearchItem";
import { useNestlingSearch } from "@/hooks/useNestlingSearch.ts";

export default function SearchModal() {
  const activeNestId = useActiveNestId();
  const activeBackgroundId = useActiveBackgroundId();
  const { setActiveNestlingId } = useNestlingActions();

  const { isSearchOpen, setIsSearchOpen } = useSearchModal();

  const { searchQuery, setSearchQuery, filteredNestlings } =
    useNestlingSearch();

  const handleSelectNestling = (nestlingId: number) => {
    setActiveNestlingId(nestlingId);
    saveLastNestling(activeNestId!, nestlingId);
    setSearchQuery("");
    setIsSearchOpen?.(false);
  };

  return (
    <CommandDialog
      open={isSearchOpen}
      onOpenChange={setIsSearchOpen}
      className={cn(
        "rounded-lg border-0 bg-white p-0 shadow-md md:min-w-[600px] dark:bg-gray-800",
        activeBackgroundId && "bg-white/50 backdrop-blur-sm dark:bg-black/30",
      )}
    >
      <div className="relative">
        <CommandInput
          placeholder="Search your nestlings..."
          value={searchQuery}
          onValueChange={(value) => setSearchQuery(value)}
        />
        {!searchQuery && (
          <span className="pointer-events-none absolute top-1/2 right-10 -translate-y-1/2 text-xs text-gray-400">
            type # to filter by tags
          </span>
        )}
      </div>
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {filteredNestlings.length > 0 && (
          <CommandGroup
            heading={<span className="text-base">📌 Pinned Nestlings</span>}
          >
            {filteredNestlings
              .filter((nestling) => nestling.isPinned)
              .map((nestling) => (
                <CommandItem
                  key={nestling.id}
                  value={String(nestling.id)}
                  onSelect={() => handleSelectNestling(nestling.id)}
                  className={cn(
                    "flex flex-row items-center justify-between p-2 px-4 transition-colors",
                    "data-[selected=true]:bg-gray-100 dark:data-[selected=true]:bg-gray-700",
                    activeBackgroundId &&
                      "data-[selected=true]:bg-white/30 dark:data-[selected=true]:bg-black/30",
                  )}
                >
                  <SearchItem nestling={nestling} />
                </CommandItem>
              ))}
          </CommandGroup>
        )}
        <CommandSeparator className="my-1" />

        {filteredNestlings.length > 0 && (
          <CommandGroup
            heading={<span className="text-base">🪺 Nestlings</span>}
          >
            {filteredNestlings.length > 0 &&
              filteredNestlings
                .filter((nestling) => !nestling.isPinned)
                .map((nestling) => (
                  <CommandItem
                    key={nestling.id}
                    value={String(nestling.id)}
                    onSelect={() => handleSelectNestling(nestling.id)}
                    className={cn(
                      "flex flex-row items-center justify-between p-2 px-4 transition-colors",
                      "data-[selected=true]:bg-gray-100 dark:data-[selected=true]:bg-gray-700",
                      activeBackgroundId &&
                        "data-[selected=true]:bg-white/30 dark:data-[selected=true]:bg-black/30",
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
