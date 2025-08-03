import { Nest } from "@/lib/types";
import { Button } from "../ui/button";
import {
  Settings,
  Pencil,
  Link,
  ArrowLeft,
  CircleUserRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import SettingsModal from "../modals/SettingsModal";

export default function Topbar({ nest }: { nest: Nest }) {
  const navigate = useNavigate();
  return (
    <nav className="flex w-full items-center justify-between border-b p-4 pt-12">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          className="cursor-pointer hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-300"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft className="size-5" />
        </Button>
        <span className="text-2xl font-bold tracking-tight">
          🐣 {nest.title}
        </span>
        <Button
          variant="ghost"
          className="cursor-pointer hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-300"
        >
          <Pencil className="size-5" />
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          className="cursor-pointer hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-300"
        >
          <Link className="size-5" />
        </Button>
        <SettingsModal>
          <Button
            variant="ghost"
            className="cursor-pointer hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-300"
          >
            <Settings className="size-5" />
          </Button>
        </SettingsModal>

        <Button
          variant="ghost"
          className="cursor-pointer hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-300"
        >
          <CircleUserRound className="size-5" />
        </Button>
      </div>
    </nav>
  );
}
