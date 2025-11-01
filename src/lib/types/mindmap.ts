import { BaseModel, WithBase } from "./base";

export type NewMindmapNode = {
  nestlingId: number;
  position: { x: number; y: number };
  height: number;
  width: number;
  data: {
    label: string;
    color: string;
    textColor: string;
  };
  type: string;
};

export type MindmapNode = Omit<WithBase<NewMindmapNode>, "id"> & { id: string };

export type NewMindmapNodeDB = Omit<MindmapNodeDB, keyof BaseModel>;

export type MindmapNodeDB = WithBase<{
  nestlingId: number;
  positionX: number;
  positionY: number;
  height: number;
  width: number;
  label: string;
  color: string;
  textColor: string;
  type: string;
}>;

export type NewMindmapEdge = {
  source: string;
  target: string;
};

export type MindmapEdge = Omit<WithBase<NewMindmapEdge>, "id"> & { id: string };

export type NewMindmapEdgeDB = Omit<MindmapEdgeDB, keyof BaseModel>;

export type MindmapEdgeDB = WithBase<{
  sourceId: number;
  targetId: number;
}>;
