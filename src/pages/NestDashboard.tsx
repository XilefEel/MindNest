import { useParams } from "react-router-dom";
import { useState } from "react";
import { Nest } from "@/lib/types/nest";
import {
  useActiveBackgroundId,
  useBackgroundBrightness,
  useBackgrounds,
} from "@/stores/useNestStore";
import { convertFileSrc } from "@tauri-apps/api/core";
import { cn } from "@/lib/utils/general";
import { useActiveNestling } from "@/stores/useNestlingStore";
import Topbar from "@/components/nest-dashboard/topbar/Topbar";
import Sidebar from "@/components/nest-dashboard/sidebar/Sidebar";
import Home from "@/components/nest-dashboard/home/Home";
import LoadingScreen from "@/components/LoadingScreen";
import NoteEditor from "@/components/editors/note/NoteEditor";
import BoardEditor from "@/components/editors/board/BoardEditor";
import CalendarEditor from "@/components/editors/calendar/CalendarEditor";
import GalleryEditor from "@/components/editors/gallery/GalleryEditor";
import useLoadNest from "@/hooks/useLoadNest";
import MindmapEditor from "@/components/editors/mindmap/MindmapEditor";
import FloatingMusicPlayer from "@/components/nest-dashboard/music/FloatingMusicPlayer";
import BookmarkEditor from "@/components/editors/bookmark/BookmarkEditor";
import GlobalModals from "@/components/modals/GlobalModals";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import {
  useSettingsActions,
  useSidebarHidden,
  useSidebarPosition,
  useTopbarHidden,
} from "@/stores/useSettingsStore";
import { NestlingType } from "@/lib/types/nestling";

const editors: Record<NestlingType, React.ComponentType> = {
  note: NoteEditor,
  board: BoardEditor,
  calendar: CalendarEditor,
  gallery: GalleryEditor,
  mindmap: MindmapEditor,
  bookmark: BookmarkEditor,
  database: () => <div>Database Editor</div>,
};

export default function NestDashboardPage() {
  const { id } = useParams();
  const [nest, setNest] = useState<Nest>();
  const [loading, setLoading] = useState(true);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCardHidden, setIsCardHidden] = useState(false);

  const activeNestling = useActiveNestling();
  const backgrounds = useBackgrounds();
  const activeBackgroundId = useActiveBackgroundId();
  const brightness = useBackgroundBrightness();

  const topbarHidden = useTopbarHidden();
  const sidebarHidden = useSidebarHidden();
  const sidebarPosition = useSidebarPosition();
  const { setSetting } = useSettingsActions();

  const ActiveEditor = activeNestling
    ? editors[activeNestling.nestlingType]
    : null;

  const activeBackgroundImage = backgrounds.find(
    (bg) => bg.id === activeBackgroundId,
  );

  const backgroundUrl = activeBackgroundImage
    ? convertFileSrc(activeBackgroundImage.filePath)
    : null;

  const isRight = sidebarPosition === "right";

  const desktopTranslate = sidebarHidden
    ? cn(
        "md:opacity-0",
        isRight ? "md:translate-x-11/12" : "md:-translate-x-11/12",
      )
    : "md:translate-x-0";

  const mobileTranslate = isSidebarOpen
    ? "translate-x-0"
    : isRight
      ? "translate-x-full"
      : "-translate-x-full";

  useLoadNest({ id: Number(id), setNest, setLoading });

  useKeyboardShortcuts({
    nestId: nest?.id || 0,
    isSidebarOpen,
    setIsSidebarOpen,
    isCardHidden,
    setIsCardHidden,
  });

  if (loading) return <LoadingScreen />;
  if (!nest) return <p>Nest not found.</p>;

  return (
    <div
      style={{ scrollbarGutter: "stable" }}
      className="flex h-screen flex-col bg-gray-50 pb-3 select-none dark:bg-gray-900"
      onContextMenu={(e) => e.preventDefault()}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: backgroundUrl ? `url(${backgroundUrl})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: `brightness(${brightness})`,
        }}
      />

      <div
        className={cn(
          "z-10 flex h-full flex-col",
          isCardHidden ? "pointer-events-none opacity-0" : "opacity-100",
        )}
      >
        <nav
          className={cn(
            "shrink-0 transition-[height] duration-300 ease-in-out",
            topbarHidden ? "h-0" : "h-17",
          )}
        >
          <div
            onDoubleClick={() => setSetting("topbarHidden", !topbarHidden)}
            className={cn(
              "transition-transform duration-300",
              topbarHidden ? "-translate-y-full" : "translate-y-0",
            )}
          >
            <Topbar
              nest={nest}
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
            />
          </div>
        </nav>

        <div
          className={cn(
            "flex flex-1 overflow-hidden sm:mt-6",
            sidebarPosition === "right" && "flex-row-reverse",
          )}
        >
          {isSidebarOpen && (
            <div
              className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm md:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          <aside
            className={cn(
              "flex-shrink-0 transition-[width] duration-300 ease-in-out",
              sidebarHidden ? "md:w-0" : "md:w-75",
            )}
          >
            <div
              onDoubleClick={() => setSetting("sidebarHidden", !sidebarHidden)}
              className={cn(
                "w-75 backdrop-blur-sm transition-[translate,opacity] duration-300 ease-in-out",
                "fixed top-0 z-40 h-full md:relative md:z-0",
                isRight ? "right-0" : "left-0",
                desktopTranslate,
                mobileTranslate,
              )}
            >
              <Sidebar nestId={nest.id} setIsSidebarOpen={setIsSidebarOpen} />
            </div>
          </aside>

          <main
            className={cn(
              "relative flex-1 overflow-y-auto px-5 py-3 md:mx-3",
              activeBackgroundId &&
                "rounded-2xl bg-white/30 backdrop-blur-sm dark:bg-black/30",
            )}
          >
            {ActiveEditor && activeNestling ? (
              <ActiveEditor key={activeNestling.id} />
            ) : (
              <Home nestId={nest.id} />
            )}
          </main>
        </div>
      </div>

      <FloatingMusicPlayer />

      <GlobalModals />
    </div>
  );
}
