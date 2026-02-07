import { WithBase } from "./base";

export type Tag = WithBase<NewTag>;

export type NewTag = {
  nest_id: number;
  name: string;
  color: string;
};
