import { useState } from "react";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "../ui/command";
import { useActiveBackgroundId, useActiveNestId } from "@/stores/useNestStore";
import { cn } from "@/lib/utils/general";
import { useNestlingActions, useNestlings } from "@/stores/useNestlingStore";
import { getNestlingIcon } from "@/lib/utils/nestlings";
import { saveLastNestling } from "@/lib/storage/session";

export default function SearchModal({
  isOpen,
  setIsOpen,
}: {
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
}) {
  const activeNestId = useActiveNestId();
  const activeBackgroundId = useActiveBackgroundId();
  const nestlings = useNestlings();
  const { setActiveNestlingId } = useNestlingActions();

  const [searchQuery, setSearchQuery] = useState("");
  const filteredNestlings = nestlings.filter((nestling) =>
    nestling.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSelectNestling = (nestlingId: number) => {
    setActiveNestlingId(nestlingId);
    saveLastNestling(activeNestId!, nestlingId);
    setSearchQuery("");
    setIsOpen?.(false);
  };

  const [internalOpen, setInternalOpen] = useState(false);
  const isActuallyOpen = isOpen ?? internalOpen;
  const setOpen = setIsOpen ?? setInternalOpen;

  return (
    <CommandDialog
      open={isActuallyOpen}
      onOpenChange={setOpen}
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
        <CommandGroup heading="📌 Pinned Nestlings">
          {filteredNestlings
            .filter((nestling) => nestling.isPinned)
            .map((nestling) => {
              const Icon = getNestlingIcon(nestling.nestlingType);
              return (
                <CommandItem
                  key={nestling.id}
                  onSelect={() => handleSelectNestling(nestling.id)}
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
                        <Icon className="flex-shrink-0" />
                      )}
                    </div>

                    <span>{nestling.title}</span>
                  </div>
                </CommandItem>
              );
            })}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="🪺 Nestlings">
          {filteredNestlings.length > 0 &&
            filteredNestlings.map((nestling) => {
              const Icon = getNestlingIcon(nestling.nestlingType);
              return (
                <CommandItem
                  key={nestling.id}
                  onSelect={() => handleSelectNestling(nestling.id)}
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
                        <Icon className="flex-shrink-0" />
                      )}
                    </div>

                    <span>{nestling.title}</span>
                  </div>
                </CommandItem>
              );
            })}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
