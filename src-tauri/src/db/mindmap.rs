use crate::utils::db::AppDb;
use rusqlite::params;
use chrono;
use crate::models::mindmap::{
    MindmapNode, MindmapNodeDB, NewMindmapNodeDB,
    MindmapEdge, MindmapEdgeDB, NewMindmapEdgeDB,
};

pub fn insert_node_into_db(db: &AppDb, data: NewMindmapNodeDB) -> Result<MindmapNode, String> {
    let connection = db.connection.lock().unwrap();
    let created_at = chrono::Local::now()
        .naive_local()
        .format("%Y-%m-%d %H:%M:%S")
        .to_string();

    let mut statement = connection.prepare("
        INSERT INTO mindmap_nodes (
            nestling_id, position_x, position_y, height, width, label,
            color, text_color, node_type, created_at, updated_at
        ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11)
        RETURNING id, nestling_id, position_x, position_y, height, width, label, color, text_color, type, created_at, updated_at
    ").map_err(|e| e.to_string())?;

    let node = statement
        .query_row(
            params![
                data.nestling_id,
                data.position_x,
                data.position_y,
                data.height,
                data.width,
                data.label,
                data.color,
                data.text_color,
                data.node_type,
                created_at,
                created_at
            ],
            |row| {
                Ok(MindmapNodeDB {
                    id: row.get(0)?,
                    nestling_id: row.get(1)?,
                    position_x: row.get(2)?,
                    position_y: row.get(3)?,
                    height: row.get(4)?,
                    width: row.get(5)?,
                    label: row.get(6)?,
                    color: row.get(7)?,
                    text_color: row.get(8)?,
                    node_type: row.get(9)?,
                    created_at: row.get(10)?,
                    updated_at: row.get(11)?,
                })
            },
        )
        .map_err(|e| e.to_string())?;

    Ok(node.into())
}

pub fn get_nodes_by_nestling(db: &AppDb, nestling_id: i64) -> Result<Vec<MindmapNode>, String> {
    let connection = db.connection.lock().unwrap();

    let mut statement = connection.prepare("
        SELECT id, nestling_id, position_x, position_y, height, width, label, color, text_color, type, created_at, updated_at
        FROM mindmap_nodes
        WHERE nestling_id = ?1
    ").map_err(|e| e.to_string())?;

    let rows = statement
        .query_map([nestling_id], |row| {
            Ok(MindmapNodeDB {
                id: row.get(0)?,
                nestling_id: row.get(1)?,
                position_x: row.get(2)?,
                position_y: row.get(3)?,
                height: row.get(4)?,
                width: row.get(5)?,
                label: row.get(6)?,
                color: row.get(7)?,
                text_color: row.get(8)?,
                node_type: row.get(9)?,
                created_at: row.get(10)?,
                updated_at: row.get(11)?,
            })
        })
        .map_err(|e| e.to_string())?;

    let result = rows
        .collect::<Result<Vec<MindmapNodeDB>, _>>()
        .map_err(|e| e.to_string())?;

    Ok(result.into_iter().map(|node| node.into()).collect())
}

pub fn get_node_by_id(db: &AppDb, id: i64) -> Result<MindmapNode, String> {
    let connection = db.connection.lock().unwrap();
    let mut statement = connection.prepare("
        SELECT id, nestling_id, position_x, position_y, height, width, label, color, text_color, type, created_at, updated_at
        FROM mindmap_nodes
        WHERE id = ?1
    ").map_err(|e| e.to_string())?;

    let node = statement
        .query_row([id], |row| {
            Ok(MindmapNodeDB {
                id: row.get(0)?,
                nestling_id: row.get(1)?,
                position_x: row.get(2)?,
                position_y: row.get(3)?,
                height: row.get(4)?,
                width: row.get(5)?,
                label: row.get(6)?,
                color: row.get(7)?,
                text_color: row.get(8)?,
                node_type: row.get(9)?,
                created_at: row.get(10)?,
                updated_at: row.get(11)?,
            })
        })
        .map_err(|e| e.to_string())?;

    Ok(node.into())
}

pub fn update_node_in_db(
    db: &AppDb,
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
    let connection = db.connection.lock().unwrap();
    let updated_at = chrono::Local::now()
        .naive_local()
        .format("%Y-%m-%d %H:%M:%S")
        .to_string();

    connection
        .execute("
            UPDATE mindmap_nodes
            SET position_x = ?1, position_y = ?2, height = ?3, width = ?4, label = ?5, color = ?6, text_color = ?7, node_type = ?8, updated_at = ?9
            WHERE id = ?10",
            params![
                position_x,
                position_y,
                height,
                width,
                label,
                color,
                text_color,
                node_type,
                updated_at,
                id
            ],
        )
        .map_err(|e| e.to_string())?;

    Ok(())
}

pub fn delete_node_from_db(db: &AppDb, id: i64) -> Result<(), String> {
    let connection = db.connection.lock().unwrap();

    connection
        .execute("DELETE FROM mindmap_nodes WHERE id = ?1", params![id])
        .map_err(|e| e.to_string())?;

    Ok(())
}


pub fn insert_edge_into_db(db: &AppDb, data: NewMindmapEdgeDB) -> Result<MindmapEdge, String> {
    let connection = db.connection.lock().unwrap();
    let created_at = chrono::Local::now()
        .naive_local()
        .format("%Y-%m-%d %H:%M:%S")
        .to_string();

    let mut statement = connection.prepare("
        INSERT INTO mindmap_edges (
            source_id, target_id, created_at, updated_at
        ) VALUES (?1, ?2, ?3, ?4)
        RETURNING id, source_id, target_id, created_at, updated_at
    ").map_err(|e| e.to_string())?;

    let edge = statement
        .query_row(
            params![
                data.source_id,
                data.target_id,
                created_at,
                created_at
            ],
            |row| {
                Ok(MindmapEdgeDB {
                    id: row.get(0)?,
                    source_id: row.get(1)?,
                    target_id: row.get(2)?,
                    created_at: row.get(3)?,
                    updated_at: row.get(4)?,
                })
            },
        )
        .map_err(|e| e.to_string())?;

    Ok(edge.into())
}

pub fn get_edges_by_nestling(db: &AppDb, nestling_id: i64) -> Result<Vec<MindmapEdge>, String> {
    let connection = db.connection.lock().unwrap();

    let mut statement = connection.prepare("
        SELECT id, source_id, target_id, created_at, updated_at
        FROM mindmap_edges
        WHERE source_id IN (
            SELECT id FROM mindmap_nodes WHERE nestling_id = ?1
        )
    ").map_err(|e| e.to_string())?;

    let rows = statement
        .query_map([nestling_id], |row| {
            Ok(MindmapEdgeDB {
                id: row.get(0)?,
                source_id: row.get(1)?,
                target_id: row.get(2)?,
                created_at: row.get(3)?,
                updated_at: row.get(4)?,
            })
        })
        .map_err(|e| e.to_string())?;

    let result = rows
        .collect::<Result<Vec<MindmapEdgeDB>, _>>()
        .map_err(|e| e.to_string())?;

    Ok(result.into_iter().map(|edge| edge.into()).collect())
}

pub fn get_edge_by_id(db: &AppDb, id: i64) -> Result<MindmapEdge, String> {
    let connection = db.connection.lock().unwrap();
    let mut statement = connection.prepare("
        SELECT id, source_id, target_id, created_at, updated_at
        FROM mindmap_edges
        WHERE id = ?1
    ").map_err(|e| e.to_string())?;

    let edge = statement
        .query_row([id], |row| {
            Ok(MindmapEdgeDB {
                id: row.get(0)?,
                source_id: row.get(1)?,
                target_id: row.get(2)?,
                created_at: row.get(3)?,
                updated_at: row.get(4)?,
            })
        })
        .map_err(|e| e.to_string())?;

    Ok(edge.into())
}

pub fn delete_edge_from_db(db: &AppDb, id: i64) -> Result<(), String> {
    let connection = db.connection.lock().unwrap();

    connection
        .execute("DELETE FROM mindmap_edges WHERE id = ?1", params![id])
        .map_err(|e| e.to_string())?;

    Ok(())
}


