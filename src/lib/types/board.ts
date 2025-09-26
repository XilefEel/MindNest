import { Nestling } from "./nestlings";

export type BoardColumn = {
  id: number;
  nestling_id: number;
  title: string;
  order_index: number;
  created_at: string;
  updated_at: string;
};

export type NewBoardColumn = {
  nestling_id: number;
  title: string;
  order_index: number;
};

export type BoardCard = {
  id: number;
  column_id: number;
  title: string;
  description: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
};

export type NewBoardCard = {
  column_id: number;
  title: string;
  description: string | null;
  order_index: number;
};

export type BoardData = {
  nestling: Nestling;
  columns: BoardColumnData[];
};

export type BoardColumnData = {
  column: BoardColumn;
  cards: BoardCard[];
};
