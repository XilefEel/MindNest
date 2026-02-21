import { Globe } from "lucide-react";
import { Button } from "../../ui/button";
import DiscoverCard from "../DiscoverCard";

export default function DiscoverPreview() {
  return (
    <div className="flex flex-col gap-2 rounded-lg border-l-4 border-blue-500 bg-white p-6 shadow dark:bg-gray-800">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
          <Globe className="text-white" size={20} />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Discover Public Nests</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Explore popular community collections
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <DiscoverCard />
        <DiscoverCard />
        <DiscoverCard />
      </div>
      <Button className="mt-5 flex w-full items-center gap-2 bg-blue-400 text-white hover:bg-blue-500">
        Discover More Nests
      </Button>
    </div>
  );
}
