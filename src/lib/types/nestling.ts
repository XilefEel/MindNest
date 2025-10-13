import { WithBase } from "./base";

export type NewNestling = {
  nest_id: number;
  folder_id: number | null;
  nestling_type: string;
  title: string;
  content: string;
};

export type Nestling = WithBase<NewNestling>;
