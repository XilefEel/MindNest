import Sidebar from "@/components/dashboard/Sidebar";
import HomeSection from "@/components/dashboard/HomeSection";
import NestSection from "@/components/dashboard/NestSection";
import SharedSection from "@/components/dashboard/SharedSection";
import ExploreSection from "@/components/dashboard/DiscoverSection";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState<any>("home");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isSidebarOpen]);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-white cursor-default">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "bg-white dark:bg-gray-800 dark:text-white shadow-lg w-64 h-screen flex flex-col z-40",
          "fixed top-0 left-0 transition-transform duration-300 ease-in-out",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0 md:relative md:flex"
        )}
      >
        <Sidebar
          activeSection={activeSection}
          setActiveSection={(section: any) => {
            setActiveSection(section);
            setIsSidebarOpen(false);
          }}
          setIsSettingsOpen={setIsSettingsOpen}
        />
      </aside>

      <div className="flex-1 flex flex-col">
        <nav className="md:hidden p-4 bg-white dark:bg-gray-950">
          <button
            className="bg-white dark:text-black cursor-pointer rounded-md p-2 hover:bg-gray-100 transition-colors duration-200"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu />
          </button>
        </nav>
        <main className="flex-1 p-6 overflow-y-auto">
          {activeSection === "home" && <HomeSection />}
          {activeSection === "nests" && <NestSection />}
          {activeSection === "shared" && <SharedSection />}
          {activeSection === "explore" && <ExploreSection />}
        </main>
      </div>

      {isSettingsOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          onClick={() => setIsSettingsOpen(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-[90%] max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Settings</h2>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="text-gray-400 hover:text-gray-700 dark:hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Toggle Mode</span>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
