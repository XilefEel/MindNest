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

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isSidebarOpen]);

  return (
    <div className="flex h-screen cursor-default overflow-hidden bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-white">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "z-40 flex h-screen w-64 flex-col bg-white shadow-lg dark:bg-gray-800 dark:text-white",
          "fixed top-0 left-0 shadow-xl transition-transform duration-300 ease-in-out",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
          "md:relative md:flex md:translate-x-0",
        )}
      >
        <Sidebar
          activeSection={activeSection}
          setActiveSection={(section: any) => {
            setActiveSection(section);
            setIsSidebarOpen(false);
          }}
        />
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="bg-white p-4 md:hidden dark:bg-gray-950">
          <button
            className="cursor-pointer rounded-md bg-white p-2 transition-colors duration-200 hover:bg-gray-100 dark:text-black"
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
