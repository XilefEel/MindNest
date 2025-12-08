import * as boardApi from "@/lib/api/board";
import {
  BoardCard,
  BoardColumn,
  BoardData,
  NewBoardCard,
  NewBoardColumn,
} from "@/lib/types/board";
import { withStoreErrorHandler } from "@/lib/utils/general";
import { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { create } from "zustand";
import { parseDragData, sortCards } from "@/lib/utils/boards";
import { useShallow } from "zustand/react/shallow";
import { arrayMove } from "@dnd-kit/sortable";
import { updateNestlingTimestamp } from "@/lib/utils/nestlings";

type BoardState = {
  columns: BoardColumn[];
  cards: BoardCard[];

  boardData: BoardData | null;
  activeDraggingId: string | null;
  loading: boolean;
  error: string | null;

  getBoard: (nestlingId: number) => Promise<void>;

  createColumn: (column: NewBoardColumn) => Promise<void>;
  duplicateColumn: (column: BoardColumn) => Promise<void>;
  updateColumn: ({
    id,
    title,
    orderIndex,
    color,
  }: {
    id: number;
    title: string;
    orderIndex: number;
    color: string;
  }) => Promise<void>;
  removeColumn: (columnId: number) => Promise<void>;

  createCard: (card: NewBoardCard) => Promise<void>;
  duplicateCard: (card: BoardCard) => Promise<void>;
  updateCard: ({
    id,
    title,
    description,
    orderIndex,
    columnId,
  }: {
    id: number;
    title: string;
    description: string | null;
    orderIndex: number;
    columnId: number;
  }) => Promise<void>;
  deleteCard: (cardId: number) => Promise<void>;

  handleDragStart: (event: DragStartEvent) => void;
  handleDragEnd: (event: DragEndEvent) => Promise<void>;
};

export const useBoardStore = create<BoardState>((set, get) => ({
  columns: [],
  cards: [],
  boardData: null,
  loading: false,
  error: null,
  activeDraggingId: null,

  getBoard: withStoreErrorHandler(set, async (nestlingId) => {
    const data = await boardApi.getBoard(nestlingId);

    const columns: BoardColumn[] = data.columns.map((col) => col.column);
    const cards: BoardCard[] = data.columns.flatMap((col) => col.cards);

    set({ boardData: data, columns, cards });
  }),

  createColumn: withStoreErrorHandler(set, async (column) => {
    const newColumn = await boardApi.createBoardColumn(column);
    set((state) => ({
      columns: [...state.columns, newColumn],
    }));
    await updateNestlingTimestamp(newColumn.nestlingId);
  }),

  duplicateColumn: withStoreErrorHandler(set, async (column) => {
    const { columns, cards } = get();

    const originalIdx = columns.findIndex((c) => c.id === column.id);
    if (originalIdx === -1) return;

    const newColumn = await boardApi.createBoardColumn({
      nestlingId: column.nestlingId,
      title: `Copy of ${column.title}`,
      orderIndex: column.orderIndex + 1,
      color: column.color,
    });

    const originalCards = cards.filter((c) => c.columnId === column.id);
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

    set({
      columns: updatedColumns,
      cards: [...cards, ...duplicatedCards],
    });

    await Promise.all(
      updatedColumns
        .slice(originalIdx + 1)
        .map((col) => boardApi.updateBoardColumn(col)),
    );

    await updateNestlingTimestamp(newColumn.nestlingId);
  }),

  updateColumn: withStoreErrorHandler(
    set,
    async ({ id, title, orderIndex, color }) => {
      await boardApi.updateBoardColumn({ id, title, orderIndex, color });

      set((state) => ({
        columns: state.columns.map((col) =>
          col.id === id ? { ...col, title, orderIndex, color } : col,
        ),
      }));
      await updateNestlingTimestamp(id);
    },
  ),

  removeColumn: withStoreErrorHandler(set, async (columnId) => {
    await boardApi.deleteBoardColumn(columnId);

    set((state) => ({
      columns: state.columns.filter((col) => col.id !== columnId),
    }));

    await updateNestlingTimestamp(
      get().columns.find((col) => col.id === columnId)!.nestlingId,
    );
  }),

  createCard: withStoreErrorHandler(set, async (card) => {
    const newCard = await boardApi.createBoardCard(card);

    set((state) => ({
      cards: [...state.cards, newCard],
    }));
    await updateNestlingTimestamp(
      get().columns.find((col) => col.id === card.columnId)!.nestlingId,
    );
  }),

  duplicateCard: withStoreErrorHandler(set, async (card) => {
    const { cards } = get();

    const originalIdx = cards.findIndex((c) => c.id === card.id);
    if (originalIdx === -1) return;

    const newCard = await boardApi.createBoardCard({
      columnId: card.columnId,
      title: `Copy of ${card.title}`,
      description: card.description,
      orderIndex: card.orderIndex + 1,
    });

    const updatedCards = [
      ...cards.slice(0, originalIdx + 1),
      newCard,
      ...cards.slice(originalIdx + 1),
    ].map((card, i) => ({ ...card, orderIndex: i }));

    set({ cards: sortCards(updatedCards) });

    await Promise.all(
      updatedCards
        .slice(originalIdx + 1)
        .map((card) => boardApi.updateBoardCard(card)),
    );

    await updateNestlingTimestamp(
      get().columns.find((col) => col.id === card.columnId)!.nestlingId,
    );
  }),

  updateCard: withStoreErrorHandler(
    set,
    async ({ id, title, description, orderIndex, columnId }) => {
      await boardApi.updateBoardCard({
        id,
        title,
        description,
        orderIndex,
        columnId,
      });
      set((state) => ({
        cards: state.cards.map((card) =>
          card.id === id
            ? { ...card, title, description, orderIndex, columnId }
            : card,
        ),
      }));
      await updateNestlingTimestamp(
        get().columns.find((col) => col.id === columnId)!.nestlingId,
      );
    },
  ),

  deleteCard: withStoreErrorHandler(set, async (cardId) => {
    await boardApi.deleteBoardCard(cardId);

    set((state) => ({
      cards: state.cards.filter((card) => card.id !== cardId),
    }));
    const currentCard = get().cards.find((card) => card.id === cardId)!;
    await updateNestlingTimestamp(
      get().columns.find((col) => col.id === currentCard.columnId)!.nestlingId,
    );
  }),

  handleDragStart: (event) => {
    set({ activeDraggingId: event.active.id as string });
  },

  handleDragEnd: async (event) => {
    const { active, over } = event;
    set({ activeDraggingId: null });

    if (!over || active.id === over.id) return;

    const activeData = parseDragData(active);
    const targetData = parseDragData(over);
    if (!activeData || !targetData) return;

    // column to column
    if (activeData.type === "column") {
      const { columns } = get();
      const activeIdx = columns.findIndex((c) => c.id === activeData.id);
      const targetIdx = columns.findIndex((c) => c.id === targetData.id);

      const reorderedCols = arrayMove(columns, activeIdx, targetIdx);
      const colsWithNewIndexes = reorderedCols.map((col, i) => ({
        ...col,
        orderIndex: i,
      }));

      set({ columns: colsWithNewIndexes });

      await Promise.all(
        colsWithNewIndexes.map((col) => boardApi.updateBoardColumn(col)),
      );
      await updateNestlingTimestamp(
        get().columns.find((col) => col.id === activeData.id)!.nestlingId,
      );
      return;
    }
    // card to col/card
    if (activeData.type === "card") {
      const { cards } = get();
      const activeIdx = cards.findIndex((c) => c.id === activeData.id);

      const targetColumnId =
        targetData.type === "card" ? targetData.card!.columnId : targetData.id;

      const updated = [...cards];
      updated[activeIdx].columnId = Number(targetColumnId);

      const targetIdx =
        targetData.type === "card"
          ? cards.findIndex((c) => c.id === targetData.id)
          : updated.filter((c) => c.columnId === targetColumnId).length;

      const reordered = arrayMove(updated, activeIdx, targetIdx);

      const affectedColumnIds = [cards[activeIdx].columnId, targetColumnId];

      const cardsWithNewIndexes = reordered.map((card) => {
        if (!affectedColumnIds.includes(card.columnId)) {
          return card;
        }
        const idx = reordered
          .filter((c) => c.columnId === card.columnId)
          .findIndex((c) => c.id === card.id);
        return { ...card, orderIndex: idx };
      });

      set({ cards: sortCards(cardsWithNewIndexes) });

      await Promise.all(
        cardsWithNewIndexes
          .filter((card) => affectedColumnIds.includes(card.columnId))
          .map((card) => boardApi.updateBoardCard(card)),
      );

      await updateNestlingTimestamp(
        get().columns.find((col) => col.id === targetColumnId)!.nestlingId,
      );
    }
  },
}));

export const useBoardColumns = () => useBoardStore((state) => state.columns);

export const useBoardCards = () => useBoardStore((state) => state.cards);

export const setActiveDraggingId = (id: string | null) => {
  useBoardStore.setState({ activeDraggingId: id });
};

export const useActiveDraggingId = () =>
  useBoardStore((state) => state.activeDraggingId);

export const useBoardActions = () =>
  useBoardStore(
    useShallow((state) => ({
      getBoard: state.getBoard,

      createColumn: state.createColumn,
      duplicateColumn: state.duplicateColumn,
      updateColumn: state.updateColumn,
      removeColumn: state.removeColumn,

      createCard: state.createCard,
      duplicateCard: state.duplicateCard,
      updateCard: state.updateCard,
      deleteCard: state.deleteCard,

      handleDragStart: state.handleDragStart,
      handleDragEnd: state.handleDragEnd,
    })),
  );
