import {
  createEdge,
  createNode,
  deleteEdge,
  deleteNode,
  getEdges,
  getNodes,
  updateNode,
} from "@/lib/api/mindmap";
import {
  MindmapNode,
  MindmapEdge,
  NewMindmapNode,
  NewMindmapEdge,
} from "@/lib/types/mindmap";
import { withStoreErrorHandler } from "@/lib/utils/general";
import { create } from "zustand";

interface MindmapStore {
  nodes: MindmapNode[];
  edges: MindmapEdge[];
  activeNode: MindmapNode | null;
  loading: boolean;
  error: string | null;

  setNodes: (node: MindmapNode[]) => void;
  setEdges: (edges: MindmapEdge[]) => void;

  addNode: (node: NewMindmapNode) => Promise<MindmapNode>;
  fetchNodes: (nestlingId: number) => Promise<void>;
  updateNode: (nodeId: number, node: NewMindmapNode) => Promise<void>;
  deleteNode: (nodeId: number) => Promise<void>;

  addEdge: (edge: NewMindmapEdge) => Promise<MindmapEdge>;
  fetchEdges: (nestlingId: number) => Promise<void>;
  deleteEdge: (id: number) => Promise<void>;

  resetMindmap: () => void;
}

export const useMindmapStore = create<MindmapStore>((set) => ({
  nodes: [],
  edges: [],
  activeNode: null,
  nestlingId: null,
  loading: false,
  error: null,

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  addNode: withStoreErrorHandler(set, async (node: NewMindmapNode) => {
    const newNode = await createNode(node);
    set((state) => ({
      nodes: [...state.nodes, newNode],
    }));
    return newNode;
  }),

  fetchNodes: withStoreErrorHandler(set, async (nestlingId: number) => {
    const nodes = await getNodes(nestlingId);
    set({ nodes, loading: false });
  }),

  updateNode: withStoreErrorHandler(
    set,
    async (nodeId: number, node: NewMindmapNode) => {
      set((state) => ({
        nodes: state.nodes.map((n) =>
          n.id === nodeId.toString()
            ? { ...n, ...node, id: nodeId.toString() }
            : n,
        ),
      }));

      await updateNode(
        nodeId,
        node.nestling_id,
        node.position.x,
        node.position.y,
        node.height,
        node.width,
        node.data.label,
        node.data.color,
        node.data.text_color,
        node.node_type,
      );
    },
  ),

  deleteNode: withStoreErrorHandler(set, async (nodeId: number) => {
    await deleteNode(nodeId);
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== nodeId.toString()),
      edges: state.edges.filter(
        (e) => e.source !== nodeId.toString() && e.target !== nodeId.toString(),
      ),
    }));
  }),

  addEdge: withStoreErrorHandler(set, async (edge: NewMindmapEdge) => {
    const newEdge = await createEdge(edge);
    set((state) => ({
      edges: [...state.edges, newEdge],
    }));
    return newEdge;
  }),

  fetchEdges: withStoreErrorHandler(set, async (nestlingId: number) => {
    const edges = await getEdges(nestlingId);
    set({ edges });
  }),

  deleteEdge: withStoreErrorHandler(set, async (id: number) => {
    await deleteEdge(id);
    set((state) => ({
      edges: state.edges.filter((e) => e.id !== id.toString()),
    }));
  }),

  resetMindmap: () =>
    set({
      nodes: [],
      edges: [],
      activeNode: null,
      loading: false,
      error: null,
    }),
}));
