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
  ColumnType,
  DbCell,
  DbColumn,
  FilterCondition,
} from "../types/database";

export const COLUMN_TYPES: {
  value: ColumnType;
  label: string;
  Icon: LucideIcon;
}[] = [
  { value: "text", label: "Text", Icon: Type },
  { value: "number", label: "Number", Icon: Hash },
  { value: "checkbox", label: "Checkbox", Icon: SquareCheckBig },
  { value: "date", label: "Date", Icon: Calendar },
  { value: "select", label: "Select", Icon: Tag },
  { value: "created_at", label: "Created at", Icon: Clock },
  { value: "last_modified", label: "Last modified", Icon: ClockPlus },
];

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
      return raw === filter.value;
    default:
      return raw.toLowerCase().includes(filter.value.toLowerCase());
  }
};
