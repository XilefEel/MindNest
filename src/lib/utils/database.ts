import {
  Calendar,
  Clock,
  ClockPlus,
  Hash,
  LucideIcon,
  SquareCheckBig,
  Tag,
  Type,
} from "lucide-react";
import {
  BoardGroups,
  ColumnType,
  DbCell,
  DbColumn,
  DbRowData,
  FilterCondition,
} from "../types/database";

export const COLUMN_TYPES: Record<
  ColumnType,
  {
    label: string;
    Icon: LucideIcon;
  }
> = {
  text: { label: "Text", Icon: Type },
  number: { label: "Number", Icon: Hash },
  checkbox: { label: "Checkbox", Icon: SquareCheckBig },
  date: { label: "Date", Icon: Calendar },
  select: { label: "Select", Icon: Tag },
  created_at: { label: "Created at", Icon: Clock },
  last_modified: { label: "Last modified", Icon: ClockPlus },
};

export const compareRowsByColumn = (
  column: DbColumn,
  a: DbRowData,
  b: DbRowData,
  dir: 1 | -1,
): number => {
  if (column.columnType === "created_at") {
    return dir * a.row.createdAt.localeCompare(b.row.createdAt);
  }

  if (column.columnType === "last_modified") {
    return dir * a.row.updatedAt.localeCompare(b.row.updatedAt);
  }

  const aCell = a.cells.find((c) => c.columnId === column.id);
  const bCell = b.cells.find((c) => c.columnId === column.id);

  switch (column.columnType) {
    case "number": {
      const aNum = parseFloat(aCell?.value ?? "");
      const bNum = parseFloat(bCell?.value ?? "");
      if (isNaN(aNum) && isNaN(bNum)) return 0;
      if (isNaN(aNum)) return 1;
      if (isNaN(bNum)) return -1;
      return dir * (aNum - bNum);
    }

    case "select": {
      const aOption = column.options.find((o) => String(o.id) === aCell?.value);
      const bOption = column.options.find((o) => String(o.id) === bCell?.value);
      if (!aOption && !bOption) return 0;
      if (!aOption) return 1;
      if (!bOption) return -1;
      return dir * (aOption.orderIndex - bOption.orderIndex);
    }

    case "checkbox": {
      const aVal = aCell?.value === "true" ? 1 : 0;
      const bVal = bCell?.value === "true" ? 1 : 0;
      return dir * (aVal - bVal);
    }

    // text, date
    default: {
      const aVal = aCell?.value ?? "";
      const bVal = bCell?.value ?? "";
      if (!aVal && !bVal) return 0;
      if (!aVal) return 1;
      if (!bVal) return -1;
      return dir * aVal.localeCompare(bVal, undefined, { numeric: true });
    }
  }
};

export const filterRows = (
  rows: DbRowData[],
  columns: DbColumn[],
  filters: FilterCondition[],
): DbRowData[] => {
  if (filters.length === 0) return rows;

  return rows.filter((rowData) =>
    filters.every((filter) => {
      if (!filter.value) return true;

      const column = columns.find((c) => c.id === filter.columnId);
      if (!column) return true;

      const cell = rowData.cells.find((c) => c.columnId === filter.columnId);
      return matchesFilter(column, cell, filter);
    }),
  );
};

export const sortRows = (
  rows: DbRowData[],
  columns: DbColumn[],
  sortColumnId: number | null,
  sortDirection: "asc" | "desc",
): DbRowData[] => {
  if (!sortColumnId) return rows;

  const column = columns.find((col) => col.id === sortColumnId);
  if (!column) return rows;

  const dir = sortDirection === "asc" ? 1 : -1;
  return rows.toSorted((a, b) => compareRowsByColumn(column, a, b, dir));
};

export const matchesFilter = (
  column: DbColumn,
  cell: DbCell | undefined,
  filter: FilterCondition,
): boolean => {
  const raw = cell?.value ?? "";

  switch (column.columnType) {
    case "number":
      return parseFloat(raw) === parseFloat(filter.value);

    case "select":
      return raw === filter.value;

    case "checkbox":
      const isChecked = raw === "true";
      return String(isChecked) === filter.value;

    default:
      return raw.toLowerCase().includes(filter.value.toLowerCase());
  }
};

export const reorderRowsAt = (
  rows: DbRowData[],
  fromIndex: number,
  toIndex: number,
): DbRowData[] => {
  const reordered = [...rows];
  const [moved] = reordered.splice(fromIndex, 1);
  reordered.splice(toIndex, 0, moved);

  return reordered.map((rowData, idx) => ({
    ...rowData,
    row: { ...rowData.row, orderIndex: idx },
  }));
};

export const groupRowsBySelectOption = (
  rows: DbRowData[],
  column: DbColumn,
): BoardGroups => {
  const sortedOptions = column.options.toSorted(
    (a, b) => a.orderIndex - b.orderIndex,
  );

  const groups: BoardGroups = {};

  for (const option of sortedOptions) {
    groups[String(option.id)] = [];
  }

  groups["no-value"] = [];

  for (const rowData of rows) {
    const cell = rowData.cells.find((c) => c.columnId === column.id);
    const key =
      cell?.value && groups[cell.value] !== undefined ? cell.value : "no-value";

    groups[key].push({ ...rowData, id: rowData.row.id });
  }

  return groups;
};

export const getCardTitleColumn = (
  columns: { id: number; orderIndex: number; columnType: string }[],
) => {
  const sorted = columns.toSorted((a, b) => a.orderIndex - b.orderIndex);
  return (
    sorted.find(
      (col) => col.columnType !== "select" && col.columnType !== "checkbox",
    ) ?? null
  );
};
