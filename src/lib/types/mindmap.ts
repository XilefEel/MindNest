import { BaseModel, WithBase } from "./base";

export type NewMindmapNode = {
  nestling_id: number;
  position: { x: number; y: number };
  height: number;
  width: number;
  data: {
    label: string;
    color: string;
    text_color: string;
  };
  node_type: string;
};

export type MindmapNode = Omit<WithBase<NewMindmapNode>, "id"> & { id: string };

export type NewMindmapNodeDB = Omit<MindmapNodeDB, keyof BaseModel>;

export type MindmapNodeDB = WithBase<{
  nestling_id: number;
  position_x: number;
  position_y: number;
  height: number;
  width: number;
  label: string;
  color: string;
  textColor: string;
  nodeType: string;
}>;

export type NewMindmapEdge = {
  source: string;
  target: string;
};

export type MindmapEdge = Omit<WithBase<NewMindmapEdge>, "id"> & { id: string };

export type NewMindmapEdgeDB = Omit<MindmapEdgeDB, keyof BaseModel>;

export type MindmapEdgeDB = WithBase<{
  source_id: number;
  target_id: number;
}>;
