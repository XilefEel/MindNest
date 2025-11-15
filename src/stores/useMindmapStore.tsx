import * as mindmapApi from "@/lib/api/mindmap";
import {
  MindmapNode,
  MindmapEdge,
  NewMindmapNode,
  NewMindmapEdge,
} from "@/lib/types/mindmap";
import { mergeWithCurrent, withStoreErrorHandler } from "@/lib/utils/general";
import { create } from "zustand";
import { useNestlingStore } from "./useNestlingStore";
import { useShallow } from "zustand/react/shallow";

type MindmapStore = {
  nodes: MindmapNode[];
  edges: MindmapEdge[];
  activeNode: MindmapNode | null;
  loading: boolean;
  error: string | null;

  setNodes: (node: MindmapNode[]) => void;
  setEdges: (edges: MindmapEdge[]) => void;

  createNode: (node: NewMindmapNode) => Promise<MindmapNode>;
  getNodes: (nestlingId: number) => Promise<void>;
  updateNode: (nodeId: number, updates: Partial<MindmapNode>) => Promise<void>;
  deleteNode: (nodeId: number) => Promise<void>;

  createEdge: (edge: NewMindmapEdge) => Promise<MindmapEdge>;
  getEdges: (nestlingId: number) => Promise<void>;
  deleteEdge: (id: number) => Promise<void>;
};

export const useMindmapStore = create<MindmapStore>((set, get) => ({
  nodes: [],
  edges: [],
  activeNode: null,
  loading: false,
  error: null,

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  createNode: withStoreErrorHandler(set, async (node: NewMindmapNode) => {
    const newNode = await mindmapApi.createNode(node);
    set((state) => ({
      nodes: [...state.nodes, newNode],
    }));
    useNestlingStore.getState().updateNestlingTimestamp(newNode.nestlingId);
    return newNode;
  }),

  getNodes: withStoreErrorHandler(set, async (nestlingId: number) => {
    const nodes = await mindmapApi.getNodes(nestlingId);
    set({ nodes, loading: false });
  }),

  updateNode: withStoreErrorHandler(set, async (nodeId, updates) => {
    const current = get().nodes.find((n) => n.id === nodeId.toString());
    if (!current) throw new Error("Node not found");
    const updated = mergeWithCurrent(current, updates);

    set((state) => ({
      nodes: state.nodes.map((n) => (n.id === nodeId.toString() ? updated : n)),
    }));

    await mindmapApi.updateNode(
      nodeId,
      updated.nestlingId,
      updated.position.x,
      updated.position.y,
      updated.height,
      updated.width,
      updated.data.label,
      updated.data.color,
      updated.data.textColor,
      updated.type,
    );

    useNestlingStore.getState().updateNestlingTimestamp(updated.nestlingId);
  }),

  deleteNode: withStoreErrorHandler(set, async (nodeId: number) => {
    const nestlingId = get().nodes.find(
      (n) => n.id === nodeId.toString(),
    )?.nestlingId;

    await mindmapApi.deleteNode(nodeId);
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== nodeId.toString()),
      edges: state.edges.filter(
        (e) => e.source !== nodeId.toString() && e.target !== nodeId.toString(),
      ),
    }));

    if (nestlingId) {
      useNestlingStore.getState().updateNestlingTimestamp(nestlingId);
    }
  }),

  createEdge: withStoreErrorHandler(set, async (edge: NewMindmapEdge) => {
    const newEdge = await mindmapApi.createEdge(edge);
    set((state) => ({
      edges: [...state.edges, newEdge],
    }));
    return newEdge;
  }),

  getEdges: withStoreErrorHandler(set, async (nestlingId: number) => {
    const edges = await mindmapApi.getEdges(nestlingId);
    set({ edges });
  }),

  deleteEdge: withStoreErrorHandler(set, async (id: number) => {
    await mindmapApi.deleteEdge(id);
    set((state) => ({
      edges: state.edges.filter((e) => e.id !== id.toString()),
    }));
  }),
}));

export const useMindmapNodes = () => useMindmapStore((state) => state.nodes);

export const useMindmapEdges = () => useMindmapStore((state) => state.edges);

export const useMindmapActions = () =>
  useMindmapStore(
    useShallow((state) => ({
      setNodes: state.setNodes,
      setEdges: state.setEdges,

      createNode: state.createNode,
      getNodes: state.getNodes,
      updateNode: state.updateNode,
      deleteNode: state.deleteNode,

      createEdge: state.createEdge,
      getEdges: state.getEdges,
      deleteEdge: state.deleteEdge,
    })),
  );
