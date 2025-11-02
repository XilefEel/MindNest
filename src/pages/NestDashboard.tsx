import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Nest } from "@/lib/types/nest";
import { useNestStore } from "@/stores/useNestStore";
import { convertFileSrc } from "@tauri-apps/api/core";
import { cn } from "@/lib/utils/general";
import Topbar from "@/components/nest-dashboard/topbar/Topbar";
import Sidebar from "@/components/nest-dashboard/sidebar/Sidebar";
import Home from "@/components/nest-dashboard/home/Home";
import LoadingScreen from "@/components/LoadingScreen";
import NoteEditor from "@/components/editors/note/NoteEditor";
import BoardEditor from "@/components/editors/board/BoardEditor";
import CalendarEditor from "@/components/editors/calendar/CalendarEditor";
import JournalEditor from "@/components/editors/journal/JournalEditor";
import GalleryEditor from "@/components/editors/gallery/GalleryEditor";
import useRestore from "@/hooks/useRestore";
import useActiveNestling from "@/hooks/useActiveNestling";
import NestlingModal from "@/components/modals/NestlingModal";
import FolderModal from "@/components/modals/FolderModal";
import MindmapEditor from "@/components/editors/mindmap/MindmapEditor";

export default function NestDashboardPage() {
  const { id } = useParams();
  const [nest, setNest] = useState<Nest | null>(null);
  const [loading, setLoading] = useState(true);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isTopbarCollapsed, setIsTopbarCollapsed] = useState(false);
  const [isCardHidden, setIsCardHidden] = useState(false);

  const [isNestlingModalOpen, setIsNestlingModalOpen] = useState(false);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);

  const { activeNestling } = useActiveNestling();
  const { activeBackgroundId, backgrounds } = useNestStore();

  const activeBackgroundImage = backgrounds.find(
    (background) => background.id === activeBackgroundId,
  );

  const backgroundUrl = activeBackgroundImage
    ? convertFileSrc(activeBackgroundImage.filePath)
    : null;

  useRestore({ id, setNest, setLoading });

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();

        switch (e.key) {
          case "t":
            setIsTopbarCollapsed(!isTopbarCollapsed);
            break;

          case "s":
            const isMobile = window.innerWidth < 768;
            if (isMobile) {
              setIsSidebarOpen(!isSidebarOpen);
            } else {
              setIsSidebarCollapsed(!isSidebarCollapsed);
            }
            break;

          case "h":
            setIsCardHidden(!isCardHidden);
            break;

          case "n":
            setIsNestlingModalOpen(!isNestlingModalOpen);
            break;

          case "f":
            setIsFolderModalOpen(!isFolderModalOpen);
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  });

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
      <div
        className={cn(
          "flex h-full flex-col",
          isCardHidden ? "pointer-events-none opacity-0" : "opacity-100",
        )}
      >
        <nav
          className={cn(
            "shrink-0 transition-all duration-300 ease-in-out",
            isTopbarCollapsed ? "h-0" : "h-24",
          )}
        >
          <div
            className={cn(
              "cursor-pointer transition-all duration-300 md:px-6",
              isTopbarCollapsed ? "-translate-y-11/12" : "translate-y-0",
            )}
            onDoubleClick={() => setIsTopbarCollapsed(!isTopbarCollapsed)}
          >
            <Topbar
              nest={nest}
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
            />
          </div>
        </nav>
        <div className="mt-6 flex flex-1 overflow-hidden">
          {isSidebarOpen && (
            <div
              className="fixed inset-0 z-30 bg-black/30 md:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          <aside
            className={cn(
              "shrink-0 transition-all duration-300 ease-in-out",
              // Mobile
              "w-0 md:w-72",
              // Desktop
              isSidebarCollapsed ? "md:w-0" : "md:w-72",
            )}
          >
            <div
              className={cn(
                "w-72 transition-transform duration-300 ease-in-out",
                // Mobile
                "fixed top-0 z-40 h-full md:z-0",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full",
                // Desktop
                "md:relative",
                isSidebarCollapsed
                  ? "md:-translate-x-11/12"
                  : "md:translate-x-0",
              )}
              onDoubleClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            >
              <Sidebar
                nestId={nest.id}
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
              />
            </div>
          </aside>

          <main
            className={cn(
              "mx-3 flex-1 p-5 md:mx-8",
              activeNestling?.nestlingType === "note"
                ? "overflow-hidden"
                : "overflow-y-auto",
              activeBackgroundId
                ? "rounded-2xl bg-white/30 backdrop-blur-sm dark:bg-black/30"
                : "",
            )}
          >
            {activeNestling && activeNestling.nestlingType === "note" ? (
              <NoteEditor key={activeNestling.id} />
            ) : activeNestling && activeNestling?.nestlingType === "board" ? (
              <BoardEditor key={activeNestling.id} />
            ) : activeNestling &&
              activeNestling?.nestlingType === "calendar" ? (
              <CalendarEditor key={activeNestling.id} />
            ) : activeNestling && activeNestling?.nestlingType === "journal" ? (
              <JournalEditor key={activeNestling.id} />
            ) : activeNestling && activeNestling?.nestlingType === "gallery" ? (
              <GalleryEditor key={activeNestling.id} />
            ) : activeNestling?.nestlingType === "mindmap" ? (
              <MindmapEditor key={activeNestling.id} />
            ) : (
              <Home nestId={nest.id} />
            )}
          </main>
        </div>
      </div>
      <NestlingModal
        nestId={nest.id}
        isOpen={isNestlingModalOpen}
        setIsOpen={setIsNestlingModalOpen}
      >
        <div />
      </NestlingModal>
      <FolderModal
        nestId={nest.id}
        isOpen={isFolderModalOpen}
        setIsOpen={setIsFolderModalOpen}
      >
        <div />
      </FolderModal>
    </div>
  );
}
