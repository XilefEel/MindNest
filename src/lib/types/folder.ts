import { WithBase } from "./base";

export type NewFolder = {
  nestId: number;
  parentId: number | null;
  name: string;
};

export type Folder = WithBase<NewFolder>;
