import * as mindmapApi from "@/lib/api/mindmap";
import {
  MindmapNode,
  MindmapEdge,
  NewMindmapNode,
  NewMindmapEdge,
} from "@/lib/types/mindmap";
import { mergeWithCurrent, withStoreErrorHandler } from "@/lib/utils/general";
import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { updateNestlingTimestamp } from "@/lib/utils/nestlings";

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
  updateNode: (id: string, updates: Partial<MindmapNode>) => Promise<void>;
  deleteNode: (id: string) => Promise<void>;

  createEdge: (edge: NewMindmapEdge) => Promise<MindmapEdge>;
  getEdges: (nestlingId: number) => Promise<void>;
  deleteEdge: (id: string) => Promise<void>;
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
    await updateNestlingTimestamp(newNode.nestlingId);
    return newNode;
  }),

  getNodes: withStoreErrorHandler(set, async (nestlingId: number) => {
    const nodes = await mindmapApi.getNodes(nestlingId);
    set({ nodes, loading: false });
  }),

  updateNode: withStoreErrorHandler(set, async (id, updates) => {
    const current = get().nodes.find((n) => n.id === id);
    if (!current) throw new Error("Node not found");
    const updated = mergeWithCurrent(current, updates);

    set((state) => ({
      nodes: state.nodes.map((n) => (n.id === id ? updated : n)),
    }));

    await mindmapApi.updateNode(
      id,
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

    await updateNestlingTimestamp(updated.nestlingId);
  }),

  deleteNode: withStoreErrorHandler(set, async (id) => {
    const nestlingId = get().nodes.find((n) => n.id === id)?.nestlingId;

    await mindmapApi.deleteNode(id);
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== id),
      edges: state.edges.filter((e) => e.source !== id && e.target !== id),
    }));

    if (nestlingId) {
      await updateNestlingTimestamp(nestlingId);
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

  deleteEdge: withStoreErrorHandler(set, async (id) => {
    await mindmapApi.deleteEdge(id);
    set((state) => ({
      edges: state.edges.filter((e) => e.id !== id),
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
