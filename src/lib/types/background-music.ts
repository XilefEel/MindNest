import { WithBase } from "./base";

export type NewBackgroundMusic = {
  nestId: number;
  title: string;
  filePath: string;
  durationSeconds: number;
};

export type BackgroundMusic = WithBase<NewBackgroundMusic>;
