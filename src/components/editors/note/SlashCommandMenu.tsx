import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
} from "@floating-ui/react";
import {
  Command,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import type {
  SuggestionKeyDownProps,
  SuggestionProps,
} from "@tiptap/suggestion";
import type { CommandItemType } from "@/lib/utils/note";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils/general";
import { useActiveBackgroundId } from "@/stores/useNestStore";

export type SlashCommandMenuHandle = {
  onKeyDown: (props: SuggestionKeyDownProps) => boolean;
};

export const SlashCommandMenu = forwardRef<
  SlashCommandMenuHandle,
  SuggestionProps<CommandItemType>
>(({ items, command, clientRect, editor }, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const activeBackgroundId = useActiveBackgroundId();

  const groups = items.reduce<
    {
      group: string;
      items: { item: CommandItemType; index: number }[];
    }[]
  >((acc, item, index) => {
    const groupName = item.group ?? "Other";
    let bucket = acc.find((g) => g.group === groupName);
    if (!bucket) {
      bucket = { group: groupName, items: [] };
      acc.push(bucket);
    }
    bucket.items.push({ item, index });
    return acc;
  }, []);

  const { refs, floatingStyles, isPositioned } = useFloating({
    placement: "bottom-start",
    middleware: [offset(6), flip({ padding: 8 }), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  });

  const selectItem = (index: number) => {
    const item = items[index];
    if (item) command(item);
  };

  useEffect(() => {
    if (!editor) return;

    const scrollContainer = editor.view.dom.closest(
      "[data-editor-scroll-container]",
    ) as HTMLElement;
    scrollContainer.style.overflow = "hidden";

    return () => {
      scrollContainer.style.overflow = "auto";
    };
  }, [editor]);

  useEffect(() => {
    if (!clientRect) return;

    refs.setPositionReference({
      getBoundingClientRect: () => clientRect() ?? new DOMRect(),
    });
  }, [clientRect, refs, editor]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: SuggestionKeyDownProps) => {
      if (!items.length) return false;

      if (event.key === "ArrowUp") {
        setSelectedIndex((i) => (i + items.length - 1) % items.length);
        return true;
      }
      if (event.key === "ArrowDown") {
        setSelectedIndex((i) => (i + 1) % items.length);
        return true;
      }
      if (event.key === "Enter") {
        selectItem(selectedIndex);
        return true;
      }
      if (event.key === "Escape") {
        return true;
      }
      return false;
    },
  }));

  return createPortal(
    <div
      ref={refs.setFloating}
      style={{
        ...floatingStyles,
        visibility: isPositioned ? "visible" : "hidden",
        zIndex: 50,
      }}
    >
      <Command
        shouldFilter={false}
        className={cn(
          "max-h-75 w-60 overflow-y-auto rounded-lg border border-zinc-200 bg-white p-2 shadow-md select-none dark:border-zinc-700 dark:bg-zinc-800",
          activeBackgroundId &&
            "border-0 bg-white/50 backdrop-blur-sm dark:bg-black/30",
        )}
      >
        <CommandList>
          <CommandEmpty className="p-4 text-center text-sm text-zinc-400 dark:text-zinc-500">
            No matching blocks.
          </CommandEmpty>

          {groups.map(({ group, items: groupItems }) => (
            <CommandGroup key={group} heading={group} className="p-0">
              {groupItems.map(({ item, index }) => (
                <CommandItem
                  key={item.title + index}
                  value={item.title}
                  onSelect={() => selectItem(index)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={cn(
                    "flex items-center transition-[background]",
                    index === selectedIndex
                      ? activeBackgroundId
                        ? "bg-black/5 dark:bg-white/5"
                        : "bg-zinc-50 dark:bg-zinc-700/50"
                      : "",
                  )}
                >
                  <item.Icon className="size-4 shrink-0" />
                  <span className="text-sm leading-tight">{item.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </Command>
    </div>,
    document.body,
  );
});
