import Sidebar from "@/components/user-dashboard/sidebar/Sidebar";
import HomeSection from "@/components/user-dashboard/sections/HomeSection";
import NestSection from "@/components/user-dashboard/sections/NestSection";
import SharedSection from "@/components/user-dashboard/sections/SharedSection";
import ExploreSection from "@/components/user-dashboard/sections/DiscoverSection";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils/general";

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState<
    "home" | "nests" | "shared" | "explore"
  >("home");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleToggleActive = (section: any) => {
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
    <div className="flex h-screen overflow-hidden bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-white">
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
          "w-0 md:w-64",
          // Desktop - show icon width when collapsed
          isSidebarCollapsed ? "md:w-20" : "md:w-64",
        )}
      >
        <aside
          onDoubleClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className={cn(
            "z-40 flex h-screen flex-col bg-white shadow-lg dark:bg-gray-800 dark:text-white",
            "fixed top-0 left-0 shadow-xl transition-all duration-300 ease-in-out",
            "w-64",
            isSidebarCollapsed ? "md:w-20" : "md:w-64",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full",
            "md:relative md:flex md:translate-x-0",
          )}
        >
          <Sidebar
            activeSection={activeSection}
            setActiveSection={handleToggleActive}
            isCollapsed={isSidebarCollapsed}
          />
        </aside>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="bg-white p-4 md:hidden dark:bg-gray-950">
          <button
            className="rounded-md bg-white p-2 transition-colors duration-200 hover:bg-gray-100 dark:text-black"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu />
          </button>
        </header>
        <main className="flex-1 overflow-y-auto p-6 transition-opacity duration-200">
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
    </div>
  );
}
