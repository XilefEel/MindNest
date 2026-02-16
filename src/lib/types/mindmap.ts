import { WithBase } from "./base";

export type NewMindmapNode = {
  nestlingId: number;
  position: { x: number; y: number };
  height: number;
  width: number;
  data: {
    label: string;
    color: string;
  };
  type: string;
};

export type MindmapNode = Omit<WithBase<NewMindmapNode>, "id"> & { id: string };

export type NewMindmapEdge = {
  source: string;
  target: string;
};

export type MindmapEdge = Omit<WithBase<NewMindmapEdge>, "id"> & { id: string };
