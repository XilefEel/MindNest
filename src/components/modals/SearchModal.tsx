import { useState } from "react";
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
import { useNestlingActions, useNestlings } from "@/stores/useNestlingStore";
import { saveLastNestling } from "@/lib/storage/nestling";
import { useSearchModal } from "@/stores/useModalStore";
import SearchItem from "./SearchItem";

export default function SearchModal() {
  const activeNestId = useActiveNestId();
  const activeBackgroundId = useActiveBackgroundId();
  const nestlings = useNestlings();
  const { setActiveNestlingId } = useNestlingActions();

  const { isSearchOpen, setIsSearchOpen } = useSearchModal();

  const [searchQuery, setSearchQuery] = useState("");
  const filteredNestlings = nestlings.filter((nestling) =>
    nestling.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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
      <CommandInput
        placeholder="Search your nestlings..."
        value={searchQuery}
        onValueChange={(value) => setSearchQuery(value)}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup
          heading={<span className="text-base">📌 Pinned Nestlings</span>}
        >
          {filteredNestlings
            .filter((nestling) => nestling.isPinned)
            .map((nestling) => (
              <CommandItem
                key={nestling.id}
                onSelect={() => handleSelectNestling(nestling.id)}
                className={cn(
                  "flex cursor-pointer flex-row items-center justify-between p-2 px-4 transition-all duration-100 hover:bg-gray-100 dark:hover:bg-gray-700",
                  activeBackgroundId &&
                    "hover:bg-white/30 hover:dark:bg-black/30",
                )}
              >
                <SearchItem key={nestling.id} nestling={nestling} />
              </CommandItem>
            ))}
        </CommandGroup>
        <CommandSeparator className="my-1" />
        <CommandGroup heading={<span className="text-base">🪺 Nestlings</span>}>
          {filteredNestlings.length > 0 &&
            filteredNestlings.map((nestling) => (
              <CommandItem
                key={nestling.id}
                onSelect={() => handleSelectNestling(nestling.id)}
                className={cn(
                  "flex cursor-pointer flex-row items-center justify-between p-2 px-4 transition-all duration-100 hover:bg-gray-100 dark:hover:bg-gray-700",
                  activeBackgroundId &&
                    "hover:bg-white/30 hover:dark:bg-black/30",
                )}
              >
                <SearchItem key={nestling.id} nestling={nestling} />
              </CommandItem>
            ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
