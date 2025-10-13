import { WithBase } from "./base";

export type NewNest = {
  user_id: number;
  title: string;
};

export type Nest = WithBase<NewNest>;
