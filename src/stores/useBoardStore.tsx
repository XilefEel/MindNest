import * as boardApi from "@/lib/api/board";
import {
  BoardCard,
  BoardColumn,
  BoardData,
  NewBoardCard,
  NewBoardColumn,
} from "@/lib/types/board";
import {
  mergeWithCurrent,
  parseDragData,
  withStoreErrorHandler,
} from "@/lib/utils/general";
import { DragEndEvent, DragStartEvent, DragMoveEvent } from "@dnd-kit/core";
import { create } from "zustand";
import { sortCards } from "@/lib/utils/boards";
import { useShallow } from "zustand/react/shallow";
import { arrayMove } from "@dnd-kit/sortable";
import { updateNestlingTimestamp } from "@/lib/utils/nestlings";

type BoardState = {
  columns: BoardColumn[];
  cards: BoardCard[];

  boardData: BoardData | null;
  activeDraggingId: string | null;
  activeColumn: BoardColumn | null;
  activeCard: BoardCard | null;
  loading: boolean;

  getBoard: (nestlingId: number) => Promise<void>;

  createColumn: (column: NewBoardColumn) => Promise<void>;
  duplicateColumn: (column: BoardColumn) => Promise<void>;
  updateColumn: (id: number, updates: Partial<BoardColumn>) => Promise<void>;
  removeColumn: (columnId: number) => Promise<void>;

  createCard: (card: NewBoardCard) => Promise<void>;
  duplicateCard: (card: BoardCard) => Promise<void>;
  updateCard: (id: number, updates: Partial<BoardCard>) => Promise<void>;
  deleteCard: (cardId: number) => Promise<void>;

  handleDragStart: (event: DragStartEvent) => void;
  handleDragMove: (event: DragMoveEvent) => void;
  handleDragEnd: (event: DragEndEvent) => Promise<void>;
};

export const useBoardStore = create<BoardState>((set, get) => ({
  columns: [],
  cards: [],
  boardData: null,
  loading: false,

  activeDraggingId: null,
  activeColumn: null,
  activeCard: null,

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

  updateCard: withStoreErrorHandler(set, async (id, updates) => {
    const current = get().cards.find((c) => c.id === id);
    if (!current) throw new Error("Card not found");

    const column = get().columns.find((col) => col.id === current.columnId);
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
      cards: state.cards.map((card) => (card.id === id ? updated : card)),
    }));
  }),

  deleteCard: withStoreErrorHandler(set, async (cardId) => {
    await boardApi.deleteBoardCard(cardId);

    const currentCard = get().cards.find((card) => card.id === cardId)!;

    set((state) => ({
      cards: state.cards.filter((card) => card.id !== cardId),
    }));

    await updateNestlingTimestamp(
      get().columns.find((col) => col.id === currentCard.columnId)!.nestlingId,
    );
  }),

  handleDragStart: (event) => {
    const activeData = parseDragData(event.active);

    if (!activeData) {
      set({ activeDraggingId: null, activeColumn: null, activeCard: null });
      return;
    }

    set({ activeDraggingId: event.active.id as string });

    if (activeData.type === "column") {
      set({ activeColumn: activeData.column, activeCard: null });
      return;
    }

    if (activeData.type === "card") {
      set({ activeCard: activeData.card, activeColumn: null });
      return;
    }
  },

  handleDragMove: (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const activeData = parseDragData(active);
    const overData = parseDragData(over);

    if (!activeData || !overData || activeData.type !== "card") return;

    const { cards } = get();

    if (overData.type === "card") {
      const activeIndex = cards.findIndex((c) => c.id === active.id);
      const overIndex = cards.findIndex((c) => c.id === over.id);

      if (activeIndex === -1 || overIndex === -1) return;

      if (cards[activeIndex].columnId !== cards[overIndex].columnId) {
        cards[activeIndex].columnId = cards[overIndex].columnId;
      }

      set({ cards: arrayMove(cards, activeIndex, overIndex) });
      return;
    }

    if (overData.type === "column") {
      const activeIndex = cards.findIndex((c) => c.id === active.id);
      if (activeIndex === -1) return;

      cards[activeIndex].columnId = over.id as number;

      set({ cards: arrayMove(cards, activeIndex, activeIndex) });
    }
  },

  handleDragEnd: async (event) => {
    const { active, over } = event;
    set({ activeDraggingId: null, activeColumn: null, activeCard: null });

    const activeData = parseDragData(active);
    if (!activeData) return;

    if (activeData.type === "column") {
      if (!over || active.id === over.id) return;

      set((state) => {
        const activeIndex = state.columns.findIndex((c) => c.id === active.id);
        const overIndex = state.columns.findIndex((c) => c.id === over.id);

        return { columns: arrayMove(state.columns, activeIndex, overIndex) };
      });

      const indexed = get().columns.map((col, i) => ({
        ...col,
        orderIndex: i,
      }));

      set({ columns: indexed });

      await Promise.all(indexed.map((col) => boardApi.updateBoardColumn(col)));
      await updateNestlingTimestamp(indexed[0].nestlingId);

      return;
    }

    if (activeData.type === "card") {
      const { cards, columns } = get();

      const indexed = cards.map((card) => {
        const cardsInColumn = cards.filter((c) => c.columnId === card.columnId);
        return {
          ...card,
          orderIndex: cardsInColumn.findIndex((c) => c.id === card.id),
        };
      });

      set({ cards: indexed });

      await Promise.all(indexed.map((card) => boardApi.updateBoardCard(card)));

      const movedCard = indexed.find((c) => c.id === active.id)!;

      await updateNestlingTimestamp(
        columns.find((col) => col.id === movedCard.columnId)!.nestlingId,
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
      handleDragMove: state.handleDragMove,
      handleDragEnd: state.handleDragEnd,
    })),
  );
