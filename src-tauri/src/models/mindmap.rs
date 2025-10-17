use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BaseModel {
    pub id: i64,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Position {
    pub x: f64,
    pub y: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MindmapNodeData {
    pub label: String,
    pub color: String,
    #[serde(rename = "textColor")]
    pub text_color: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NewMindmapNode {
    pub nestling_id: i64,
    pub position: Position,
    pub height: i64,
    pub width: i64,
    pub data: MindmapNodeData,
    #[serde(rename = "type")]
    pub node_type: String,
}

// Mindmap Node (with id/timestamps as strings for frontend)
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MindmapNode {
    pub id: String,
    pub nestling_id: i64,
    pub position: Position,
    pub height: i64,
    pub width: i64,
    pub data: MindmapNodeData,
    #[serde(rename = "type")]
    pub node_type: String,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MindmapNodeDB {
    pub id: i64,
    pub nestling_id: i64,
    pub position_x: f64,
    pub position_y: f64,
    pub height: i64,
    pub width: i64,
    pub label: String,
    pub color: String,
    pub text_color: String,
    #[serde(rename = "type")]
    pub node_type: String,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NewMindmapNodeDB {
    pub nestling_id: i64,
    pub position_x: f64,
    pub position_y: f64,
    pub height: i64,
    pub width: i64,
    pub label: String,
    pub color: String,
    pub text_color: String,
    #[serde(rename = "type")]
    pub node_type: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NewMindmapEdge {
    pub source: String,
    pub target: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MindmapEdge {
    pub id: String,
    pub source: String,
    pub target: String,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MindmapEdgeDB {
    pub id: i64,
    pub source_id: i64,
    pub target_id: i64,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NewMindmapEdgeDB {
    pub source_id: i64,
    pub target_id: i64,
}