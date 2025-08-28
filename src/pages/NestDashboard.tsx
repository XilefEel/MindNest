import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getNestFromId } from "@/lib/nests";
import { Nest } from "@/lib/types";

import Topbar from "@/components/nests/Topbar";
import Sidebar from "@/components/nests/Sidebar";
import Home from "@/components/nests/Home";
import NoteEditor from "@/components/editors/note/NoteEditor";
import { useNestlingTreeStore } from "@/stores/useNestlingStore";
import { getLastNestling, saveLastNestId } from "@/lib/session";
import LoadingScreen from "@/components/LoadingScreen";
import { cn } from "@/lib/utils";
import BoardEditor from "@/components/editors/board/BoardEditor";
import CalendarEditor from "@/components/editors/calendar/CalendarEditor";

export default function NestDashboardPage() {
  const { id } = useParams();
  const [nest, setNest] = useState<Nest | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const { activeNestling, setActiveNestling, setFolderOpen } =
    useNestlingTreeStore();

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
    <div className="flex h-screen cursor-default flex-col bg-gray-50 pb-3 md:pb-6 dark:bg-gray-900">
      <div className="shrink-0 md:px-6">
        <Topbar
          nest={nest}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      </div>
      <div className="mt-6 flex flex-1 overflow-hidden">
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <div
          className={cn(
            "shrink-0 transition-all duration-300 ease-in-out",
            // Mobile
            "w-0 md:w-72",
            // Desktop
            isSidebarCollapsed ? "md:w-0" : "md:w-72",
          )}
        >
          <aside
            className={cn(
              "w-72 transition-transform duration-300 ease-in-out",
              // Mobile
              "fixed top-0 z-40 h-full md:z-0",
              isSidebarOpen ? "translate-x-0" : "-translate-x-full",
              // Desktop
              "md:relative",
              isSidebarCollapsed ? "md:-translate-x-11/12" : "md:translate-x-0",
            )}
            onDoubleClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          >
            <Sidebar
              nestId={nest.id}
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
            />
          </aside>
        </div>

        <main
          className={`flex-1 px-10 md:pr-16 ${
            activeNestling?.nestling_type === "note"
              ? "overflow-hidden"
              : "overflow-y-auto"
          }`}
        >
          {activeNestling && activeNestling.nestling_type === "note" ? (
            <NoteEditor />
          ) : activeNestling && activeNestling?.nestling_type === "board" ? (
            <BoardEditor />
          ) : activeNestling && activeNestling?.nestling_type === "calendar" ? (
            <CalendarEditor />
          ) : (
            <Home nestId={nest.id} />
          )}
        </main>
      </div>
    </div>
  );
}
