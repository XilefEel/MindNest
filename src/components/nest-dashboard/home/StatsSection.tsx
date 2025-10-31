export default function StatsSection() {
  const stats = [
    { label: "Nestlings", value: 24, icon: "🪺" },
    { label: "Folders", value: 5, icon: "📁" },
    { label: "Backgrounds", value: 12, icon: "🖼️" },
  ];
  return (
    <section className="grid gap-5 sm:grid-cols-3">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="flex flex-col items-center justify-center rounded-2xl border border-b-4 border-slate-200 border-b-orange-500 bg-white p-8 transition hover:scale-105 hover:border-orange-500 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="mb-3 text-4xl">{stat.icon}</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {stat.value}
          </div>
          <div className="text-slate-600 dark:text-slate-400">{stat.label}</div>
        </div>
      ))}
    </section>
  );
}
