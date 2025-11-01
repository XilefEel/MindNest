import { cn } from "@/lib/utils/general";
import { useNestStore } from "@/stores/useNestStore";
import { ArrowRight, Clock, Folder } from "lucide-react";

export default function RecentSection() {
  const { activeBackgroundId } = useNestStore();
  const recent = [
    { title: "🧠 MindMap Sketch", folder: "Creative Notes" },
    { title: "📓 September Review", folder: "Journals" },
    { title: "🎯 Weekly Goals", folder: "Planning" },
  ];
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-gradient-to-br from-blue-400 to-blue-500 p-2 shadow-md">
          <Clock className="h-5 w-5 text-white" />
        </div>
        <h2 className="text-xl font-bold md:text-2xl">Recent Nestlings</h2>
      </div>

      <div className="space-y-3">
        {recent.map((item, i) => (
          <div
            key={i}
            className={cn(
              "group cursor-pointer rounded-xl border border-l-4 p-4 hover:shadow-md",
              "bg-white dark:bg-gray-800",
              "border-gray-200 border-l-blue-500 hover:border-blue-500 dark:border-gray-800 dark:border-l-blue-500 dark:hover:hover:border-blue-500",
              "transition hover:scale-105",
              activeBackgroundId &&
                "bg-white/10 backdrop-blur-sm dark:bg-black/10",
            )}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {item.title}
                </p>
                <div className="mt-1 flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                  <Folder className="h-4 w-4" />
                  <span>{item.folder}</span>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-300 transition" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
