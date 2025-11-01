import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/general";
import { useNestStore } from "@/stores/useNestStore";
import { Search } from "lucide-react";

export default function SearchBar() {
  const { activeBackgroundId } = useNestStore();
  return (
    <section>
      <div className="relative">
        <Search className="absolute top-2.5 left-4 h-5 w-5 text-slate-400" />
        <Input
          placeholder="Search your nestlings..."
          className={cn(
            "h-10 rounded-xl border-0 pl-12 text-base transition-shadow",
            "bg-white text-black placeholder-gray-400",
            "shadow-sm hover:shadow focus:shadow-md",
            "focus:border-teal-500 focus:ring-teal-500",
            "dark:bg-gray-700 dark:text-gray-100",
            "dark:focus:border-teal-400 dark:focus:ring-teal-400",
            activeBackgroundId &&
              "bg-white/10 backdrop-blur-sm dark:bg-black/10",
          )}
        />
      </div>
    </section>
  );
}
