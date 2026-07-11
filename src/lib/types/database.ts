import { WithBase } from "./base";
import { Nestling } from "./nestling";

export type NewDbColumn = {
  nestlingId: number;
  name: string;
  columnType: string;
  orderIndex: number;
};

export type DbColumn = WithBase<NewDbColumn> & {
  options: DbSelectOption[];
};

export type NewDbRow = {
  nestlingId: number;
  orderIndex: number;
};

export type DbRow = WithBase<NewDbRow>;

export type NewDbCell = {
  rowId: number;
  columnId: number;
  value: string | null;
};

export type DbCell = WithBase<NewDbCell>;

export type NewDbSelectOption = {
  columnId: number;
  label: string;
  color: string;
  orderIndex: number;
};

export type DbSelectOption = WithBase<NewDbSelectOption>;

export type DbRowData = {
  row: DbRow;
  cells: DbCell[];
};

export type DbData = {
  nestling: Nestling;
  columns: DbColumn[];
  rows: DbRowData[];
};
