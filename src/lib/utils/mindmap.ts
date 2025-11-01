import {
  MindmapNodeDB,
  MindmapNode,
  NewMindmapNode,
  NewMindmapNodeDB,
  MindmapEdgeDB,
  MindmapEdge,
  NewMindmapEdge,
  NewMindmapEdgeDB,
} from "../types/mindmap";

export function dbToMindmapNode(row: MindmapNodeDB): MindmapNode {
  return {
    ...row,
    id: row.id.toString(),
    position: {
      x: row.positionX,
      y: row.positionY,
    },
    data: {
      label: row.label,
      color: row.color,
      textColor: row.textColor,
    },
  };
}

export function mindmapNodeToDb(node: MindmapNode): MindmapNodeDB {
  return {
    id: parseInt(node.id, 10),
    nestlingId: node.nestlingId,
    positionX: node.position.x,
    positionY: node.position.y,
    height: node.height,
    width: node.width,
    label: node.data.label,
    color: node.data.color,
    textColor: node.data.textColor,
    type: node.type,
    createdAt: node.createdAt,
    updatedAt: node.updatedAt,
  };
}

export function newMindmapNodeToDb(node: NewMindmapNode): NewMindmapNodeDB {
  return {
    nestlingId: node.nestlingId,
    positionX: node.position.x,
    positionY: node.position.y,
    height: node.height,
    width: node.width,
    label: node.data.label,
    color: node.data.color,
    textColor: node.data.textColor,
    type: node.type,
  };
}

export function dbToMindmapEdge(row: MindmapEdgeDB): MindmapEdge {
  return {
    id: row.id.toString(),
    source: row.sourceId.toString(),
    target: row.targetId.toString(),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export function mindmapEdgeToDb(edge: MindmapEdge): MindmapEdgeDB {
  return {
    id: parseInt(edge.id, 10),
    sourceId: parseInt(edge.source, 10),
    targetId: parseInt(edge.target, 10),
    createdAt: edge.createdAt,
    updatedAt: edge.updatedAt,
  };
}

export function newMindmapEdgeToDb(edge: NewMindmapEdge): NewMindmapEdgeDB {
  return {
    sourceId: parseInt(edge.source, 10),
    targetId: parseInt(edge.target, 10),
  };
}
