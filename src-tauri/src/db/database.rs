use crate::{
    db::nestling::get_nestling_by_id,
    models::database::{
        DbCell, DbColumn, DbData, DbRow, DbRowData, NewDbCell, NewDbColumn, NewDbRow,
    },
    utils::{
        db::AppDb,
        errors::{AppResult, LogError},
    },
};
use chrono::Utc;
use rusqlite::params;
use std::collections::HashMap;

pub fn insert_db_column_into_db(db: &AppDb, data: NewDbColumn) -> AppResult<DbColumn> {
    let connection = db.conn()?;
    let created_at = Utc::now().to_rfc3339();

    let mut statement = connection.prepare(
        "
        INSERT INTO db_columns (nestling_id, name, column_type, order_index, created_at, updated_at)
        VALUES (?1, ?2, ?3, ?4, ?5, ?6)
        RETURNING id, nestling_id, name, column_type, order_index, created_at, updated_at",
    )?;

    let column = statement
        .query_row(
            params![
                data.nestling_id,
                data.name,
                data.column_type,
                data.order_index,
                created_at,
                created_at
            ],
            |row| DbColumn::try_from(row),
        )
        .log_err("insert_db_column_into_db")?;

    Ok(column)
}

pub fn update_db_column_in_db(
    db: &AppDb,
    id: i64,
    name: String,
    order_index: i64,
) -> AppResult<()> {
    let connection = db.conn()?;
    let updated_at = Utc::now().to_rfc3339();

    connection
        .execute(
            "UPDATE db_columns
            SET name = ?1, order_index = ?2, updated_at = ?3
            WHERE id = ?4",
            params![name, order_index, updated_at, id],
        )
        .log_err("update_db_column_in_db")?;

    Ok(())
}

pub fn delete_db_column_from_db(db: &AppDb, id: i64) -> AppResult<()> {
    let connection = db.conn()?;

    connection
        .execute("DELETE FROM db_columns WHERE id = ?1", params![id])
        .log_err("delete_db_column_from_db")?;

    Ok(())
}

pub fn insert_db_row_into_db(db: &AppDb, data: NewDbRow) -> AppResult<DbRow> {
    let connection = db.conn()?;
    let created_at = Utc::now().to_rfc3339();

    let mut statement = connection.prepare(
        "
        INSERT INTO db_rows (nestling_id, order_index, created_at, updated_at)
        VALUES (?1, ?2, ?3, ?4)
        RETURNING id, nestling_id, order_index, created_at, updated_at",
    )?;

    let row = statement
        .query_row(
            params![data.nestling_id, data.order_index, created_at, created_at],
            |row| DbRow::try_from(row),
        )
        .log_err("insert_db_row_into_db")?;

    Ok(row)
}

pub fn delete_db_row_from_db(db: &AppDb, id: i64) -> AppResult<()> {
    let connection = db.conn()?;

    connection
        .execute("DELETE FROM db_rows WHERE id = ?1", params![id])
        .log_err("delete_db_row_from_db")?;

    Ok(())
}

pub fn insert_db_cell_in_db(db: &AppDb, data: NewDbCell) -> AppResult<DbCell> {
    let connection = db.conn()?;
    let created_at = Utc::now().to_rfc3339();

    let mut statement = connection.prepare(
        "
        INSERT INTO db_cells (row_id, column_id, value, created_at, updated_at)
        VALUES (?1, ?2, ?3, ?4, ?5)
        ON CONFLICT(row_id, column_id) DO UPDATE SET
            value = excluded.value,
            updated_at = excluded.updated_at
        RETURNING id, row_id, column_id, value, created_at, updated_at",
    )?;

    let cell = statement
        .query_row(
            params![
                data.row_id,
                data.column_id,
                data.value,
                created_at,
                created_at
            ],
            |row| DbCell::try_from(row),
        )
        .log_err("insert_db_cell_in_db")?;

    Ok(cell)
}

fn get_db_columns_by_nestling(db: &AppDb, nestling_id: i64) -> AppResult<Vec<DbColumn>> {
    let connection = db.conn()?;

    let mut statement = connection.prepare(
        "
        SELECT id, nestling_id, name, column_type, order_index, created_at, updated_at
        FROM db_columns
        WHERE nestling_id = ?1
        ORDER BY order_index ASC",
    )?;

    let columns = statement
        .query_map([nestling_id], |row| DbColumn::try_from(row))
        .log_err("get_db_columns_by_nestling")?
        .collect::<Result<Vec<_>, _>>()?;

    Ok(columns)
}

fn get_db_rows_by_nestling(db: &AppDb, nestling_id: i64) -> AppResult<Vec<DbRow>> {
    let connection = db.conn()?;

    let mut statement = connection.prepare(
        "
        SELECT id, nestling_id, order_index, created_at, updated_at
        FROM db_rows
        WHERE nestling_id = ?1
        ORDER BY order_index ASC",
    )?;

    let rows = statement
        .query_map([nestling_id], |row| DbRow::try_from(row))
        .log_err("get_db_rows_by_nestling")?
        .collect::<Result<Vec<_>, _>>()?;

    Ok(rows)
}

fn get_all_cells_by_nestling(db: &AppDb, nestling_id: i64) -> AppResult<Vec<DbCell>> {
    let connection = db.conn()?;

    let mut statement = connection.prepare("
        SELECT cells.id, cells.row_id, cells.column_id, cells.value, cells.created_at, cells.updated_at
        FROM db_cells cells
        JOIN db_rows rows ON cells.row_id = rows.id
        WHERE rows.nestling_id = ?1"
    )?;

    let cells = statement
        .query_map([nestling_id], |row| DbCell::try_from(row))
        .log_err("get_all_cells_by_nestling")?
        .collect::<Result<Vec<_>, _>>()?;

    Ok(cells)
}

pub fn get_db_data_from_db(db: &AppDb, nestling_id: i64) -> AppResult<DbData> {
    let nestling = get_nestling_by_id(&db, nestling_id).map_err(|e| e.to_string());

    let columns = get_db_columns_by_nestling(&db, nestling_id)?;
    let rows = get_db_rows_by_nestling(&db, nestling_id)?;
    let all_cells = get_all_cells_by_nestling(&db, nestling_id)?;

    let mut cells_by_row: HashMap<i64, Vec<DbCell>> = HashMap::new();

    for cell in all_cells {
        cells_by_row
            .entry(cell.row_id)
            .or_insert_with(Vec::new)
            .push(cell);
    }

    let row_data_list = rows
        .into_iter()
        .map(|row| {
            let cells = cells_by_row.remove(&row.id).unwrap_or_else(Vec::new);
            DbRowData { row, cells }
        })
        .collect();

    Ok(DbData {
        nestling: nestling.unwrap(),
        columns,
        rows: row_data_list,
    })
}
