import { BoardColumn, BoardCard } from "../types/board";

export function parseDragData(item: { id: string | number; data: any }) {
  if (item.data.current.type === "column") {
    return {
      type: "column",
      id: item.id,
      column: item.data.current.column as BoardColumn,
    };
  } else if (item.data.current.type === "card") {
    return {
      type: "card",
      id: item.id,
      card: item.data.current.card as BoardCard,
    };
  }
  return null;
}

export const sortCards = (cards: BoardCard[]) =>
  cards.sort((a, b) => {
    if (a.columnId !== b.columnId) return a.columnId - b.columnId;
    return a.orderIndex - b.orderIndex;
  });
