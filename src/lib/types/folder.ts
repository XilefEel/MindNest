import { WithBase } from "./base";

export type NewFolder = {
  nest_id: number;
  parent_id: number | null;
  name: string;
};

export type Folder = WithBase<NewFolder>;
