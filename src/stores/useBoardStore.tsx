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
    set((state) => ({
      boardData: {
        ...state.boardData!,
        columns: [
          ...state.boardData!.columns,
          {
            column: newColumn,
            cards: [],
          },
        ],
      },
    }));
  }),

  updateColumn: withStoreErrorHandler(
    set,
    async ({ id, title, order_index }) => {
      await updateBoardColumn({ id, title, order_index });
      if (get().boardData) {
        set((state) => ({
          boardData: {
            ...state.boardData!,
            columns: state.boardData!.columns.map((col) =>
              col.column.id === id
                ? { ...col, column: { ...col.column, title, order_index } }
                : col,
            ),
          },
        }));
      }
    },
  ),

  removeColumn: withStoreErrorHandler(set, async (columnId) => {
    await deleteBoardColumn(columnId);
    if (get().boardData) {
      set((state) => ({
        boardData: {
          ...state.boardData!,
          columns: state.boardData!.columns.filter(
            (col) => col.column.id !== columnId,
          ),
        },
      }));
    }
  }),
  reorderColumn: async (activeColumnId, targetColumnId) => {
    const board = get().boardData;
    if (!board) return;

    const activeColumnIndex = board.columns.findIndex(
      (column) => column.column.id === activeColumnId,
    );
    const targetColumnIndex = board.columns.findIndex(
      (column) => column.column.id === targetColumnId,
    );

    if (
      activeColumnIndex === -1 ||
      targetColumnIndex === -1 ||
      activeColumnIndex === targetColumnIndex
    ) {
      return;
    }

    const boardColumns = [...board.columns];
    const [movedColumn] = boardColumns.splice(activeColumnIndex, 1);
    boardColumns.splice(targetColumnIndex, 0, movedColumn);

    boardColumns.forEach((column, index) => {
      column.column.order_index = index;
    });

    set((state) => ({
      boardData: state.boardData
        ? { ...state.boardData, columns: boardColumns }
        : null,
    }));

    await Promise.all(
      boardColumns.map((column) =>
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

    const currentState = get();
    if (!currentState.boardData) {
      set({ error: "Board data not loaded" });
      return;
    }

    set((state) => ({
      boardData: {
        ...state.boardData!,
        columns: state.boardData!.columns.map((col) =>
          col.column.id === card.column_id
            ? { ...col, cards: [...col.cards, newCard] }
            : col,
        ),
      },
    }));
  }),

  updateCard: withStoreErrorHandler(
    set,
    async ({ id, title, description, order_index, column_id }) => {
      await updateBoardCard({ id, title, description, order_index, column_id });
      if (get().boardData) {
        set((state) => ({
          boardData: {
            ...state.boardData!,
            columns: state.boardData!.columns.map((col) => ({
              ...col,
              cards: col.cards.map((card) =>
                card.id === id
                  ? { ...card, title, description, order_index, column_id }
                  : card,
              ),
            })),
          },
        }));
      }
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
    // Exit if the cards are the same or if board data is not loaded
    const board = get().boardData;
    if (!board || activeCardId === targetCardId) return;

    // Find the original and target column
    const originalColumnIndex = board.columns.findIndex((col) =>
      col.cards.some((card) => card.id === activeCardId),
    );
    const originalColumn = board.columns[originalColumnIndex];
    const targetColumnIndex = board.columns.findIndex(
      (col) => col.column.id === targetColumnId,
    );
    const targetColumn = board.columns[targetColumnIndex];

    if (originalColumnIndex === -1 || targetColumnIndex === -1) return;

    // Copy the arrays for mutability
    const boardColumns = [...board.columns];

    // Find the cards that are being moved
    const movedCardIndex = originalColumn.cards.findIndex(
      (card) => card.id === activeCardId,
    );
    let targetCardIndex = -1;
    if (targetCardId === null) {
      targetCardIndex = targetColumn.cards.length;
    } else {
      targetCardIndex = targetColumn.cards.findIndex(
        (card) => card.id === targetCardId,
      );
    }

    if (movedCardIndex === -1 || targetCardIndex === -1) return;

    const [movedCard] = originalColumn.cards.splice(movedCardIndex, 1);

    // Update the moved card's column_id if moving between columns
    if (originalColumnIndex !== targetColumnIndex) {
      movedCard.column_id = targetColumnId;
    }

    // Handle same column vs different column scenarios
    if (originalColumnIndex === targetColumnIndex) {
      // Moving within the same column - simpler logic
      const updatedCards = [...originalColumn.cards];
      updatedCards.splice(targetCardIndex, 0, movedCard);

      // Update order indexes
      const reorderedCards = updatedCards.map((card, idx) => ({
        ...card,
        order_index: idx,
      }));

      boardColumns[originalColumnIndex] = {
        ...originalColumn,
        cards: reorderedCards,
      };
    } else {
      // Moving between different columns
      const originalCards = [...originalColumn.cards];
      const targetCards = [...targetColumn.cards];

      // Insert into target column at the target position
      targetCards.splice(targetCardIndex, 0, movedCard);

      // Update order indexes for both columns
      const updatedOriginalCards = originalCards.map((card, idx) => ({
        ...card,
        order_index: idx,
      }));

      const updatedTargetCards = targetCards.map((card, idx) => ({
        ...card,
        order_index: idx,
      }));

      // Update both columns
      boardColumns[originalColumnIndex] = {
        ...originalColumn,
        cards: updatedOriginalCards,
      };

      boardColumns[targetColumnIndex] = {
        ...targetColumn,
        cards: updatedTargetCards,
      };
    }

    // Update the state
    set((state) => ({
      boardData: state.boardData
        ? { ...state.boardData, columns: boardColumns }
        : null,
    }));

    // Update the backend - only update cards that actually changed
    try {
      const cardsToUpdate = [];

      if (originalColumnIndex === targetColumnIndex) {
        // Only update cards in the same column
        cardsToUpdate.push(...boardColumns[originalColumnIndex].cards);
      } else {
        // Update cards in both columns
        cardsToUpdate.push(
          ...boardColumns[originalColumnIndex].cards,
          ...boardColumns[targetColumnIndex].cards,
        );
      }

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
      set({ error: String(error) });
    }
  },

  handleDragStart: (event) => {
    set({ activeDraggingId: event.active.id as string });
    console.log("DRAG START:", {
      activeId: event.active.id,
      activeType: String(event.active.id).split("-")[0],
    });
  },

  handleDragEnd: async (event) => {
    const { active, over } = event;

    console.log("DRAG END:", {
      activeId: active.id,
      overId: over?.id,
      hasOver: !!over,
    });

    set({ activeDraggingId: null });
    if (!over || active.id === over.id) {
      console.log("No valid drop target or same position");
      return;
    }

    const activeParts = String(active.id).split("-");
    const targetParts = String(over.id).split("-");

    const activeType = activeParts[0];
    const targetType = targetParts[0];

    if (activeType === "column") {
      let targetColumnId: number;

      if (targetType === "column") {
        // Dropped on column directly
        targetColumnId = Number(targetParts[1]);
      } else if (targetType === "card") {
        // Dropped on card - extract column ID from card
        targetColumnId = Number(targetParts[3]); // card-{cardId}-column-{columnId}
        console.log(
          "COLUMN dropped on CARD - extracted column:",
          targetColumnId,
        );
      } else {
        console.log("Invalid drop target for column");
        return;
      }

      const activeColumnId = Number(activeParts[1]);
      console.log("📋 COLUMN REORDER:", { activeColumnId, targetColumnId });
      return;
    }

    // Handle card movements (unchanged)
    if (activeType === "card") {
      const activeCardId = Number(activeParts[1]);

      if (targetType === "card") {
        const targetCardId = Number(targetParts[1]);
        const targetColumnId = Number(targetParts[3]);
        get().reorderCard({ activeCardId, targetCardId, targetColumnId });
      } else if (targetType === "column") {
        const targetColumnId = Number(targetParts[1]);
        get().reorderCard({ activeCardId, targetCardId: null, targetColumnId });
      }
    }
  },
}));
