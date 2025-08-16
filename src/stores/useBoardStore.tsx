import {
  createBoardCard,
  createBoardColumn,
  deleteBoardCard,
  deleteBoardColumn,
  getBoard,
  updateBoardCard,
  updateBoardColumn,
} from "@/lib/nestlings";
import { BoardData, NewBoardCard, NewBoardColumn } from "@/lib/types";
import { create } from "zustand";

type BoardState = {
  boardData: BoardData | null; // The current board data
  error: string | null; // Error state for the board data

  fetchBoard: (nestlingId: number) => void; // Action to set the board data

  addColumn: (column: NewBoardColumn) => void; // Action to add a new column
  updateColumn: (
    id: number,
    title: string,
    order_index: number,
  ) => Promise<void>; // Action to update a column
  removeColumn: (columnId: number) => void; // Action to remove a column

  addCard: (card: NewBoardCard) => void; // Action to add a new
  updateCard: (
    id: number,
    title: string,
    description: string | null,
    order_index: number,
  ) => Promise<void>; // Action to update a card
  removeCard: (cardId: number) => void; // Action to remove a card
};

export const useBoardStore = create<BoardState>((set, get) => ({
  boardData: null,
  error: null,

  fetchBoard: async (nestlingId) => {
    set({ error: null });
    try {
      const data = await getBoard(nestlingId);
      set({ boardData: data });
    } catch (err) {
      set({ error: String(err) });
      console.error("Failed to fetch board data:", err);
    }
  },

  addColumn: async (column) => {
    try {
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
    } catch (err) {
      set({ error: String(err) });
      console.error("Failed to add column:", err);
    }
  },

  updateColumn: async (id, title, order_index) => {
    try {
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
    } catch (err) {
      set({ error: String(err) });
    }
  },

  removeColumn: async (columnId) => {
    try {
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
      await deleteBoardColumn(columnId);
    } catch (error) {
      set({ error: String(error) });
    }
  },
  addCard: async (card) => {
    try {
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
    } catch (err) {
      set({ error: String(err) });
    }
  },

  updateCard: async (id, title, description, order_index) => {
    try {
      await updateBoardCard({ id, title, description, order_index });
      if (get().boardData) {
        set((state) => ({
          boardData: {
            ...state.boardData!,
            columns: state.boardData!.columns.map((col) => ({
              ...col,
              cards: col.cards.map((card) =>
                card.id === id
                  ? { ...card, title, description, order_index }
                  : card,
              ),
            })),
          },
        }));
      }
    } catch (err) {
      set({ error: String(err) });
    }
  },

  removeCard: async (cardId) => {
    try {
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
    } catch (error) {
      set({ error: String(error) });
    }
  },
}));
