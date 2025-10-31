import { ArrowRight, Folder, Pin } from "lucide-react";

export default function PinnedSection() {
  const pinned = [
    { title: "🌱 July 24 Journal", folder: "Daily Logs" },
    { title: "💡 Project Ideas", folder: "Personal Projects" },
  ];
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-gradient-to-br from-pink-400 to-pink-500 p-2 shadow-md">
          <Pin className="h-5 w-5 text-white" />
        </div>
        <h2 className="text-2xl font-bold">Pinned Nestlings</h2>
      </div>

      <div className="space-y-3">
        {pinned.map((item, i) => (
          <div
            key={i}
            className="group cursor-pointer rounded-xl border border-l-4 border-slate-200 border-l-pink-500 bg-white p-4 transition hover:scale-105 hover:border-pink-500 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {item.title}
                </p>
                <div className="mt-1 flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                  <Folder className="h-4 w-4" />
                  <span>{item.folder}</span>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-slate-300 transition" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
