import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getNestFromId } from "@/lib/nests";
import { Nest } from "@/lib/types";

import Topbar from "@/components/nests/Topbar";
import Sidebar from "@/components/nests/Sidebar";
import Home from "@/components/nests/Home";
import SettingsModal from "@/components/modals/SettingsModal";

export default function NestDashboardPage() {
  const { id } = useParams();
  const [nest, setNest] = useState<Nest | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    async function fetchNest() {
      try {
        const data = await getNestFromId(Number(id));
        setNest(data);
      } catch (error) {
        console.error("Failed to fetch nest", error);
      } finally {
        setLoading(false);
      }
    }

    fetchNest();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!nest) return <p>Nest not found.</p>;

  return (
    <div className="flex h-screen cursor-default flex-col bg-gray-50 px-6 pb-6 dark:bg-gray-900">
      <div className="shrink-0">
        <Topbar nest={nest} setIsSettingsOpen={setIsSettingsOpen} />
      </div>
      <div className="mt-6 flex flex-1 gap-6 overflow-hidden">
        <aside className="h-full w-72 overflow-y-auto">
          <Sidebar nestId={nest.id} />
        </aside>
        <main className="flex-1 overflow-y-auto px-6 pb-6">
          <Home id={nest.id} />
        </main>
      </div>
      {isSettingsOpen && (
        <SettingsModal setIsSettingsOpen={setIsSettingsOpen} />
      )}
    </div>
  );
}
