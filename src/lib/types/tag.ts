import { WithBase } from "./base";

export type Tag = WithBase<NewTag>;

export type NewTag = {
  nestId: number;
  name: string;
  color: string;
};
