import { cn } from "@/lib/utils/general";
import { useNestlingStore } from "@/stores/useNestlingStore";
import { useNestStore } from "@/stores/useNestStore";

export default function StatsSection() {
  const { nestlings, folders } = useNestlingStore();
  const { backgrounds, activeBackgroundId } = useNestStore();

  const stats = [
    { label: "Nestlings", value: nestlings.length, icon: "🪺" },
    { label: "Folders", value: folders.length, icon: "📁" },
    { label: "Backgrounds", value: backgrounds.length, icon: "🖼️" },
  ];

  return (
    <section className="grid grid-cols-2 gap-5 md:grid-cols-3">
      {stats.map((stat, i) => (
        <div
          key={i}
          className={cn(
            "flex flex-col items-center justify-center rounded-2xl",
            "group cursor-pointer rounded-xl border border-b-4 p-4 hover:shadow-md",
            "bg-white dark:bg-gray-800",
            "border-gray-200 border-b-orange-500 hover:border-orange-500 dark:border-gray-800 dark:border-b-orange-500 dark:hover:hover:border-orange-500",
            "transition hover:scale-105",
            activeBackgroundId &&
              "border-t-0 border-r-0 border-l-0 bg-white/10 backdrop-blur-sm dark:bg-black/10",
          )}
        >
          <div className="mb-3 text-4xl">{stat.icon}</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {stat.value}
          </div>
          <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
        </div>
      ))}
    </section>
  );
}
