import {
  createBoardCard,
  createBoardColumn,
  deleteBoardCard,
  deleteBoardColumn,
  getBoard,
  updateBoardCard,
  updateBoardColumn,
} from "@/lib/api/board";
import { BoardData, NewBoardCard, NewBoardColumn } from "@/lib/types/board";
import { withStoreErrorHandler } from "@/lib/utils/general";
import { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { create } from "zustand";
import {
  parseDragId,
  reorderArray,
  updateOrderIndexes,
} from "@/lib/utils/boards";

type BoardState = {
  boardData: BoardData | null;
  activeDraggingId: string | null;
  loading: boolean;
  error: string | null;

  fetchBoard: (nestlingId: number) => void;

  addColumn: (column: NewBoardColumn) => void;
  updateColumn: ({
    id,
    title,
    order_index,
  }: {
    id: number;
    title: string;
    order_index: number;
  }) => Promise<void>;
  removeColumn: (columnId: number) => void;
  reorderColumn: (activeColumnId: number, targetColumnId: number) => void;

  addCard: (card: NewBoardCard) => void;
  updateCard: ({
    id,
    title,
    description,
    order_index,
    column_id,
  }: {
    id: number;
    title: string;
    description: string | null;
    order_index: number;
    column_id: number;
  }) => Promise<void>;
  removeCard: (cardId: number) => void;
  reorderCard: ({
    activeCardId,
    targetCardId,
    targetColumnId,
  }: {
    activeCardId: number;
    targetCardId: number | null;
    targetColumnId: number;
  }) => void;

  handleDragStart: (event: DragStartEvent) => void;
  handleDragEnd: (event: DragEndEvent) => Promise<void>;
};

export const useBoardStore = create<BoardState>((set, get) => ({
  boardData: null,
  loading: false,
  error: null,
  activeDraggingId: null,

  fetchBoard: withStoreErrorHandler(set, async (nestlingId) => {
    const data = await getBoard(nestlingId);
    set({ boardData: data });
  }),

  addColumn: withStoreErrorHandler(set, async (column) => {
    const newColumn = await createBoardColumn(column);

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
  }),

  updateColumn: withStoreErrorHandler(
    set,
    async ({ id, title, order_index }) => {
      await updateBoardColumn({ id, title, order_index });

      set((state) => {
        if (!state.boardData) return state;

        return {
          boardData: {
            ...state.boardData,
            columns: state.boardData.columns.map((col) =>
              col.column.id === id
                ? { ...col, column: { ...col.column, title, order_index } }
                : col,
            ),
          },
        };
      });
    },
  ),

  removeColumn: withStoreErrorHandler(set, async (columnId) => {
    await deleteBoardColumn(columnId);

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
    ) {
      return;
    }

    const reorderedColumns = reorderArray(
      boardData.columns,
      activeColumnId,
      targetColumnId,
    );
    const columnsWithNewIndexes = reorderedColumns.map((col, index) => ({
      ...col,
      column: { ...col.column, order_index: index },
    }));

    set((state) => ({
      boardData: state.boardData
        ? { ...state.boardData, columns: columnsWithNewIndexes }
        : null,
    }));

    await Promise.all(
      reorderedColumns.map((column) =>
        updateBoardColumn({
          id: column.column.id,
          title: column.column.title,
          order_index: column.column.order_index,
        }),
      ),
    );
  },

  addCard: withStoreErrorHandler(set, async (card) => {
    const newCard = await createBoardCard(card);

    set((state) => {
      if (!state.boardData) return { error: "Board data not loaded" };

      return {
        boardData: {
          ...state.boardData,
          columns: state.boardData.columns.map((col) =>
            col.column.id === card.column_id
              ? { ...col, cards: [...col.cards, newCard] }
              : col,
          ),
        },
      };
    });
  }),

  updateCard: withStoreErrorHandler(
    set,
    async ({ id, title, description, order_index, column_id }) => {
      await updateBoardCard({ id, title, description, order_index, column_id });
      set((state) => {
        if (!state.boardData) return state;

        return {
          boardData: {
            ...state.boardData,
            columns: state.boardData.columns.map((col) => ({
              ...col,
              cards: col.cards.map((card) =>
                card.id === id
                  ? { ...card, title, description, order_index, column_id }
                  : card,
              ),
            })),
          },
        };
      });
    },
  ),

  removeCard: withStoreErrorHandler(set, async (cardId) => {
    await deleteBoardCard(cardId);
    if (get().boardData) {
      set((state) => ({
        boardData: {
          ...state.boardData!,
          columns: state.boardData!.columns.map((col) => ({
            ...col,
            cards: col.cards.filter((card) => card.id !== cardId),
          })),
        },
      }));
    }
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

      movedCard.column_id = targetColumnId;
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
          updateBoardCard({
            id: card.id,
            title: card.title,
            description: card.description,
            order_index: card.order_index,
            column_id: card.column_id,
          }),
        ),
      );
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
