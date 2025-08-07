import * as Tooltip from "@radix-ui/react-tooltip";

export function ToolBarItem({
  type,
  onFormat,
  Icon,
  label,
}: {
  type: string;
  onFormat: (type: string) => void;
  Icon: any;
  label: string;
}) {
  return (
    <Tooltip.Provider delayDuration={200}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button
            value={type}
            aria-label={label}
            className="cursor-pointer p-2 transition-all duration-200 hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-300"
            onClick={() => onFormat(type)}
          >
            <Icon className="size-4" />
          </button>
        </Tooltip.Trigger>
        <Tooltip.Content
          side="top"
          sideOffset={8}
          className="data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 relative rounded bg-white px-2 py-1 text-sm text-black shadow-md"
        >
          {label}
        </Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
