import { FaHome, FaClock, FaSearch, FaPlus } from "react-icons/fa";
import SidebarItem from "./SidebarItem";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function Sidebar({
  activeSection,
  setActiveSection,
}: {
  activeSection: string;
  setActiveSection: (section: any) => void;
}) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const handleLogOut = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err: any) {
      throw new Error(err.message || "Logout failed");
    }
  };
  return (
    <aside className="w-64 bg-white shadow-lg p-4 flex flex-col">
      <div className="text-2xl font-bold mb-6">🧠 MindNest</div>

      <button
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
        onClick={() => alert("Open Create Nest Modal")}
      >
        <FaPlus />
        Create Nest
      </button>

      <nav className="space-y-2">
        <SidebarItem
          icon={<FaHome />}
          label="My Nests"
          active={activeSection === "home"}
          onClick={() => setActiveSection("home")}
        />
        <SidebarItem
          icon={<FaClock />}
          label="Recent Activity"
          active={activeSection === "activity"}
          onClick={() => setActiveSection("activity")}
        />
        <SidebarItem
          icon={<FaSearch />}
          label="Explore Nests"
          active={activeSection === "explore"}
          onClick={() => setActiveSection("explore")}
        />
      </nav>
      <div className="mt-auto pt-6 border-t border-gray-200">
        <SidebarItem icon={<FaSearch />} label="Settings" />
        <SidebarItem
          icon={<FaSearch />}
          label="Log Out"
          onClick={handleLogOut}
        />
      </div>
    </aside>
  );
}
