import { WithBase } from "./base";

export type NewBackgroundImage = {
  nest_id: number;
  file_path: string;
  is_selected: boolean;
  width: number;
  height: number;
};

export type BackgroundImage = WithBase<NewBackgroundImage>;
