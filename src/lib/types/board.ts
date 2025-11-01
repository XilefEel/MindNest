import { WithBase } from "./base";
import { Nestling } from "./nestling";

export type NewBoardColumn = {
  nestlingId: number;
  title: string;
  orderIndex: number;
  color: string;
};

export type BoardColumn = WithBase<NewBoardColumn>;

export type NewBoardCard = {
  columnId: number;
  title: string;
  description: string | null;
  orderIndex: number;
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
