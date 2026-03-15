use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Position {
    pub x: f64,
    pub y: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MindmapNodeData {
    pub label: String,
    pub color: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NewMindmapNode {
    pub nestling_id: i64,
    pub position: Position,
    pub height: i64,
    pub width: i64,
    pub data: MindmapNodeData,
    #[serde(rename = "type")]
    pub node_type: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
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
#[serde(rename_all = "camelCase")]
pub struct MindmapNodeDB {
    pub id: i64,
    pub nestling_id: i64,
    pub position_x: f64,
    pub position_y: f64,
    pub height: i64,
    pub width: i64,
    pub label: String,
    pub color: String,
    #[serde(rename = "type")]
    pub node_type: String,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NewMindmapNodeDB {
    pub nestling_id: i64,
    pub position_x: f64,
    pub position_y: f64,
    pub height: i64,
    pub width: i64,
    pub label: String,
    pub color: String,
    #[serde(rename = "type")]
    pub node_type: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NewMindmapEdge {
    pub source: String,
    pub target: String,
    pub source_handle: String,
    pub target_handle: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MindmapEdge {
    pub id: String,
    pub source: String,
    pub target: String,
    pub source_handle: String,
    pub target_handle: String,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MindmapEdgeDB {
    pub id: i64,
    pub source_id: i64,
    pub target_id: i64,
    pub source_handle: String,
    pub target_handle: String,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NewMindmapEdgeDB {
    pub source_id: i64,
    pub target_id: i64,
    pub source_handle: String,
    pub target_handle: String,
}

impl TryFrom<&rusqlite::Row<'_>> for MindmapNodeDB {
    type Error = rusqlite::Error;

    fn try_from(row: &rusqlite::Row<'_>) -> Result<Self, Self::Error> {
        Ok(MindmapNodeDB {
            id: row.get(0)?,
            nestling_id: row.get(1)?,
            position_x: row.get(2)?,
            position_y: row.get(3)?,
            height: row.get(4)?,
            width: row.get(5)?,
            label: row.get(6)?,
            color: row.get(7)?,
            node_type: row.get(8)?,
            created_at: row.get(9)?,
            updated_at: row.get(10)?,
        })
    }
}

impl TryFrom<&rusqlite::Row<'_>> for MindmapEdgeDB {
    type Error = rusqlite::Error;

    fn try_from(row: &rusqlite::Row<'_>) -> Result<Self, Self::Error> {
        Ok(MindmapEdgeDB {
            id: row.get(0)?,
            source_id: row.get(1)?,
            target_id: row.get(2)?,
            source_handle: row.get(3)?,
            target_handle: row.get(4)?,
            created_at: row.get(5)?,
            updated_at: row.get(6)?,
        })
    }
}

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
            source_handle: db.source_handle,
            target_handle: db.target_handle,
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
            source_handle: edge.source_handle,
            target_handle: edge.target_handle,
        }
    }
}
