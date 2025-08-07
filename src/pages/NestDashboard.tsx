import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getNestFromId } from "@/lib/nests";
import { Nest } from "@/lib/types";

import Topbar from "@/components/nests/Topbar";
import Sidebar from "@/components/nests/Sidebar";
import Home from "@/components/nests/Home";
import NoteEditor from "@/components/editors/NoteEditor";
import { useNestlingTreeStore } from "@/stores/useNestlingStore";
import { getLastNestling, saveLastNestId } from "@/lib/session";
import LoadingScreen from "@/components/LoadingScreen";

export default function NestDashboardPage() {
  const { id } = useParams();
  const [nest, setNest] = useState<Nest | null>(null);
  const [loading, setLoading] = useState(true);

  const activeNestling = useNestlingTreeStore((s) => s.activeNestling);
  const setActiveNestling = useNestlingTreeStore((s) => s.setActiveNestling);
  const setFolderOpen = useNestlingTreeStore((s) => s.setFolderOpen);

  useEffect(() => {
    async function fetchNest() {
      const restoreLastNestling = async () => {
        const lastNestling = await getLastNestling();
        if (lastNestling && Number(id) === lastNestling.nest_id) {
          setActiveNestling(lastNestling);
          if (lastNestling.folder_id) {
            setFolderOpen(lastNestling.folder_id, true);
          }
        }
      };

      restoreLastNestling();

      try {
        const data = await getNestFromId(Number(id));
        setNest(data);
        saveLastNestId(data.id);
      } catch (error) {
        console.error("Failed to fetch nest", error);
      } finally {
        setLoading(false);
      }
    }

    fetchNest();
  }, [id]);

  if (loading) return <LoadingScreen />;
  if (!nest) return <p>Nest not found.</p>;

  return (
    <div className="flex h-screen cursor-default flex-col bg-gray-50 px-6 pb-6 dark:bg-gray-900">
      <div className="shrink-0">
        <Topbar nest={nest} />
      </div>
      <div className="mt-6 flex flex-1 gap-6 overflow-hidden">
        <Sidebar nestId={nest.id} />
        <main
          className={`flex-1 px-6 ${
            activeNestling?.nestling_type === "note"
              ? "overflow-hidden"
              : "overflow-y-auto"
          }`}
        >
          {activeNestling && activeNestling.nestling_type === "note" ? (
            <NoteEditor />
          ) : (
            <Home nestId={nest.id} />
          )}
        </main>
      </div>
    </div>
  );
}
