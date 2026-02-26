import { cn } from "@/lib/utils/general";
import { useActiveBackgroundId } from "@/stores/useNestStore";
import { NestlingType, Nestling } from "@/lib/types/nestling";
import { nestlingTypes } from "@/lib/utils/nestlings";

export default function NestlingPopover({
  nestlings,
}: {
  nestlings: Nestling[];
}) {
  const activeBackgroundId = useActiveBackgroundId();

  const nestlingTypeCount = nestlings.reduce(
    (acc, nestling) => {
      acc[nestling.nestlingType] = (acc[nestling.nestlingType] || 0) + 1;
      return acc;
    },
    {} as Record<NestlingType, number>,
  );

  return (
    <div>
      <div className="mb-4 gap-1">
        <h2 className="text-lg font-semibold">Nestlings Breakdown</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Total nestlings per type
        </p>
      </div>
      <div className="flex flex-col gap-2">
        {nestlings.length > 0 ? (
          nestlingTypes
            .filter((nestling) => nestlingTypeCount[nestling.value] > 0)
            .map((nestling) => {
              const Icon = nestling.icon;
              const count = nestlingTypeCount[nestling.value];

              return (
                <div
                  key={nestling.value}
                  className={cn(
                    "flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-700/50",
                    activeBackgroundId && "bg-white/30 dark:bg-black/30",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn("rounded p-1.5", nestling.color)}>
                      <Icon className="size-4 text-white" />
                    </div>
                    <span className="text-sm">{nestling.label}</span>
                  </div>
                  <span
                    className={cn(
                      "flex size-6 items-center justify-center rounded-full bg-gray-200/50 text-sm font-semibold dark:bg-gray-600",
                      activeBackgroundId && "bg-black/5 dark:bg-white/10",
                    )}
                  >
                    {count}
                  </span>
                </div>
              );
            })
        ) : (
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            No nestlings yet
          </p>
        )}
      </div>
    </div>
  );
}
