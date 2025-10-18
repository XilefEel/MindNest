import { invoke } from "@tauri-apps/api/core";
import {
  NewMindmapNode,
  MindmapNode,
  NewMindmapEdge,
  MindmapEdge,
} from "../types/mindmap";

export async function createNode(data: NewMindmapNode): Promise<MindmapNode> {
  return invoke("create_node", { data });
}

export async function getNodes(nestlingId: number): Promise<MindmapNode[]> {
  return invoke("get_nodes", { nestlingId });
}

export async function updateNode(
  id: number,
  nestlingId: number,
  positionX: number,
  positionY: number,
  height: number,
  width: number,
  label: string,
  color: string,
  textColor: string,
  type: string,
): Promise<void> {
  return invoke("update_node", {
    id,
    nestlingId,
    positionX,
    positionY,
    height,
    width,
    label,
    color,
    textColor,
    nodeType: type,
  });
}

export async function deleteNode(id: number): Promise<void> {
  return invoke("delete_node", { id });
}

// Edge functions
export async function createEdge(edge: NewMindmapEdge): Promise<MindmapEdge> {
  return invoke("create_edge", { data: edge });
}

export async function getEdges(nestlingId: number): Promise<MindmapEdge[]> {
  return invoke("get_edges", { nestlingId });
}

export async function deleteEdge(id: number): Promise<void> {
  return invoke("delete_edge", { id });
}
