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
      x: row.position_x,
      y: row.position_y,
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
    nestling_id: node.nestling_id,
    position_x: node.position.x,
    position_y: node.position.y,
    height: node.height,
    width: node.width,
    label: node.data.label,
    color: node.data.color,
    textColor: node.data.textColor,
    type: node.type,
    created_at: node.created_at,
    updated_at: node.updated_at,
  };
}

export function newMindmapNodeToDb(node: NewMindmapNode): NewMindmapNodeDB {
  return {
    nestling_id: node.nestling_id,
    position_x: node.position.x,
    position_y: node.position.y,
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
    source: row.source_id.toString(),
    target: row.target_id.toString(),
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export function mindmapEdgeToDb(edge: MindmapEdge): MindmapEdgeDB {
  return {
    id: parseInt(edge.id, 10),
    source_id: parseInt(edge.source, 10),
    target_id: parseInt(edge.target, 10),
    created_at: edge.created_at,
    updated_at: edge.updated_at,
  };
}

export function newMindmapEdgeToDb(edge: NewMindmapEdge): NewMindmapEdgeDB {
  return {
    source_id: parseInt(edge.source, 10),
    target_id: parseInt(edge.target, 10),
  };
}
