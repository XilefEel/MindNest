use crate::models::mindmap::{
    MindmapEdge, MindmapEdgeDB, MindmapNode, MindmapNodeDB, NewMindmapEdgeDB, NewMindmapNodeDB,
};
use crate::utils::db::AppDb;
use crate::utils::errors::DbResult;
use chrono::Utc;
use rusqlite::params;

pub fn insert_node_into_db(db: &AppDb, data: NewMindmapNodeDB) -> DbResult<MindmapNode> {
    let connection = db.connection.lock().unwrap();
    let created_at = Utc::now().to_rfc3339();

    let mut statement = connection
        .prepare("
            INSERT INTO mindmap_nodes (
                nestling_id, position_x, position_y, height, width, label,
                color, node_type, created_at, updated_at
            ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10)
            RETURNING id, nestling_id, position_x, position_y, height, width, label, color, node_type, created_at, updated_at"
        )?;

    let node = statement.query_row(
        params![
            data.nestling_id,
            data.position_x,
            data.position_y,
            data.height,
            data.width,
            data.label,
            data.color,
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
                node_type: row.get(8)?,
                created_at: row.get(9)?,
                updated_at: row.get(10)?,
            })
        },
    )?;

    Ok(node.into())
}

pub fn get_nodes_by_nestling(db: &AppDb, nestling_id: i64) -> DbResult<Vec<MindmapNode>> {
    let connection = db.connection.lock().unwrap();

    let mut statement = connection
        .prepare("
            SELECT id, nestling_id, position_x, position_y, height, width, label, color, node_type, created_at, updated_at
            FROM mindmap_nodes
            WHERE nestling_id = ?1"
        )?;

    let rows = statement.query_map([nestling_id], |row| {
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
    })?;

    let result = rows.collect::<Result<Vec<_>, _>>()?;

    Ok(result.into_iter().map(|node| node.into()).collect())
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
    node_type: String,
) -> DbResult<()> {
    let connection = db.connection.lock().unwrap();
    let updated_at = Utc::now().to_rfc3339();

    connection
        .execute("
            UPDATE mindmap_nodes
            SET position_x = ?1, position_y = ?2, height = ?3, width = ?4, label = ?5, color = ?6, node_type = ?7, updated_at = ?8
            WHERE id = ?9",
            params![
                position_x,
                position_y,
                height,
                width,
                label,
                color,
                node_type,
                updated_at,
                id
            ],
        )
        ?;

    Ok(())
}

pub fn delete_node_from_db(db: &AppDb, id: i64) -> DbResult<()> {
    let connection = db.connection.lock().unwrap();

    connection.execute("DELETE FROM mindmap_nodes WHERE id = ?1", params![id])?;

    Ok(())
}

pub fn insert_edge_into_db(db: &AppDb, data: NewMindmapEdgeDB) -> DbResult<MindmapEdge> {
    let connection = db.connection.lock().unwrap();
    let created_at = Utc::now().to_rfc3339();

    let mut statement = connection.prepare(
        "
            INSERT INTO mindmap_edges (source_id, target_id, created_at, updated_at)
            VALUES (?1, ?2, ?3, ?4)
            RETURNING id, source_id, target_id, created_at, updated_at",
    )?;

    let edge = statement.query_row(
        params![data.source_id, data.target_id, created_at, created_at],
        |row| {
            Ok(MindmapEdgeDB {
                id: row.get(0)?,
                source_id: row.get(1)?,
                target_id: row.get(2)?,
                created_at: row.get(3)?,
                updated_at: row.get(4)?,
            })
        },
    )?;

    Ok(edge.into())
}

pub fn get_edges_by_nestling(db: &AppDb, nestling_id: i64) -> DbResult<Vec<MindmapEdge>> {
    let connection = db.connection.lock().unwrap();

    let mut statement = connection.prepare(
        "
            SELECT id, source_id, target_id, created_at, updated_at
            FROM mindmap_edges
            WHERE source_id IN (
                SELECT id FROM mindmap_nodes WHERE nestling_id = ?1
            )",
    )?;

    let rows = statement.query_map([nestling_id], |row| {
        Ok(MindmapEdgeDB {
            id: row.get(0)?,
            source_id: row.get(1)?,
            target_id: row.get(2)?,
            created_at: row.get(3)?,
            updated_at: row.get(4)?,
        })
    })?;

    let result = rows.collect::<Result<Vec<_>, _>>()?;

    Ok(result.into_iter().map(|edge| edge.into()).collect())
}

pub fn delete_edge_from_db(db: &AppDb, id: i64) -> DbResult<()> {
    let connection = db.connection.lock().unwrap();

    connection.execute("DELETE FROM mindmap_edges WHERE id = ?1", params![id])?;

    Ok(())
}
