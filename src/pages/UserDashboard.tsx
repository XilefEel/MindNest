import Sidebar from "@/components/user-dashboard/sidebar/Sidebar";
import HomeSection from "@/components/user-dashboard/sections/HomeSection";
import NestSection from "@/components/user-dashboard/sections/NestSection";
import SharedSection from "@/components/user-dashboard/sections/SharedSection";
import ExploreSection from "@/components/user-dashboard/sections/DiscoverSection";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils/general";
import GlobalModals from "@/components/modals/GlobalModals";

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState<
    "home" | "nests" | "shared" | "explore"
  >("home");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleToggleActive = (
    section: "home" | "nests" | "shared" | "explore",
  ) => {
    setActiveSection(section);
    setIsSidebarOpen(false);
  };

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isSidebarOpen]);

  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      className="flex h-screen overflow-hidden bg-gray-50 text-gray-800 select-none dark:bg-zinc-900 dark:text-white"
    >
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      <aside
        className={cn(
          "shrink-0 transition-[width] duration-300 ease-in-out",
          "w-0 md:w-64",
          isSidebarCollapsed ? "md:w-[76px]" : "md:w-64",
        )}
      >
        <div
          onDoubleClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className={cn(
            "fixed top-0 left-0 z-50 flex w-64 flex-col transition-transform duration-300 ease-in-out md:transition-[width]",
            isSidebarCollapsed ? "md:w-[76px]" : "md:w-64",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full",
            "md:relative md:flex md:translate-x-0",
          )}
        >
          <Sidebar
            activeSection={activeSection}
            setActiveSection={handleToggleActive}
            isCollapsed={isSidebarCollapsed}
          />
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="p-4 md:hidden">
          <button
            className="rounded-md bg-white p-2 transition-colors hover:bg-gray-100 dark:bg-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-600"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto px-6">
          {activeSection && activeSection === "home" ? (
            <HomeSection />
          ) : activeSection === "nests" ? (
            <NestSection />
          ) : activeSection === "shared" ? (
            <SharedSection />
          ) : activeSection === "explore" ? (
            <ExploreSection />
          ) : null}
        </main>
      </div>

      <GlobalModals />
    </div>
  );
}
