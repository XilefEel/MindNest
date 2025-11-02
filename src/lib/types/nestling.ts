import { WithBase } from "./base";

export type NestlingType =
  | "note"
  | "board"
  | "calendar"
  | "journal"
  | "gallery"
  | "mindmap"
  | "database";

export type NewNestling = {
  nestId: number;
  folderId: number | null;
  nestlingType: NestlingType;
  icon: string | null;
  isPinned: boolean;
  title: string;
  content: string;
};

export type Nestling = WithBase<NewNestling>;
