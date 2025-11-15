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
import {
  parseDragId,
  reorderArray,
  updateOrderIndexes,
} from "@/lib/utils/boards";
import { useNestlingStore } from "./useNestlingStore";
import { useShallow } from "zustand/react/shallow";

type BoardState = {
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
  reorderColumn: (
    activeColumnId: number,
    targetColumnId: number,
  ) => Promise<void>;

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
  reorderCard: ({
    activeCardId,
    targetCardId,
    targetColumnId,
  }: {
    activeCardId: number;
    targetCardId: number | null;
    targetColumnId: number;
  }) => Promise<void>;

  handleDragStart: (event: DragStartEvent) => void;
  handleDragEnd: (event: DragEndEvent) => Promise<void>;
};

export const useBoardStore = create<BoardState>((set, get) => ({
  boardData: null,
  loading: false,
  error: null,
  activeDraggingId: null,

  getBoard: withStoreErrorHandler(set, async (nestlingId) => {
    const data = await boardApi.getBoard(nestlingId);
    set({ boardData: data });
  }),

  createColumn: withStoreErrorHandler(set, async (column) => {
    const newColumn = await boardApi.createBoardColumn(column);

    set((state) => {
      if (!state.boardData) return state;

      return {
        boardData: {
          ...state.boardData,
          columns: [
            ...state.boardData.columns,
            { column: newColumn, cards: [] },
          ],
        },
      };
    });

    useNestlingStore.getState().updateNestlingTimestamp(newColumn.nestlingId);
  }),

  duplicateColumn: withStoreErrorHandler(set, async (column) => {
    const { boardData } = get();
    if (!boardData) return;

    const originalColumnIndex = boardData.columns.findIndex(
      (col) => col.column.id === column.id,
    );
    if (originalColumnIndex === -1) return;

    const originalColumn = boardData.columns[originalColumnIndex];

    const newColumn = await boardApi.createBoardColumn({
      nestlingId: column.nestlingId,
      title: column.title,
      orderIndex: column.orderIndex + 1,
      color: column.color,
    });

    const duplicatedCards = await Promise.all(
      originalColumn.cards.map((card, index) =>
        boardApi.createBoardCard({
          columnId: newColumn.id,
          title: card.title,
          description: card.description,
          orderIndex: index,
        }),
      ),
    );

    const updatedColumns = [...boardData.columns].splice(
      originalColumnIndex + 1,
      0,
      {
        column: newColumn,
        cards: duplicatedCards,
      },
    );

    const columnsWithNewIndexes = updatedColumns.map((col, index) => ({
      ...col,
      column: { ...col.column, orderIndex: index },
    }));

    set({
      boardData: {
        ...boardData,
        columns: columnsWithNewIndexes,
      },
    });

    await Promise.all(
      columnsWithNewIndexes.slice(originalColumnIndex + 1).map((col) =>
        boardApi.updateBoardColumn({
          id: col.column.id,
          title: col.column.title,
          orderIndex: col.column.orderIndex,
          color: col.column.color,
        }),
      ),
    );
    useNestlingStore.getState().updateNestlingTimestamp(newColumn.nestlingId);
  }),

  updateColumn: withStoreErrorHandler(
    set,
    async ({ id, title, orderIndex, color }) => {
      await boardApi.updateBoardColumn({ id, title, orderIndex, color });

      set((state) => {
        if (!state.boardData) return state;

        return {
          boardData: {
            ...state.boardData,
            columns: state.boardData.columns.map((col) =>
              col.column.id === id
                ? {
                    ...col,
                    column: { ...col.column, title, orderIndex, color: color },
                  }
                : col,
            ),
          },
        };
      });
      useNestlingStore
        .getState()
        .updateNestlingTimestamp(get().boardData!.nestling.id);
    },
  ),

  removeColumn: withStoreErrorHandler(set, async (columnId) => {
    await boardApi.deleteBoardColumn(columnId);

    set((state) => {
      if (!state.boardData) return state;

      return {
        boardData: {
          ...state.boardData,
          columns: state.boardData.columns.filter(
            (col) => col.column.id !== columnId,
          ),
        },
      };
    });

    useNestlingStore
      .getState()
      .updateNestlingTimestamp(get().boardData!.nestling.id);
  }),

  reorderColumn: async (activeColumnId, targetColumnId) => {
    const { boardData } = get();
    if (!boardData) return;

    const activeColumnIndex = boardData.columns.findIndex(
      (column) => column.column.id === activeColumnId,
    );
    const targetColumnIndex = boardData.columns.findIndex(
      (column) => column.column.id === targetColumnId,
    );

    if (
      activeColumnIndex === -1 ||
      targetColumnIndex === -1 ||
      activeColumnIndex === targetColumnIndex
    )
      return;

    const reorderedColumns = reorderArray(
      boardData.columns,
      activeColumnIndex,
      targetColumnIndex,
    );
    const columnsWithNewIndexes = reorderedColumns.map((col, index) => ({
      ...col,
      column: { ...col.column, orderIndex: index },
    }));

    set((state) => ({
      boardData: state.boardData
        ? { ...state.boardData, columns: columnsWithNewIndexes }
        : null,
    }));

    await Promise.all(
      columnsWithNewIndexes.map((column) =>
        boardApi.updateBoardColumn({
          id: column.column.id,
          title: column.column.title,
          orderIndex: column.column.orderIndex,
          color: column.column.color,
        }),
      ),
    );

    useNestlingStore
      .getState()
      .updateNestlingTimestamp(get().boardData!.nestling.id);
  },

  createCard: withStoreErrorHandler(set, async (card) => {
    const newCard = await boardApi.createBoardCard(card);

    set((state) => {
      if (!state.boardData) return { error: "Board data not loaded" };

      return {
        boardData: {
          ...state.boardData,
          columns: state.boardData.columns.map((col) =>
            col.column.id === card.columnId
              ? { ...col, cards: [...col.cards, newCard] }
              : col,
          ),
        },
      };
    });
    useNestlingStore
      .getState()
      .updateNestlingTimestamp(get().boardData!.nestling.id);
  }),

  duplicateCard: withStoreErrorHandler(set, async (card) => {
    const { boardData } = get();
    if (!boardData) return;

    const originalCol = boardData.columns.find(
      (col) => col.column.id === card.columnId,
    );
    if (!originalCol) return;

    const originalCard = originalCol.cards.find((c) => c.id === card.id);
    if (!originalCard) return;

    const newCard = await boardApi.createBoardCard({
      columnId: card.columnId,
      title: card.title,
      description: card.description,
      orderIndex: card.orderIndex,
    });

    const updatedCards = [...originalCol.cards].splice(
      originalCard.orderIndex + 1,
      0,
      newCard,
    );

    const cardsWithNewIndexes = updatedCards.map((card, index) => ({
      ...card,
      orderIndex: index,
    }));

    set({
      boardData: {
        ...boardData,
        columns: boardData.columns.map((col) =>
          col.column.id === card.columnId
            ? { ...col, cards: cardsWithNewIndexes }
            : col,
        ),
      },
    });

    await Promise.all(
      cardsWithNewIndexes.map((card) =>
        boardApi.updateBoardCard({
          id: card.id,
          title: card.title,
          description: card.description,
          orderIndex: card.orderIndex,
          columnId: card.columnId,
        }),
      ),
    );
    useNestlingStore
      .getState()
      .updateNestlingTimestamp(get().boardData!.nestling.id);
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
      set((state) => {
        if (!state.boardData) return state;

        return {
          boardData: {
            ...state.boardData,
            columns: state.boardData.columns.map((col) => ({
              ...col,
              cards: col.cards.map((card) =>
                card.id === id
                  ? { ...card, title, description, orderIndex, columnId }
                  : card,
              ),
            })),
          },
        };
      });
      useNestlingStore
        .getState()
        .updateNestlingTimestamp(get().boardData!.nestling.id);
    },
  ),

  deleteCard: withStoreErrorHandler(set, async (cardId) => {
    await boardApi.deleteBoardCard(cardId);
    set((state) => {
      if (!state.boardData) return state;

      return {
        boardData: {
          ...state.boardData,
          columns: state.boardData.columns.map((col) => ({
            ...col,
            cards: col.cards.filter((card) => card.id !== cardId),
          })),
        },
      };
    });
    useNestlingStore
      .getState()
      .updateNestlingTimestamp(get().boardData!.nestling.id);
  }),

  reorderCard: async ({ activeCardId, targetCardId, targetColumnId }) => {
    const { boardData } = get();
    if (!boardData || activeCardId === targetCardId) return;

    const originalColIndex = boardData.columns.findIndex((col) =>
      col.cards.some((card) => card.id === activeCardId),
    );
    const targetColIndex = boardData.columns.findIndex(
      (col) => col.column.id === targetColumnId,
    );

    if (originalColIndex === -1 || targetColIndex === -1) return;

    const originalCol = boardData.columns[originalColIndex];
    const targetCol = boardData.columns[targetColIndex];
    const isSameColumn = originalColIndex === targetColIndex;

    const activeCardIndex = originalCol.cards.findIndex(
      (card) => card.id === activeCardId,
    );
    const targetCardIndex =
      targetCardId === null
        ? targetCol.cards.length
        : targetCol.cards.findIndex((card) => card.id === targetCardId);

    if (activeCardIndex === -1 || targetCardIndex === -1) return;

    const updatedColumns = [...boardData.columns];
    const movedCard = { ...originalCol.cards[activeCardIndex] };

    if (isSameColumn) {
      const reorderedCards = reorderArray(
        originalCol.cards,
        activeCardIndex,
        targetCardIndex,
      );
      const cardsWithIndexes = updateOrderIndexes(reorderedCards);

      updatedColumns[originalColIndex] = {
        ...originalCol,
        cards: cardsWithIndexes,
      };
    } else {
      const sourceCards = originalCol.cards.filter(
        (card) => card.id !== activeCardId,
      );
      const targetCards = [...targetCol.cards];

      movedCard.columnId = targetColumnId;
      targetCards.splice(targetCardIndex, 0, movedCard);

      updatedColumns[originalColIndex] = {
        ...originalCol,
        cards: updateOrderIndexes(sourceCards),
      };
      updatedColumns[targetColIndex] = {
        ...targetCol,
        cards: updateOrderIndexes(targetCards),
      };
    }

    set({ boardData: { ...boardData, columns: updatedColumns } });

    try {
      const cardsToUpdate = isSameColumn
        ? updatedColumns[originalColIndex].cards
        : [
            ...updatedColumns[originalColIndex].cards,
            ...updatedColumns[targetColIndex].cards,
          ];

      await Promise.all(
        cardsToUpdate.map((card) =>
          boardApi.updateBoardCard({
            id: card.id,
            title: card.title,
            description: card.description,
            orderIndex: card.orderIndex,
            columnId: card.columnId,
          }),
        ),
      );
      useNestlingStore
        .getState()
        .updateNestlingTimestamp(get().boardData!.nestling.id);
    } catch (error) {
      set({ boardData, error: String(error) });
    }
  },

  handleDragStart: (event) => {
    set({ activeDraggingId: event.active.id as string });
  },

  handleDragEnd: async (event) => {
    const { active, over } = event;
    set({ activeDraggingId: null });
    if (!over || active.id === over.id) return;

    const activeData = parseDragId(active.id);
    const targetData = parseDragId(over.id);

    if (!activeData || !targetData) return;

    const targetColumnId =
      targetData.type === "column" ? targetData.id : targetData.columnId!;

    if (activeData.type === "column") {
      get().reorderColumn(activeData.id, targetColumnId);
      return;
    }

    if (activeData.type === "card") {
      const targetCardId = targetData.type === "card" ? targetData.id : null;

      get().reorderCard({
        activeCardId: activeData.id,
        targetCardId,
        targetColumnId,
      });
      return;
    }
  },
}));

export const useBoardData = () => useBoardStore((state) => state.boardData);

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
      reorderColumn: state.reorderColumn,

      createCard: state.createCard,
      duplicateCard: state.duplicateCard,
      updateCard: state.updateCard,
      reorderCard: state.reorderCard,
      deleteCard: state.deleteCard,

      handleDragStart: state.handleDragStart,
      handleDragEnd: state.handleDragEnd,
    })),
  );
