import Sidebar from "@/components/dashboard/Sidebar";
import { useState } from "react";
import HomeSection from "@/components/dashboard/Mainview";
import ActivitySection from "@/components/dashboard/Activity";
import ExploreSection from "@/components/dashboard/Discover";

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState<
    "home" | "activity" | "explore"
  >("home");

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
      <main className="flex-1 p-6 overflow-y-auto">
        {activeSection === "home" && <HomeSection />}
        {activeSection === "activity" && <ActivitySection />}
        {activeSection === "explore" && <ExploreSection />}
      </main>
    </div>
  );
}
