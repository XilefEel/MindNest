use crate::{
    models::bookmark::{Bookmark, BookmarkMetadata, NewBookmark},
    utils::{
        db::AppDb,
        errors::{DbError, DbResult},
    },
};
use chrono::Utc;
use rusqlite::params;

use reqwest::Client;
use scraper::{Html, Selector};
use url::Url;

async fn fetch_metadata(url: &str) -> DbResult<BookmarkMetadata> {
    let client = Client::builder()
        .user_agent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
        .timeout(std::time::Duration::from_secs(10))
        .build()?;

    let response = client.get(url).send().await?;

    if !response.status().is_success() {
        return Err(DbError::HttpError(response.error_for_status().unwrap_err()));
    }

    let html = response.text().await?;

    let document = Html::parse_document(&html);

    let title = extract_meta_property(&document, "og:title").or_else(|| extract_title(&document));

    let description = extract_meta_property(&document, "og:description")
        .or_else(|| extract_meta_name(&document, "description"));

    let image_url = extract_meta_property(&document, "og:image");

    Ok(BookmarkMetadata {
        title,
        description,
        image_url,
    })
}

fn extract_meta_property(document: &Html, property: &str) -> Option<String> {
    let selector = Selector::parse(&format!(r#"meta[property="{}"]"#, property)).ok()?;
    document
        .select(&selector)
        .next()
        .and_then(|element| element.value().attr("content"))
        .map(|s| s.to_string())
}

fn extract_meta_name(document: &Html, name: &str) -> Option<String> {
    let selector = Selector::parse(&format!(r#"meta[name="{}"]"#, name)).ok()?;
    document
        .select(&selector)
        .next()
        .and_then(|element| element.value().attr("content"))
        .map(|s| s.to_string())
}

fn extract_title(document: &Html) -> Option<String> {
    let selector = Selector::parse("title").ok()?;
    document
        .select(&selector)
        .next()
        .map(|element| element.text().collect::<String>().trim().to_string())
}

fn insert_bookmark_into_db(db: &AppDb, data: NewBookmark) -> DbResult<Bookmark> {
    let connection = db.connection.lock().unwrap();
    let created_at = Utc::now().to_rfc3339();

    let mut statement = connection
        .prepare("
            INSERT INTO bookmarks (nestling_id, url, title, description, image_url, is_favorite, created_at, updated_at)
            VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)
            RETURNING id, nestling_id, url, title, description, image_url, is_favorite, created_at, updated_at"
        )?;

    let bookmark = statement.query_row(
        params![
            data.nestling_id,
            data.url,
            data.title,
            data.description,
            data.image_url,
            data.is_favorite,
            created_at,
            created_at
        ],
        |row| {
            Ok(Bookmark {
                id: row.get(0)?,
                nestling_id: row.get(1)?,
                url: row.get(2)?,
                title: row.get(3)?,
                description: row.get(4)?,
                image_url: row.get(5)?,
                is_favorite: row.get(6)?,
                created_at: row.get(7)?,
                updated_at: row.get(8)?,
            })
        },
    )?;

    Ok(bookmark)
}

pub async fn create_new_bookmark_in_db(
    db: &AppDb,
    nestling_id: i64,
    url: String,
) -> DbResult<Bookmark> {
    let metadata = fetch_metadata(&url).await?;

    let new_bookmark = NewBookmark {
        nestling_id: nestling_id,
        url,
        title: metadata.title,
        description: metadata.description,
        image_url: metadata.image_url,
        is_favorite: false,
    };

    let bookmark = insert_bookmark_into_db(db, new_bookmark)?;

    Ok(bookmark)
}

pub fn toggle_bookmark_favorite_in_db(db: &AppDb, id: i64) -> DbResult<()> {
    let connection = db.connection.lock().unwrap();
    let updated_at = Utc::now().to_rfc3339();

    connection.execute(
        "UPDATE bookmarks SET is_favorite = NOT is_favorite, updated_at = ?1 WHERE id = ?2",
        params![updated_at, id],
    )?;

    Ok(())
}

pub fn get_bookmarks_by_nestling(db: &AppDb, nestling_id: i64) -> DbResult<Vec<Bookmark>> {
    let connection = db.connection.lock().unwrap();

    let mut statement = connection
        .prepare("
            SELECT id, nestling_id, url, title, description, image_url, is_favorite, created_at, updated_at
            FROM bookmarks
            WHERE nestling_id = ?1
            ORDER BY is_favorite DESC, created_at DESC"
        )?;

    let rows = statement.query_map([nestling_id], |row| {
        Ok(Bookmark {
            id: row.get(0)?,
            nestling_id: row.get(1)?,
            url: row.get(2)?,
            title: row.get(3)?,
            description: row.get(4)?,
            image_url: row.get(5)?,
            is_favorite: row.get(6)?,
            created_at: row.get(7)?,
            updated_at: row.get(8)?,
        })
    })?;

    let result = rows.collect::<Result<Vec<Bookmark>, _>>()?;

    Ok(result)
}

pub fn delete_bookmark_from_db(db: &AppDb, id: i64) -> DbResult<()> {
    let connection = db.connection.lock().unwrap();

    connection.execute("DELETE FROM bookmarks WHERE id = ?1", params![id])?;

    Ok(())
}
