use crate::utils::errors::{AppResult, LogError};
use lofty::file::{AudioFile, TaggedFileExt};
use lofty::probe::Probe;
use lofty::tag::Accessor;

pub fn extract_metadata(file_path: &str) -> AppResult<(String, i64)> {
    let tagged_file = Probe::open(file_path)?.read().log_err("extract_metadata")?;

    let title = tagged_file
        .primary_tag()
        .or_else(|| tagged_file.first_tag())
        .and_then(|tag| tag.title().map(|t| t.to_string()))
        .unwrap_or_else(|| "Unknown".to_string());

    let duration = tagged_file.properties().duration().as_secs() as i64;

    Ok((title, duration))
}
