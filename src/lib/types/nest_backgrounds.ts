import { WithBase } from "./base";

export type NewBackgroundImage = {
  nestId: number;
  filePath: string;
  isSelected: boolean;
  width: number;
  height: number;
};

export type BackgroundImage = WithBase<NewBackgroundImage>;
