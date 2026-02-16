import { invoke } from "@tauri-apps/api/core";
import {
  NewMindmapNode,
  MindmapNode,
  NewMindmapEdge,
  MindmapEdge,
} from "../types/mindmap";

export async function createNode(data: NewMindmapNode) {
  return invoke<MindmapNode>("create_node", { data });
}

export async function getNodes(nestlingId: number) {
  return invoke<MindmapNode[]>("get_nodes", { nestlingId });
}

export async function updateNode(
  id: string,
  nestlingId: number,
  positionX: number,
  positionY: number,
  height: number,
  width: number,
  label: string,
  color: string,
  type: string,
): Promise<void> {
  return invoke<void>("update_node", {
    id: parseInt(id),
    nestlingId,
    positionX,
    positionY,
    height,
    width,
    label,
    color,
    nodeType: type,
  });
}

export async function deleteNode(id: string) {
  return invoke<void>("delete_node", { id: parseInt(id) });
}

export async function createEdge(edge: NewMindmapEdge) {
  return invoke<MindmapEdge>("create_edge", { data: edge });
}

export async function getEdges(nestlingId: number) {
  return invoke<MindmapEdge[]>("get_edges", { nestlingId });
}

export async function deleteEdge(id: string): Promise<void> {
  return invoke("delete_edge", { id: parseInt(id) });
}
