import * as boardApi from "@/lib/api/board";
import {
  BoardCard,
  BoardColumn,
  BoardData,
  CardsByColumn,
  NewBoardCard,
  NewBoardColumn,
} from "@/lib/types/board";
import { mergeWithCurrent, withStoreErrorHandler } from "@/lib/utils/general";
import { DragEndEvent, DragStartEvent, DragMoveEvent } from "@dnd-kit/react";
import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { move } from "@dnd-kit/helpers";
import { updateNestlingTimestamp } from "@/lib/utils/nestlings";

let snapshot: CardsByColumn = {};

type BoardState = {
  columns: BoardColumn[];
  cardsByColumn: CardsByColumn;
  loading: boolean;

  getBoard: (nestlingId: number) => Promise<void>;

  createColumn: (column: NewBoardColumn) => Promise<void>;
  duplicateColumn: (column: BoardColumn) => Promise<void>;
  updateColumn: (id: number, updates: Partial<BoardColumn>) => Promise<void>;
  removeColumn: (columnId: number) => Promise<void>;

  createCard: (card: NewBoardCard) => Promise<void>;
  updateCard: (
    id: number,
    columnId: number,
    updates: Partial<BoardCard>,
  ) => Promise<void>;
  deleteCard: (cardId: number, columnId: number) => Promise<void>;

  handleDragStart: (event: DragStartEvent) => void;
  handleDragOver: (event: DragMoveEvent) => void;
  handleDragEnd: (event: DragEndEvent) => void;
};

export const useBoardStore = create<BoardState>((set, get) => ({
  columns: [],
  cardsByColumn: {},
  loading: false,

  getBoard: withStoreErrorHandler(set, async (nestlingId) => {
    const data: BoardData = await boardApi.getBoard(nestlingId);

    const columns: BoardColumn[] = data.columns.map((col) => col.column);
    const cardsByColumn: CardsByColumn = Object.fromEntries(
      data.columns.map((c) => [String(c.column.id), c.cards]),
    );

    set({ columns, cardsByColumn });
  }),

  createColumn: withStoreErrorHandler(set, async (column) => {
    const newColumn = await boardApi.createBoardColumn(column);
    set((state) => ({
      columns: [...state.columns, newColumn],
      cardsByColumn: {
        ...state.cardsByColumn,
        [newColumn.id]: [],
      },
    }));
    await updateNestlingTimestamp(newColumn.nestlingId);
  }),

  duplicateColumn: withStoreErrorHandler(set, async (column) => {
    const { columns, cardsByColumn } = get();
    const originalIdx = columns.findIndex((c) => c.id === column.id);
    if (originalIdx === -1) return;

    const newColumn = await boardApi.createBoardColumn({
      nestlingId: column.nestlingId,
      title: `Copy of ${column.title}`,
      orderIndex: column.orderIndex + 1,
      color: column.color,
    });

    const originalCards = cardsByColumn[column.id] ?? [];

    const duplicatedCards = await Promise.all(
      originalCards.map((card, index) =>
        boardApi.createBoardCard({
          columnId: newColumn.id,
          title: card.title,
          description: card.description,
          orderIndex: index,
        }),
      ),
    );

    const updatedColumns = [
      ...columns.slice(0, originalIdx + 1),
      newColumn,
      ...columns.slice(originalIdx + 1),
    ].map((col, i) => ({ ...col, orderIndex: i }));

    set((state) => ({
      columns: updatedColumns,
      cardsByColumn: {
        ...state.cardsByColumn,
        [newColumn.id]: duplicatedCards,
      },
    }));

    await Promise.all(
      updatedColumns
        .slice(originalIdx + 1)
        .map((col) => boardApi.updateBoardColumn(col)),
    );
    await updateNestlingTimestamp(newColumn.nestlingId);
  }),

  updateColumn: withStoreErrorHandler(set, async (id, updates) => {
    const current = get().columns.find((col) => col.id === id);
    if (!current) throw new Error("Column not found");

    const updated = {
      ...mergeWithCurrent(current, updates),
      updatedAt: new Date().toISOString(),
    };

    await Promise.all([
      boardApi.updateBoardColumn({ ...updated, id }),
      updateNestlingTimestamp(current.nestlingId),
    ]);

    set((state) => ({
      columns: state.columns.map((col) => (col.id === id ? updated : col)),
    }));
  }),

  removeColumn: withStoreErrorHandler(set, async (columnId) => {
    await boardApi.deleteBoardColumn(columnId);

    await updateNestlingTimestamp(
      get().columns.find((col) => col.id === columnId)!.nestlingId,
    );

    set((state) => ({
      columns: state.columns.filter((col) => col.id !== columnId),
    }));
  }),

  createCard: withStoreErrorHandler(set, async (card) => {
    const newCard = await boardApi.createBoardCard(card);

    set((state) => ({
      cardsByColumn: {
        ...state.cardsByColumn,
        [card.columnId]: [
          ...(state.cardsByColumn[card.columnId] ?? []),
          newCard,
        ],
      },
    }));
    await updateNestlingTimestamp(
      get().columns.find((col) => col.id === card.columnId)!.nestlingId,
    );
  }),

  updateCard: withStoreErrorHandler(set, async (id, columnId, updates) => {
    const current = get().cardsByColumn[columnId]?.find((c) => c.id === id);
    if (!current) throw new Error("Card not found");

    const column = get().columns.find((col) => col.id === columnId);
    if (!column) throw new Error("Column not found");

    const updated = {
      ...mergeWithCurrent(current, updates),
      updatedAt: new Date().toISOString(),
    };

    await Promise.all([
      boardApi.updateBoardCard({ ...updated, id }),
      updateNestlingTimestamp(column.nestlingId),
    ]);

    set((state) => ({
      cardsByColumn: {
        ...state.cardsByColumn,
        [columnId]: state.cardsByColumn[columnId].map((card) =>
          card.id === id ? updated : card,
        ),
      },
    }));
  }),

  deleteCard: withStoreErrorHandler(set, async (id, columnId) => {
    const current = get().cardsByColumn[columnId]?.find((c) => c.id === id);
    if (!current) throw new Error("Card not found");

    const column = get().columns.find((col) => col.id === columnId);
    if (!column) throw new Error("Column not found");

    await boardApi.deleteBoardCard(id);

    set((state) => ({
      cardsByColumn: {
        ...state.cardsByColumn,
        [columnId]: state.cardsByColumn[columnId].filter(
          (card) => card.id !== id,
        ),
      },
    }));

    await updateNestlingTimestamp(column.nestlingId);
  }),

  handleDragStart: () => {
    snapshot = structuredClone(get().cardsByColumn);
  },

  handleDragOver: (event) => {
    const { source } = event.operation;

    if (source && source.type === "column") {
      set((state) => ({ columns: move(state.columns, event) }));
      return;
    }

    set((state) => ({ cardsByColumn: move(state.cardsByColumn, event) }));
  },

  handleDragEnd: async (event) => {
    const { source } = event.operation;
    if (!source) return;

    if (event.canceled) {
      set({ cardsByColumn: snapshot });
      return;
    }

    if (source.type === "column") {
      const indexed = get().columns.map((col, i) => ({
        ...col,
        orderIndex: i,
      }));
      set({ columns: indexed });
      await Promise.all(indexed.map((col) => boardApi.updateBoardColumn(col)));
      await updateNestlingTimestamp(indexed[0].nestlingId);
      return;
    }

    if (source.type === "card") {
      const { cardsByColumn, columns } = get();
      const updates: BoardCard[] = [];

      for (const [columnId, cards] of Object.entries(cardsByColumn)) {
        cards.forEach((card, i) => {
          updates.push({ ...card, columnId: Number(columnId), orderIndex: i });
        });
      }

      await Promise.all(updates.map((card) => boardApi.updateBoardCard(card)));

      const movedCard = updates.find((c) => c.id === Number(source.id))!;
      await updateNestlingTimestamp(
        columns.find((col) => col.id === movedCard.columnId)!.nestlingId,
      );
    }
  },
}));

export const useBoardColumns = () => useBoardStore((state) => state.columns);

export const useCardsByColumn = () =>
  useBoardStore((state) => state.cardsByColumn);

export const useBoardActions = () =>
  useBoardStore(
    useShallow((state) => ({
      getBoard: state.getBoard,

      createColumn: state.createColumn,
      duplicateColumn: state.duplicateColumn,
      updateColumn: state.updateColumn,
      removeColumn: state.removeColumn,

      createCard: state.createCard,
      updateCard: state.updateCard,
      deleteCard: state.deleteCard,

      handleDragStart: state.handleDragStart,
      handleDragOver: state.handleDragOver,
      handleDragEnd: state.handleDragEnd,
    })),
  );
