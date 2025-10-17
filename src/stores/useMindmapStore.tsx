import {
  MindmapEdge,
  MindmapNode,
  NewMindmapEdge,
  NewMindmapNode,
} from "@/lib/types/mindmap";
import { create } from "zustand";

type MindmapState = {
  nodes: MindmapNode[];
  edges: MindmapEdge[];
  selectedNode: any;

  loading: boolean;
  error: any;

  setSelectedNode: (node: any) => void;
  addNode: (node: NewMindmapNode) => Promise<MindmapNode>;
  fetchNodes: (nestlingId: number) => Promise<void>;
  updateNode: (nodeId: number, updates: any) => void;
  deleteNode: (nodeId: number) => Promise<void>;

  addEdge: (edge: NewMindmapEdge) => Promise<MindmapEdge>;
  fetchEdges: (nestlingId: number) => Promise<void>;
  updateEdge: (edge: any) => Promise<void>;
  deleteEdge: (id: number) => Promise<void>;
};

export const useMindmapStore = create<MindmapState>((set) => ({
  nodes: [],
  edges: [],
  selectedNode: null,

  loading: false,
  error: null,
}));
