use tauri::State;
use crate::utils::db::AppDb;
use crate::models::mindmap::{NewMindmapNode, MindmapNode, MindmapEdge, NewMindmapEdge};
use crate::db::mindmap::{
    insert_node_into_db, get_nodes_by_nestling, get_node_by_id, update_node_in_db, delete_node_from_db,
    insert_edge_into_db, get_edges_by_nestling, get_edge_by_id, delete_edge_from_db,
};

// Node handlers
#[tauri::command]
pub fn create_node(db: State<AppDb>, data: NewMindmapNode) -> Result<MindmapNode, String> {
    insert_node_into_db(&db, data.into())
}

#[tauri::command]
pub fn get_nodes(db: State<AppDb>, nestling_id: i64) -> Result<Vec<MindmapNode>, String> {
    get_nodes_by_nestling(&db, nestling_id)
}

#[tauri::command]
pub fn get_node(db: State<AppDb>, id: i64) -> Result<MindmapNode, String> {
    get_node_by_id(&db, id)
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
) -> Result<(), String> {
    update_node_in_db(
        &db,
        id,
        position_x,
        position_y,
        height,
        width,
        label,
        color,
        text_color,
        node_type,
    )
}

#[tauri::command]
pub fn delete_node(db: State<AppDb>, id: i64) -> Result<(), String> {
    delete_node_from_db(&db, id)
}

// Edge handlers
#[tauri::command]
pub fn create_edge(db: State<AppDb>, data: NewMindmapEdge) -> Result<MindmapEdge, String> {
    insert_edge_into_db(&db, data.into())
}

#[tauri::command]
pub fn get_edges(db: State<AppDb>, nestling_id: i64) -> Result<Vec<MindmapEdge>, String> {
    get_edges_by_nestling(&db, nestling_id)
}

#[tauri::command]
pub fn get_edge(db: State<AppDb>, id: i64) -> Result<MindmapEdge, String> {
    get_edge_by_id(&db, id)
}

#[tauri::command]
pub fn delete_edge(db: State<AppDb>, id: i64) -> Result<(), String> {
    delete_edge_from_db(&db, id)
}