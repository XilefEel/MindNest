import {
  DbColumn,
  DbSelectOption,
  DbRowData,
  ColumnType,
  FilterCondition,
  BoardGroups,
} from "@/lib/types/database";
import { mergeWithCurrent, withStoreErrorHandler } from "@/lib/utils/general";
import { create } from "zustand";
import * as dbApi from "@/lib/api/database";
import { useShallow } from "zustand/react/shallow";
import { updateNestlingTimestamp } from "@/lib/utils/nestlings";
import { DragEndEvent, DragMoveEvent, DragStartEvent } from "@dnd-kit/react";
import { isSortable } from "@dnd-kit/react/sortable";
import {
  filterRows,
  groupRowsBySelectOption,
  reorderRowsAt,
  sortRows,
} from "@/lib/utils/database";
import { move } from "@dnd-kit/helpers";

let snapshot: BoardGroups = {};

type DatabaseState = {
  columns: DbColumn[];
  rows: DbRowData[];
  loading: boolean;

  viewMode: "table" | "board";
  setViewMode: (mode: "table" | "board") => void;

  getDbData: (nestlingId: number) => Promise<void>;
  createColumn: (
    nestlingId: number,
    name: string,
    columnType: ColumnType,
  ) => Promise<void>;
  updateColumn: (id: number, updates: Partial<DbColumn>) => Promise<void>;
  moveColumn: (id: number, direction: "left" | "right") => Promise<void>;
  deleteColumn: (id: number) => Promise<void>;

  createSelectOption: (
    columnId: number,
    label: string,
    color: string,
  ) => Promise<DbSelectOption>;
  updateSelectOption: (
    columnId: number,
    optionId: number,
    updates: { label?: string; color?: string; orderIndex?: number },
  ) => Promise<void>;
  deleteSelectOption: (columnId: number, optionId: number) => Promise<void>;
  reorderSelectOptions: (
    columnId: number,
    event: DragEndEvent,
  ) => Promise<void>;

  createRow: (nestlingId: number) => Promise<void>;
  addRowBelow: (rowId: number) => Promise<void>;
  duplicateRow: (rowId: number) => Promise<void>;
  deleteRow: (id: number) => Promise<void>;
  moveRow: (id: number, direction: "up" | "down") => Promise<void>;
  handleRowDragEnd: (event: DragEndEvent) => Promise<void>;

  insertCell: (
    rowId: number,
    columnId: number,
    value: string | null,
  ) => Promise<void>;

  sortColumnId: number | null;
  sortDirection: "asc" | "desc" | null;
  setSort: (columnId: number | null, order: "asc" | "desc" | null) => void;

  filters: FilterCondition[];
  addFilter: (columnId: number) => void;
  updateFilter: (id: string, value: string) => void;
  removeFilter: (id: string) => void;
  clearFilters: () => void;

  boardGroups: BoardGroups;
  boardGroupColumnId: number | null;
  setBoardGroupColumn: (columnId: number | null) => void;

  computeBoardGroups: () => void;
  handleDragStart: (event: DragStartEvent) => void;
  handleDragOver: (event: DragMoveEvent) => void;
  handleDragEnd: (event: DragEndEvent) => void;
};
export const useDatabaseStore = create<DatabaseState>()((set, get) => ({
  nestlingId: null,
  columns: [],
  rows: [],
  loading: false,

  sortColumnId: null,
  sortDirection: "asc",
  viewMode: "table",

  boardGroups: {},
  boardGroupColumnId: null,

  filters: [],

  setViewMode: (mode) => set({ viewMode: mode }),

  setBoardGroupColumn: (columnId) => set({ boardGroupColumnId: columnId }),

  getDbData: withStoreErrorHandler(set, async (nestlingId: number) => {
    const data = await dbApi.getDbData(nestlingId);
    set({ columns: data.columns, rows: data.rows });
  }),

  createColumn: withStoreErrorHandler(
    set,
    async (nestlingId: number, name: string, columnType: ColumnType) => {
      const orderIndex = get().columns.length;
      const column = await dbApi.createDbColumn({
        nestlingId,
        name,
        columnType,
        orderIndex,
      });

      set((state) => ({ columns: [...state.columns, column] }));

      await updateNestlingTimestamp(nestlingId);
    },
  ),

  updateColumn: withStoreErrorHandler(set, async (id, updates) => {
    const currentColumn = get().columns.find((col) => col.id === id);
    if (!currentColumn) throw new Error("Column not found");

    const updated = mergeWithCurrent(currentColumn, updates);

    if (updates.columnType && updates.columnType !== currentColumn.columnType) {
      await dbApi.clearCellsByColumn(id);
    }

    set((state) => ({
      columns: state.columns.map((col) => (col.id === id ? updated : col)),

      rows: state.rows.map((rowData) => ({
        ...rowData,
        cells: rowData.cells.map((cell) =>
          cell.columnId === id ? { ...cell, value: null } : cell,
        ),
      })),
    }));

    await dbApi.updateDbColumn({ ...updated, id });

    await updateNestlingTimestamp(
      get().columns.find((col) => col.id === id)?.nestlingId!,
    );
  }),

  moveColumn: withStoreErrorHandler(set, async (id, direction) => {
    const columns = get().columns;
    const index = columns.findIndex((col) => col.id === id);

    const swapIndex = direction === "left" ? index - 1 : index + 1;

    if (swapIndex < 0 || swapIndex >= columns.length) return;

    const column = columns[index];
    const swapColumn = columns[swapIndex];

    await Promise.all([
      dbApi.updateDbColumn({ ...column, orderIndex: swapColumn.orderIndex }),
      dbApi.updateDbColumn({ ...swapColumn, orderIndex: column.orderIndex }),
    ]);

    set((state) => ({
      columns: state.columns
        .map((col) => {
          if (col.id === column.id)
            return { ...col, orderIndex: swapColumn.orderIndex };

          if (col.id === swapColumn.id)
            return { ...col, orderIndex: column.orderIndex };

          return col;
        })
        .sort((a, b) => a.orderIndex - b.orderIndex),
    }));

    await updateNestlingTimestamp(column.nestlingId);
  }),

  deleteColumn: withStoreErrorHandler(set, async (id: number) => {
    await dbApi.deleteDbColumn(id);

    set((state) => ({
      columns: state.columns.filter((col) => col.id !== id),
      rows: state.rows.map((rowData) => ({
        ...rowData,
        cells: rowData.cells.filter((cell) => cell.columnId !== id),
      })),
    }));

    await updateNestlingTimestamp(
      get().columns.find((col) => col.id === id)?.nestlingId!,
    );
  }),

  createSelectOption: withStoreErrorHandler(
    set,
    async (columnId: number, label: string, color: string) => {
      const column = get().columns.find((col) => col.id === columnId);
      if (!column) throw new Error("Column not found");

      const option = await dbApi.createSelectOption({
        columnId,
        label,
        color,
        orderIndex: column.options.length,
      });

      set((state) => ({
        columns: state.columns.map((col) =>
          col.id === columnId
            ? { ...col, options: [...col.options, option] }
            : col,
        ),
      }));

      await updateNestlingTimestamp(column.nestlingId);
      return option;
    },
  ),

  updateSelectOption: withStoreErrorHandler(
    set,
    async (
      columnId: number,
      optionId: number,
      updates: { label?: string; color?: string; orderIndex?: number },
    ) => {
      const column = get().columns.find((col) => col.id === columnId);
      if (!column) throw new Error("Column not found");

      const currentOption = column.options.find((opt) => opt.id === optionId);
      if (!currentOption) throw new Error("Option not found");

      const updated = mergeWithCurrent(currentOption, updates);

      await dbApi.updateSelectOption(
        optionId,
        updated.label,
        updated.color,
        updated.orderIndex,
      );

      set((state) => ({
        columns: state.columns.map((col) =>
          col.id === columnId
            ? {
                ...col,
                options: col.options.map((opt) =>
                  opt.id === optionId ? updated : opt,
                ),
              }
            : col,
        ),
      }));

      await updateNestlingTimestamp(column.nestlingId);
    },
  ),

  deleteSelectOption: withStoreErrorHandler(
    set,
    async (columnId: number, optionId: number) => {
      const column = get().columns.find((col) => col.id === columnId);
      if (!column) throw new Error("Column not found");

      await dbApi.deleteSelectOption(optionId);

      set((state) => ({
        columns: state.columns.map((col) =>
          col.id === columnId
            ? {
                ...col,
                options: col.options.filter((opt) => opt.id !== optionId),
              }
            : col,
        ),

        rows: state.rows.map((rowData) => ({
          ...rowData,
          cells: rowData.cells.map((cell) =>
            cell.columnId === columnId && cell.value === String(optionId)
              ? { ...cell, value: null }
              : cell,
          ),
        })),
      }));

      await updateNestlingTimestamp(column.nestlingId);
    },
  ),

  reorderSelectOptions: withStoreErrorHandler(
    set,
    async (columnId: number, event: DragEndEvent) => {
      console.log("Reordering select options");
      const { source } = event.operation;
      if (!source) return;

      const column = get().columns.find((col) => col.id === columnId);
      if (!column) throw new Error("Column not found");

      if (isSortable(source)) {
        const { initialIndex, index } = source;

        if (initialIndex === index) return;

        const reordered = [...column.options];
        const [movedOption] = reordered.splice(initialIndex, 1);
        reordered.splice(index, 0, movedOption);

        const updatedOptions = reordered.map((opt, idx) => ({
          ...opt,
          orderIndex: idx,
        }));

        await Promise.all(
          updatedOptions.map((opt) =>
            dbApi.updateSelectOption(
              opt.id,
              opt.label,
              opt.color,
              opt.orderIndex,
            ),
          ),
        );

        set((state) => ({
          columns: state.columns.map((col) =>
            col.id === columnId ? { ...col, options: updatedOptions } : col,
          ),
        }));

        await updateNestlingTimestamp(column.nestlingId);
      }
    },
  ),

  createRow: withStoreErrorHandler(set, async (nestlingId: number) => {
    const orderIndex = get().rows.length;
    const row = await dbApi.createDbRow({ nestlingId, orderIndex });

    set((state) => ({ rows: [...state.rows, { row, cells: [] }] }));

    await updateNestlingTimestamp(nestlingId);
  }),

  addRowBelow: withStoreErrorHandler(set, async (rowId: number) => {
    const rows = get().rows;
    const index = rows.findIndex((r) => r.row.id === rowId);
    if (index === -1) return;

    const nestlingId = rows[index].row.nestlingId;
    const newRow = await dbApi.createDbRow({
      nestlingId,
      orderIndex: index + 1,
    });

    const withInserted = [
      ...rows.slice(0, index + 1),
      { row: newRow, cells: [] },
      ...rows.slice(index + 1),
    ].map((rowData, idx) => ({
      ...rowData,
      row: { ...rowData.row, orderIndex: idx },
    }));

    set({ rows: withInserted });
    await dbApi.reorderDbRows(withInserted.map((r) => r.row.id));

    await updateNestlingTimestamp(nestlingId);
  }),

  duplicateRow: withStoreErrorHandler(set, async (rowId: number) => {
    const original = get().rows.find((r) => r.row.id === rowId);
    if (!original) return;

    const newRowData = await dbApi.duplicateDbRow(rowId);

    set((state) => {
      const shifted = state.rows.map((rowData) =>
        rowData.row.orderIndex > original.row.orderIndex
          ? {
              ...rowData,
              row: { ...rowData.row, orderIndex: rowData.row.orderIndex + 1 },
            }
          : rowData,
      );
      return {
        rows: [...shifted, newRowData].sort(
          (a, b) => a.row.orderIndex - b.row.orderIndex,
        ),
      };
    });

    await updateNestlingTimestamp(newRowData.row.nestlingId);
  }),

  deleteRow: withStoreErrorHandler(set, async (id: number) => {
    await dbApi.deleteDbRow(id);

    set((state) => ({
      rows: state.rows.filter((rowData) => rowData.row.id !== id),
    }));

    await updateNestlingTimestamp(
      get().rows.find((rowData) => rowData.row.id === id)?.row.nestlingId!,
    );
  }),

  moveRow: withStoreErrorHandler(
    set,
    async (id: number, direction: "up" | "down") => {
      const rows = get().rows;
      const index = rows.findIndex((r) => r.row.id === id);
      if (index === -1) return;

      const swapIndex = direction === "up" ? index - 1 : index + 1;
      if (swapIndex < 0 || swapIndex >= rows.length) return;

      const withNewIndices = reorderRowsAt(rows, index, swapIndex);

      set({ rows: withNewIndices });
      await dbApi.reorderDbRows(withNewIndices.map((r) => r.row.id));

      const nestlingId = withNewIndices[0]?.row.nestlingId;
      if (nestlingId) await updateNestlingTimestamp(nestlingId);
    },
  ),

  handleRowDragEnd: withStoreErrorHandler(set, async (event: DragEndEvent) => {
    const { source } = event.operation;
    if (!source || !isSortable(source)) return;

    const { initialIndex, index } = source;
    if (initialIndex === index) return;

    const withNewIndices = reorderRowsAt(get().rows, initialIndex, index);
    set({ rows: withNewIndices });

    await dbApi.reorderDbRows(withNewIndices.map((r) => r.row.id));

    const nestlingId = withNewIndices[0]?.row.nestlingId;
    if (nestlingId) await updateNestlingTimestamp(nestlingId);
  }),

  insertCell: withStoreErrorHandler(
    set,
    async (rowId: number, columnId: number, value: string | null) => {
      const cell = await dbApi.insertDbCell({ rowId, columnId, value });

      set((state) => ({
        rows: state.rows.map((rowData) => {
          if (rowData.row.id !== rowId) return rowData;

          const exists = rowData.cells.some((c) => c.columnId === columnId);
          const cells = exists
            ? rowData.cells.map((c) => (c.columnId === columnId ? cell : c))
            : [...rowData.cells, cell];

          return {
            ...rowData,
            row: { ...rowData.row, updatedAt: cell.createdAt },
            cells,
          };
        }),
      }));

      await updateNestlingTimestamp(
        get().rows.find((rowData) => rowData.row.id === rowId)?.row.nestlingId!,
      );
    },
  ),

  setSort: (columnId, direction) => {
    set({ sortColumnId: columnId, sortDirection: direction });
  },

  addFilter: (columnId: number) => {
    set((state) => ({
      filters: [
        ...state.filters,
        { id: crypto.randomUUID(), columnId, value: "" },
      ],
    }));
  },

  updateFilter: (id: string, value: string) => {
    set((state) => ({
      filters: state.filters.map((f) => (f.id === id ? { ...f, value } : f)),
    }));
  },

  removeFilter: (id: string) => {
    set((state) => ({ filters: state.filters.filter((f) => f.id !== id) }));
  },

  clearFilters: () => {
    set({ filters: [] });
  },

  computeBoardGroups: () => {
    const state = get();
    const column = state.columns.find((c) => c.id === state.boardGroupColumnId);
    if (!column) {
      set({ boardGroups: {} });
      return;
    }

    const filtered = filterRows(state.rows, state.columns, state.filters);
    const sorted = sortRows(
      filtered,
      state.columns,
      state.sortColumnId,
      state.sortDirection!,
    );
    set({ boardGroups: groupRowsBySelectOption(sorted, column) });
  },

  handleDragStart: () => {
    snapshot = structuredClone(get().boardGroups);
  },

  handleDragOver: (event: DragMoveEvent) => {
    const { source } = event.operation;

    if (source && source.type === "column") {
      set((state) => ({
        columns: state.columns.map((col) => {
          if (col.id !== get().boardGroupColumnId!) return col;
          return {
            ...col,
            options: move(col.options, event),
          };
        }),
      }));
      return;
    }

    set((state) => ({ boardGroups: move(state.boardGroups, event) }));
  },
  handleDragEnd: withStoreErrorHandler(set, async (event: DragEndEvent) => {
    const { source } = event.operation;
    if (!source) return;

    if (event.canceled) {
      set({ boardGroups: snapshot });
      return;
    }

    console.log(source.type);

    if (source.type === "column") {
      const columnId = get().boardGroupColumnId;
      if (!columnId) return;

      const column = get().columns.find((c) => c.id === columnId);
      if (!column) return;

      const withNewIndices = column.options.map((opt, idx) => ({
        ...opt,
        orderIndex: idx,
      }));

      set((state) => ({
        columns: state.columns.map((col) =>
          col.id === columnId ? { ...col, options: withNewIndices } : col,
        ),
      }));

      await Promise.all(
        withNewIndices.map((opt) =>
          dbApi.updateSelectOption(
            opt.id,
            opt.label,
            opt.color,
            opt.orderIndex,
          ),
        ),
      );

      await updateNestlingTimestamp(column.nestlingId);
      return;
    }

    if (source.type === "card") {
      const rowId = Number(source.id);
      const groups = get().boardGroups;

      const newGroupKey = Object.entries(groups).find(([, rows]) =>
        rows.some((r) => r.row.id === rowId),
      )?.[0];

      const newValue = newGroupKey === "no-value" ? null : newGroupKey!;

      await get().insertCell(rowId, get().boardGroupColumnId!, newValue);
    }
  }),
}));

export const useDbActions = () =>
  useDatabaseStore(
    useShallow((state) => ({
      setViewMode: state.setViewMode,
      setBoardGroupColumn: state.setBoardGroupColumn,

      getDbData: state.getDbData,
      createColumn: state.createColumn,
      updateColumn: state.updateColumn,
      moveColumn: state.moveColumn,
      deleteColumn: state.deleteColumn,

      createSelectOption: state.createSelectOption,
      updateSelectOption: state.updateSelectOption,
      deleteSelectOption: state.deleteSelectOption,
      reorderSelectOptions: state.reorderSelectOptions,

      createRow: state.createRow,
      addRowBelow: state.addRowBelow,
      duplicateRow: state.duplicateRow,
      deleteRow: state.deleteRow,
      moveRow: state.moveRow,
      handleRowDragEnd: state.handleRowDragEnd,

      insertCell: state.insertCell,

      setSort: state.setSort,

      addFilter: state.addFilter,
      updateFilter: state.updateFilter,
      removeFilter: state.removeFilter,
      clearFilters: state.clearFilters,

      computeBoardGroups: state.computeBoardGroups,
      handleDragStart: state.handleDragStart,
      handleDragOver: state.handleDragOver,
      handleDragEnd: state.handleDragEnd,
    })),
  );

export const useDbColumns = () => useDatabaseStore((state) => state.columns);

export const useDbRows = () => useDatabaseStore((state) => state.rows);

export const useDbFilters = () => useDatabaseStore((state) => state.filters);

export const useDbViewMode = () => useDatabaseStore((state) => state.viewMode);

export const useDbBoardGroups = () =>
  useDatabaseStore((state) => state.boardGroups);

export const useDbBoardGroupColumnId = () =>
  useDatabaseStore((state) => state.boardGroupColumnId);

export const useSortColumnId = () =>
  useDatabaseStore((state) => state.sortColumnId);

export const useSortDirection = () =>
  useDatabaseStore((state) => state.sortDirection);

export const useVisibleDbRows = () =>
  useDatabaseStore(
    useShallow((state) => {
      const filtered = filterRows(state.rows, state.columns, state.filters);
      return sortRows(
        filtered,
        state.columns,
        state.sortColumnId,
        state.sortDirection!,
      );
    }),
  );
