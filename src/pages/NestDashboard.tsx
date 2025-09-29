import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getNestFromId } from "@/lib/api/nests";
import { Nest } from "@/lib/types/nests";
import { useNestlingTreeStore } from "@/stores/useNestlingStore";
import { getLastNestling, saveLastNestId } from "@/lib/storage/session";
import { cn } from "@/lib/utils/general";
import Topbar from "@/components/nest-dashboard/Topbar";
import Sidebar from "@/components/nest-dashboard/Sidebar";
import Home from "@/components/nest-dashboard/Home";
import LoadingScreen from "@/components/LoadingScreen";
import NoteEditor from "@/components/editors/note/NoteEditor";
import BoardEditor from "@/components/editors/board/BoardEditor";
import CalendarEditor from "@/components/editors/calendar/CalendarEditor";
import JournalEditor from "@/components/editors/journal/JournalEditor";
import GalleryEditor from "@/components/editors/gallery/GalleryEditor";
import { useNestStore } from "@/stores/useNestStore";
import { convertFileSrc } from "@tauri-apps/api/core";
import { getLastBackgroundImage } from "@/lib/storage/session";

export default function NestDashboardPage() {
  const { id } = useParams();
  const [nest, setNest] = useState<Nest | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const { activeNestling, setActiveNestling, setFolderOpen } =
    useNestlingTreeStore();
  const {
    activeNestId,
    activeBackgroundId,
    backgrounds,
    setActiveNestId,
    setActiveBackgroundId,
    fetchBackgrounds,
  } = useNestStore();

  const activeBackgroundImage = backgrounds.find(
    (background) => background.id === activeBackgroundId,
  );

  const backgroundUrl = activeBackgroundImage
    ? convertFileSrc(activeBackgroundImage.file_path)
    : null;

  useEffect(() => {
    async function fetchNest() {
      setLoading(true);

      try {
        //fetch last nest
        const lastNest = await getNestFromId(Number(id));
        setNest(lastNest);
        setActiveNestId(lastNest.id);
        await saveLastNestId(lastNest.id);

        // fetch last nestling
        const [lastNestling, lastBackgroundImage] = await Promise.all([
          getLastNestling(),
          getLastBackgroundImage(lastNest.id),
        ]);

        if (lastBackgroundImage != null) {
          setActiveBackgroundId(lastBackgroundImage);
        }

        if (lastNestling && Number(id) === lastNestling.nest_id) {
          setActiveNestling(lastNestling);
          if (lastNestling.folder_id) {
            setFolderOpen(lastNestling.folder_id, true);
          }
        }

        // fetch all backgrounds for this nest
        await fetchBackgrounds(lastNest.id);
      } catch (error) {
        console.error("Failed to fetch nest", error);
      } finally {
        setLoading(false);
      }
    }

    fetchNest();
  }, [id]);

  useEffect(() => {
    fetchBackgrounds(activeNestId!);
  }, [activeNestId]);

  if (loading) return <LoadingScreen />;
  if (!nest) return <p>Nest not found.</p>;

  return (
    <div
      style={{
        backgroundImage: backgroundUrl ? `url(${backgroundUrl})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className="flex h-screen cursor-default flex-col bg-gray-50 pb-3 md:pb-6 dark:bg-gray-900"
    >
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
          className={`flex-1 px-2 md:px-10 ${
            activeNestling?.nestling_type === "note"
              ? "overflow-hidden"
              : "overflow-y-auto"
          }`}
        >
          {activeNestling && activeNestling.nestling_type === "note" ? (
            <NoteEditor key={activeNestling.id} />
          ) : activeNestling && activeNestling?.nestling_type === "board" ? (
            <BoardEditor key={activeNestling.id} />
          ) : activeNestling && activeNestling?.nestling_type === "calendar" ? (
            <CalendarEditor key={activeNestling.id} />
          ) : activeNestling && activeNestling?.nestling_type === "journal" ? (
            <JournalEditor key={activeNestling.id} />
          ) : activeNestling && activeNestling?.nestling_type === "gallery" ? (
            <GalleryEditor key={activeNestling.id} />
          ) : (
            <Home nestId={nest.id} />
          )}
        </main>
      </div>
    </div>
  );
}
