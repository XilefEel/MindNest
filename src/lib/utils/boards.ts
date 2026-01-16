import { BoardCard } from "../types/board";

export const sortCards = (cards: BoardCard[]) =>
  cards.sort((a, b) => {
    if (a.columnId !== b.columnId) return a.columnId - b.columnId;
    return a.orderIndex - b.orderIndex;
  });
