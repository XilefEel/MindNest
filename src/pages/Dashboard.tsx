import Sidebar from "@/components/dashboard/Sidebar";
import HomeSection from "@/components/dashboard/HomeSection";
import NestSection from "@/components/dashboard/NestSection";
import SharedSection from "@/components/dashboard/SharedSection";
import ExploreSection from "@/components/dashboard/DiscoverSection";
import SettingsModal from "@/components/modals/SettingsModal";

import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import useNests from "@/hooks/useNests";
import { Nest } from "@/lib/types";

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState<
    "home" | "nests" | "shared" | "explore"
  >("home");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeNest, setActiveNest] = useState<Nest | null>(null);

  const { user } = useAuth();
  const userId = user?.id;
  if (!userId) return null;

  const { nests, refetch } = useNests(userId);

  function renderSection() {
    switch (activeSection) {
      case "home":
        return (
          <HomeSection
            user={user}
            nests={nests}
            activeNest={activeNest}
            setActiveNest={setActiveNest}
            refresh={refetch}
          />
        );
      case "nests":
        return (
          <NestSection
            user={user}
            nests={nests}
            activeNest={activeNest}
            setActiveNest={setActiveNest}
            refresh={refetch}
          />
        );
      case "shared":
        return <SharedSection />;
      case "explore":
        return <ExploreSection />;
      default:
        return null;
    }
  }
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isSidebarOpen]);

  return (
    <div className="flex h-screen overflow-hidden  bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-white cursor-default">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "bg-white dark:bg-gray-800 dark:text-white shadow-lg w-64 h-screen flex flex-col z-40",
          "fixed top-0 left-0 transition-transform duration-300 ease-in-out shadow-xl",
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
        <header className="md:hidden p-4 bg-white dark:bg-gray-950">
          <button
            className="bg-white dark:text-black cursor-pointer rounded-md p-2 hover:bg-gray-100 transition-colors duration-200"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu />
          </button>
        </header>
        <main className="flex-1 p-6 overflow-y-auto transition-opacity duration-200">
          {renderSection()}
        </main>
      </div>

      {isSettingsOpen && (
        <SettingsModal setIsSettingsOpen={setIsSettingsOpen} />
      )}
    </div>
  );
}
