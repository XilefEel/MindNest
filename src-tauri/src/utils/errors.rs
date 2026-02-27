use thiserror::Error;

#[derive(Error, Debug)]
pub enum DbError {
    #[error("Validation error: {0}")]
    ValidationError(String),

    #[error("Authentication failed: {0}")]
    AuthError(String),

    #[error("Resource not found")]
    NotFound,

    #[error(transparent)]
    Database(#[from] rusqlite::Error),

    #[error(transparent)]
    FileError(#[from] std::io::Error),

    #[error("Zip operation failed: {0}")]
    ZipError(#[from] zip::result::ZipError),

    #[error(transparent)]
    ImageError(#[from] imagesize::ImageError),

    #[error(transparent)]
    AudioError(#[from] lofty::error::LoftyError),

    #[error(transparent)]
    HttpError(#[from] reqwest::Error),

    #[error("Invalid URL: {0}")]
    InvalidUrl(#[from] url::ParseError),
}

impl serde::Serialize for DbError {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        serializer.serialize_str(self.to_string().as_ref())
    }
}

pub type DbResult<T> = Result<T, DbError>;

pub trait LogError<T> {
    fn log_err(self, context: &str) -> Self;
}

impl<T, E: std::fmt::Display> LogError<T> for Result<T, E> {
    fn log_err(self, context: &str) -> Self {
        self.map_err(|e| {
            log::error!("{}: {}", context, e);
            e
        })
    }
}
