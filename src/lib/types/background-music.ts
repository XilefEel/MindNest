import { WithBase } from "./base";

export type NewBackgroundMusic = {
  nestId: number;
  title: string;
  filePath: string;
  durationSeconds: number;
  orderIndex: number;
  isSelected: boolean;
};

export type BackgroundMusic = WithBase<NewBackgroundMusic>;
