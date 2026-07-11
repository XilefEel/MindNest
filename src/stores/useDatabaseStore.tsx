import { DbColumn, DbRowData } from "@/lib/types/database";
import { mergeWithCurrent, withStoreErrorHandler } from "@/lib/utils/general";
import { create } from "zustand";
import * as dbApi from "@/lib/api/database";
import { useShallow } from "zustand/react/shallow";
import { updateNestlingTimestamp } from "@/lib/utils/nestlings";

type DatabaseState = {
  columns: DbColumn[];
  rows: DbRowData[];
  loading: boolean;

  getDbData: (nestlingId: number) => Promise<void>;
  createColumn: (
    nestlingId: number,
    name: string,
    columnType: string,
  ) => Promise<void>;
  updateColumn: (id: number, updates: Partial<DbColumn>) => Promise<void>;
  moveColumn: (id: number, direction: "left" | "right") => Promise<void>;
  deleteColumn: (id: number) => Promise<void>;

  createColumnOption: (
    columnId: number,
    label: string,
    color: string,
  ) => Promise<void>;
  updateColumnOption: (
    columnId: number,
    optionId: number,
    updates: { label?: string; color?: string; orderIndex?: number },
  ) => Promise<void>;
  deleteColumnOption: (columnId: number, optionId: number) => Promise<void>;

  createRow: (nestlingId: number) => Promise<void>;
  deleteRow: (id: number) => Promise<void>;

  insertCell: (
    rowId: number,
    columnId: number,
    value: string | null,
  ) => Promise<void>;
};
export const useDatabaseStore = create<DatabaseState>()((set, get) => ({
  nestlingId: null,
  columns: [],
  rows: [],
  loading: false,

  getDbData: withStoreErrorHandler(set, async (nestlingId: number) => {
    const data = await dbApi.getDbData(nestlingId);
    set({ columns: data.columns, rows: data.rows });
  }),

  createColumn: withStoreErrorHandler(
    set,
    async (nestlingId: number, name: string, columnType: string) => {
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

  createColumnOption: withStoreErrorHandler(
    set,
    async (columnId: number, label: string, color: string) => {
      const column = get().columns.find((col) => col.id === columnId);
      if (!column) throw new Error("Column not found");

      const option = await dbApi.createColumnOption({
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
    },
  ),

  updateColumnOption: withStoreErrorHandler(
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

      await dbApi.updateColumnOption(
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

  deleteColumnOption: withStoreErrorHandler(
    set,
    async (columnId: number, optionId: number) => {
      const column = get().columns.find((col) => col.id === columnId);
      if (!column) throw new Error("Column not found");

      await dbApi.deleteColumnOption(optionId);

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

  createRow: withStoreErrorHandler(set, async (nestlingId: number) => {
    const orderIndex = get().rows.length;
    const row = await dbApi.createDbRow({ nestlingId, orderIndex });

    set((state) => ({ rows: [...state.rows, { row, cells: [] }] }));

    await updateNestlingTimestamp(nestlingId);
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

          return { ...rowData, cells };
        }),
      }));

      await updateNestlingTimestamp(
        get().rows.find((rowData) => rowData.row.id === rowId)?.row.nestlingId!,
      );
    },
  ),
}));

export const useDbActions = () =>
  useDatabaseStore(
    useShallow((state) => ({
      getDbData: state.getDbData,
      createColumn: state.createColumn,
      updateColumn: state.updateColumn,
      moveColumn: state.moveColumn,
      deleteColumn: state.deleteColumn,

      createColumnOption: state.createColumnOption,
      updateColumnOption: state.updateColumnOption,
      deleteColumnOption: state.deleteColumnOption,

      createRow: state.createRow,
      deleteRow: state.deleteRow,
      insertCell: state.insertCell,
    })),
  );

export const useDbColumns = () => useDatabaseStore((state) => state.columns);

export const useDbRows = () => useDatabaseStore((state) => state.rows);
