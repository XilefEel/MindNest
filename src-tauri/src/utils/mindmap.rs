use crate::models::mindmap::{
    MindmapEdge, MindmapEdgeDB, MindmapNode, MindmapNodeDB, MindmapNodeData, NewMindmapEdge,
    NewMindmapEdgeDB, NewMindmapNode, NewMindmapNodeDB, Position,
};

impl From<MindmapNodeDB> for MindmapNode {
    fn from(db: MindmapNodeDB) -> Self {
        MindmapNode {
            id: db.id.to_string(),
            nestling_id: db.nestling_id,
            position: Position {
                x: db.position_x,
                y: db.position_y,
            },
            height: db.height,
            width: db.width,
            data: MindmapNodeData {
                label: db.label,
                color: db.color,
                text_color: db.text_color,
            },
            node_type: db.node_type,
            created_at: db.created_at,
            updated_at: db.updated_at,
        }
    }
}

impl From<NewMindmapNode> for NewMindmapNodeDB {
    fn from(node: NewMindmapNode) -> Self {
        NewMindmapNodeDB {
            nestling_id: node.nestling_id,
            position_x: node.position.x,
            position_y: node.position.y,
            height: node.height,
            width: node.width,
            label: node.data.label,
            color: node.data.color,
            text_color: node.data.text_color,
            node_type: node.node_type,
        }
    }
}

impl From<MindmapEdgeDB> for MindmapEdge {
    fn from(db: MindmapEdgeDB) -> Self {
        MindmapEdge {
            id: db.id.to_string(),
            source: db.source_id.to_string(),
            target: db.target_id.to_string(),
            created_at: db.created_at,
            updated_at: db.updated_at,
        }
    }
}

impl From<NewMindmapEdge> for NewMindmapEdgeDB {
    fn from(edge: NewMindmapEdge) -> Self {
        NewMindmapEdgeDB {
            source_id: edge.source.parse().unwrap_or(0),
            target_id: edge.target.parse().unwrap_or(0),
        }
    }
}
