use crate::{
    db::nestling::get_nestling_by_id,
    models::database::{
        DbCell, DbColumn, DbData, DbRow, DbRowData, DbSelectOption, NewDbCell, NewDbColumn,
        NewDbRow, NewDbSelectOption,
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
    column_type: String,
    order_index: i64,
) -> AppResult<()> {
    let connection = db.conn()?;
    let updated_at = Utc::now().to_rfc3339();

    connection
        .execute(
            "UPDATE db_columns
            SET name = ?1, column_type = ?2, order_index = ?3, updated_at = ?4
            WHERE id = ?5",
            params![name, column_type, order_index, updated_at, id],
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

pub fn clear_cells_by_column_from_db(db: &AppDb, column_id: i64) -> AppResult<()> {
    let connection = db.conn()?;

    connection
        .execute(
            "DELETE FROM db_cells WHERE column_id = ?1",
            params![column_id],
        )
        .log_err("clear_cells_by_column_from_db")?;

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

pub fn insert_db_select_option_into_db(
    db: &AppDb,
    data: NewDbSelectOption,
) -> AppResult<DbSelectOption> {
    let connection = db.conn()?;
    let created_at = Utc::now().to_rfc3339();

    let mut statement = connection.prepare(
        "
        INSERT INTO db_select_options (column_id, label, color, order_index, created_at, updated_at)
        VALUES (?1, ?2, ?3, ?4, ?5, ?6)
        RETURNING id, column_id, label, color, order_index, created_at, updated_at",
    )?;

    let option = statement
        .query_row(
            params![
                data.column_id,
                data.label,
                data.color,
                data.order_index,
                created_at,
                created_at
            ],
            |row| DbSelectOption::try_from(row),
        )
        .log_err("insert_db_select_option_into_db")?;

    Ok(option)
}

pub fn update_db_select_option_in_db(
    db: &AppDb,
    id: i64,
    label: String,
    color: String,
    order_index: i64,
) -> AppResult<()> {
    let connection = db.conn()?;
    let updated_at = Utc::now().to_rfc3339();

    connection
        .execute(
            "UPDATE db_select_options
            SET label = ?1, color = ?2, order_index = ?3, updated_at = ?4
            WHERE id = ?5",
            params![label, color, order_index, updated_at, id],
        )
        .log_err("update_db_select_option_in_db")?;

    Ok(())
}

pub fn delete_db_select_option_from_db(db: &AppDb, id: i64) -> AppResult<()> {
    let connection = db.conn()?;
    let updated_at = Utc::now().to_rfc3339();

    connection
        .execute(
            "UPDATE db_cells
            SET value = NULL, updated_at = ?1
            WHERE column_id = (SELECT column_id FROM db_select_options WHERE id = ?2)
            AND value = ?2",
            params![updated_at, id.to_string()],
        )
        .log_err("delete_db_select_option_from_db - clear cells")?;

    connection
        .execute("DELETE FROM db_select_options WHERE id = ?1", params![id])
        .log_err("delete_db_select_option_from_db")?;

    Ok(())
}

fn get_all_select_options_by_nestling(
    db: &AppDb,
    nestling_id: i64,
) -> AppResult<Vec<DbSelectOption>> {
    let connection = db.conn()?;

    let mut statement = connection.prepare(
        "
        SELECT opts.id, opts.column_id, opts.label, opts.color, opts.order_index, opts.created_at, opts.updated_at
        FROM db_select_options opts
        JOIN db_columns cols ON opts.column_id = cols.id
        WHERE cols.nestling_id = ?1
        ORDER BY opts.order_index ASC",
    )?;

    let options = statement
        .query_map([nestling_id], |row| DbSelectOption::try_from(row))
        .log_err("get_all_select_options_by_nestling")?
        .collect::<Result<Vec<_>, _>>()?;

    Ok(options)
}

pub fn get_db_data_from_db(db: &AppDb, nestling_id: i64) -> AppResult<DbData> {
    let nestling = get_nestling_by_id(&db, nestling_id).map_err(|e| e.to_string());

    let mut columns = get_db_columns_by_nestling(&db, nestling_id)?;
    let rows = get_db_rows_by_nestling(&db, nestling_id)?;
    let all_cells = get_all_cells_by_nestling(&db, nestling_id)?;
    let all_options = get_all_select_options_by_nestling(&db, nestling_id)?;

    let mut cells_by_row: HashMap<i64, Vec<DbCell>> = HashMap::new();
    for cell in all_cells {
        cells_by_row
            .entry(cell.row_id)
            .or_insert_with(Vec::new)
            .push(cell);
    }

    let rows = rows
        .into_iter()
        .map(|row| {
            let cells = cells_by_row.remove(&row.id).unwrap_or_else(Vec::new);
            DbRowData { row, cells }
        })
        .collect();

    let mut options_by_column: HashMap<i64, Vec<DbSelectOption>> = HashMap::new();
    for option in all_options {
        options_by_column
            .entry(option.column_id)
            .or_insert_with(Vec::new)
            .push(option);
    }

    for column in columns.iter_mut() {
        if let Some(options) = options_by_column.remove(&column.id) {
            column.options = options;
        }
    }

    Ok(DbData {
        nestling: nestling.unwrap(),
        columns,
        rows,
    })
}
