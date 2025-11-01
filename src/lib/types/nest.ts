import { WithBase } from "./base";

export type NewNest = {
  userId: number;
  title: string;
};

export type Nest = WithBase<NewNest>;
