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
