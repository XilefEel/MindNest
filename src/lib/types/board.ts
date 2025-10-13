import { WithBase } from "./base";
import { Nestling } from "./nestling";

export type NewBoardColumn = {
  nestling_id: number;
  title: string;
  order_index: number;
};

export type BoardColumn = WithBase<NewBoardColumn>;

export type NewBoardCard = {
  column_id: number;
  title: string;
  description: string | null;
  order_index: number;
};

export type BoardCard = WithBase<NewBoardCard>;

export type BoardData = {
  nestling: Nestling;
  columns: BoardColumnData[];
};

export type BoardColumnData = {
  column: BoardColumn;
  cards: BoardCard[];
};
