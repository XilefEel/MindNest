import { DbColumn, DbRowData } from "@/lib/types/database";
import { withStoreErrorHandler } from "@/lib/utils/general";
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
  updateColumn: (id: number, name: string, orderIndex: number) => Promise<void>;
  deleteColumn: (id: number) => Promise<void>;

  createRow: (nestlingId: number) => Promise<void>;
  deleteRow: (id: number) => Promise<void>;

  insertCell: (
    rowId: number,
    columnId: number,
    value: string | null,
    nestlingId: number,
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

  updateColumn: withStoreErrorHandler(
    set,
    async (id: number, name: string, orderIndex: number) => {
      await dbApi.updateDbColumn({ id, name, orderIndex });

      set((state) => ({
        columns: state.columns.map((col) =>
          col.id === id ? { ...col, name, orderIndex } : col,
        ),
      }));

      await updateNestlingTimestamp(
        get().columns.find((col) => col.id === id)?.nestlingId!,
      );
    },
  ),

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
      const cell = await dbApi.upsertDbCell({ rowId, columnId, value });

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
      deleteColumn: state.deleteColumn,
      createRow: state.createRow,
      deleteRow: state.deleteRow,
      insertCell: state.insertCell,
    })),
  );

export const useDbColumns = () => useDatabaseStore((state) => state.columns);

export const useDbRows = () => useDatabaseStore((state) => state.rows);
