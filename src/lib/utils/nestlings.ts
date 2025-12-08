import {
  FileText,
  Calendar,
  Images,
  KanbanSquare,
  Notebook,
  Table2,
  Network,
  LucideIcon,
} from "lucide-react";
import { NestlingType } from "../types/nestling";
import * as storage from "@/lib/storage/session";
import * as nestlingApi from "@/lib/api/nestling";
import { getActiveNestId } from "./nests";
import { useNestlingStore } from "@/stores/useNestlingStore";

export type NestlingTypeOption = {
  value: NestlingType;
  label: string;
  icon: LucideIcon;
  color: string;
};

export const nestlingTypes: NestlingTypeOption[] = [
  { value: "note", label: "Note", icon: FileText, color: "bg-blue-500" },
  {
    value: "board",
    label: "Board",
    icon: KanbanSquare,
    color: "bg-purple-500",
  },
  { value: "calendar", label: "Calendar", icon: Calendar, color: "bg-red-500" },
  { value: "journal", label: "Journal", icon: Notebook, color: "bg-amber-500" },
  { value: "gallery", label: "Gallery", icon: Images, color: "bg-pink-500" },
  { value: "mindmap", label: "Mindmap", icon: Network, color: "bg-green-500" },
  {
    value: "database",
    label: "Database",
    icon: Table2,
    color: "bg-indigo-500",
  },
];

export const getNestlingIcon = (type: NestlingType) => {
  return nestlingTypes.find((t) => t.value === type)?.icon || FileText;
};

export const updateNestlingTimestamp = async (nestlingId: number) => {
  const nestId = getActiveNestId();
  const now = new Date().toISOString();

  await Promise.all([
    storage.saveRecentNestling(nestId, nestlingId),
    nestlingApi.updateNestlingTimestamp(nestlingId),
  ]);

  useNestlingStore.getState().updateNestlingTimestamp(nestlingId, now);
};
