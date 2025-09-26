import { Nest } from "@/lib/types/nests";
import { Button } from "../ui/button";
import {
  Settings,
  Pencil,
  Link,
  ArrowLeft,
  CircleUserRound,
  Menu,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import SettingsModal from "../modals/SettingsModal";
import { clearLastNestId, clearLastNestling } from "@/lib/storage/session";

export default function Topbar({
  nest,
  isSidebarOpen,
  setIsSidebarOpen,
}: {
  nest: Nest;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}) {
  const navigate = useNavigate();

  const handleExit = () => {
    navigate("/dashboard");
    clearLastNestId();
    clearLastNestling();
  };
  return (
    <nav className="flex w-full items-center justify-between border-b p-2 pt-8 sm:p-4 sm:pt-10">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          className="hidden cursor-pointer hover:bg-teal-100 hover:text-teal-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 md:block dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-teal-300"
          onClick={() => handleExit()}
        >
          <ArrowLeft className="size-4 sm:size-5" />
        </Button>
        <Button
          variant="ghost"
          className="cursor-pointer hover:bg-teal-100 hover:text-teal-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 md:hidden dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-teal-300"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <Menu />
        </Button>
        <span className="text-xl font-bold tracking-tight sm:text-2xl">
          🐣 {nest.title}
        </span>
        <Button
          variant="ghost"
          className="cursor-pointer hover:bg-teal-100 hover:text-teal-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-teal-300"
        >
          <Pencil className="size-4 sm:size-5" />
        </Button>
      </div>
      <div className="flex items-center sm:gap-2">
        <Button
          variant="ghost"
          className="cursor-pointer hover:bg-teal-100 hover:text-teal-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-teal-300"
        >
          <Link className="size-4 sm:size-5" />
        </Button>
        <SettingsModal>
          <Button
            variant="ghost"
            className="cursor-pointer hover:bg-teal-100 hover:text-teal-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-teal-300"
          >
            <Settings className="size-4 sm:size-5" />
          </Button>
        </SettingsModal>

        <Button
          variant="ghost"
          className="cursor-pointer hover:bg-teal-100 hover:text-teal-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-teal-300"
        >
          <CircleUserRound className="size-4 sm:size-5" />
        </Button>
      </div>
    </nav>
  );
}
