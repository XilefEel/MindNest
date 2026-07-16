import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
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

export type SlashCommandMenuHandle = {
  onKeyDown: (props: SuggestionKeyDownProps) => boolean;
};

export const SlashCommandMenu = forwardRef<
  SlashCommandMenuHandle,
  SuggestionProps<CommandItemType>
>(({ items, command, clientRect }, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    setSelectedIndex(0);
  }, [items]);

  useEffect(() => {
    const r = clientRect?.();
    if (r) setRect(r as DOMRect);
  }, [clientRect, items]);

  const selectItem = (index: number) => {
    const item = items[index];
    if (item) command(item);
  };

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: SuggestionKeyDownProps) => {
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

  if (!rect) return null;

  return createPortal(
    <div
      style={{
        position: "fixed",
        top: rect.bottom + 6,
        left: rect.left,
        zIndex: 50,
      }}
    >
      <Command
        shouldFilter={false}
        className="w-60 rounded-md border shadow-md"
      >
        <CommandList>
          <CommandEmpty>No matching blocks.</CommandEmpty>

          <CommandGroup>
            {items.map((item, index) => {
              const Icon = item.icon;
              return (
                <CommandItem
                  key={item.title}
                  value={item.title}
                  onSelect={() => selectItem(index)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <Icon className="size-4 shrink-0" />

                  <span className="text-sm leading-tight font-medium">
                    {item.title}
                  </span>
                </CommandItem>
              );
            })}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>,
    document.body,
  );
});
