use crate::db::mindmap::{
    delete_edge_from_db, delete_node_from_db, get_edges_by_nestling, get_nodes_by_nestling,
    insert_edge_into_db, insert_node_into_db, update_node_in_db,
};
use crate::models::mindmap::{MindmapEdge, MindmapNode, NewMindmapEdge, NewMindmapNode};
use crate::utils::db::AppDb;
use crate::utils::errors::DbResult;
use tauri::State;

// Node handlers
#[tauri::command]
pub fn create_node(db: State<AppDb>, data: NewMindmapNode) -> DbResult<MindmapNode> {
    insert_node_into_db(&db, data.into())
}

#[tauri::command]
pub fn get_nodes(db: State<AppDb>, nestling_id: i64) -> DbResult<Vec<MindmapNode>> {
    get_nodes_by_nestling(&db, nestling_id)
}

#[tauri::command]
pub fn update_node(
    db: State<AppDb>,
    id: i64,
    position_x: f64,
    position_y: f64,
    height: i64,
    width: i64,
    label: String,
    color: String,
    text_color: String,
    node_type: String,
) -> DbResult<()> {
    update_node_in_db(
        &db, id, position_x, position_y, height, width, label, color, text_color, node_type,
    )
}

#[tauri::command]
pub fn delete_node(db: State<AppDb>, id: i64) -> DbResult<()> {
    delete_node_from_db(&db, id)
}

// Edge handlers
#[tauri::command]
pub fn create_edge(db: State<AppDb>, data: NewMindmapEdge) -> DbResult<MindmapEdge> {
    insert_edge_into_db(&db, data.into())
}

#[tauri::command]
pub fn get_edges(db: State<AppDb>, nestling_id: i64) -> DbResult<Vec<MindmapEdge>> {
    get_edges_by_nestling(&db, nestling_id)
}

#[tauri::command]
pub fn delete_edge(db: State<AppDb>, id: i64) -> DbResult<()> {
    delete_edge_from_db(&db, id)
}
