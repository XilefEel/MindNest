use thiserror::Error;

#[derive(Error, Debug)]
pub enum DbError {
    #[error("Database query failed: {0}")]
    Query(String),
    
    #[error("Resource not found")]
    NotFound,
    
    #[error(transparent)]
    Database(#[from] rusqlite::Error),

    #[error(transparent)]
    FileError(#[from] std::io::Error),
    
    #[error(transparent)]
    ImageError(#[from] imagesize::ImageError),
    
    #[error("Failed to read audio file: {0}")]
    AudioError(String),

    #[error("Unexpected error: {0}")]
    Other(String),
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