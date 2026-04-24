import {
  FileText,
  Calendar,
  Images,
  KanbanSquare,
  Table2,
  Network,
  LucideIcon,
  BookmarkCheck,
} from "lucide-react";
import { NestlingType } from "../types/nestling";
import * as nestlingApi from "@/lib/api/nestling";
import { getActiveNestId } from "./nests";
import { useNestlingStore } from "@/stores/useNestlingStore";
import { saveRecentNestling } from "../storage/nestling";

export type NestlingTypeConfig = {
  value: NestlingType;
  label: string;
  icon: LucideIcon;
  color: string;
  border: string;
};

export const nestlingTypeConfigs: NestlingTypeConfig[] = [
  {
    value: "note",
    label: "Note",
    icon: FileText,
    color: "bg-blue-500 dark:bg-blue-400",
    border: "hover:border-blue-500 dark:hover:border-blue-400",
  },
  {
    value: "board",
    label: "Board",
    icon: KanbanSquare,
    color: "bg-purple-500 dark:bg-purple-400",
    border: "hover:border-purple-500 dark:hover:border-purple-400",
  },
  {
    value: "calendar",
    label: "Calendar",
    icon: Calendar,
    color: "bg-red-500 dark:bg-red-400",
    border: "hover:border-red-500 dark:hover:border-red-400",
  },
  {
    value: "bookmark",
    label: "Bookmark",
    icon: BookmarkCheck,
    color: "bg-amber-500 dark:bg-amber-400",
    border: "hover:border-amber-500 dark:hover:border-amber-400",
  },
  {
    value: "gallery",
    label: "Gallery",
    icon: Images,
    color: "bg-pink-500 dark:bg-pink-400",
    border: "hover:border-pink-500 dark:hover:border-pink-400",
  },
  {
    value: "mindmap",
    label: "Mindmap",
    icon: Network,
    color: "bg-green-500 dark:bg-green-400",
    border: "hover:border-green-500 dark:hover:border-green-400",
  },
  {
    value: "database",
    label: "Database",
    icon: Table2,
    color: "bg-indigo-500 dark:bg-indigo-400",
    border: "hover:border-indigo-500 dark:hover:border-indigo-400",
  },
];

export const getNestlingIcon = (type: NestlingType) => {
  return nestlingTypeConfigs.find((t) => t.value === type)?.icon || FileText;
};

export const getNestlingTypeColor = (type: NestlingType) => {
  return (
    nestlingTypeConfigs.find((t) => t.value === type) || {
      color: "bg-gray-500",
      border: "hover:border-gray-500",
    }
  );
};

export const updateNestlingTimestamp = async (nestlingId: number) => {
  const nestId = getActiveNestId();
  const now = new Date().toISOString();

  await Promise.all([
    saveRecentNestling(nestId, nestlingId),
    nestlingApi.updateNestlingTimestamp(nestlingId),
  ]);

  useNestlingStore.getState().updateNestlingTimestamp(nestlingId, now);
};
