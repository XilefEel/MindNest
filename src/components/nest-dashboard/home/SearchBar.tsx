import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <section>
      <div className="relative">
        <Search className="absolute top-2.5 left-4 h-5 w-5 text-slate-400" />
        <Input
          placeholder="Search your nestlings..."
          className="h-10 rounded-xl border-slate-200 pl-12 text-base focus:ring-teal-500 dark:border-slate-700"
        />
      </div>
    </section>
  );
}
