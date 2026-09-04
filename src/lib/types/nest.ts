import { WithBase } from "./base";

export type NewNest = {
  title: string;
};

export type Nest = WithBase<NewNest>;
