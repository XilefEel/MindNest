CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS nests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS folders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nest_id INTEGER NOT NULL,
    parent_id INTEGER,
    name TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (nest_id) REFERENCES nests(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES folders(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS nestlings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nest_id INTEGER NOT NULL,
    folder_id INTEGER,
    type TEXT NOT NULL,
    icon TEXT,
    is_pinned BOOLEAN NOT NULL DEFAULT 0,
    title TEXT,
    content TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (nest_id) REFERENCES nests(id) ON DELETE CASCADE,
    FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS background_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nest_id INTEGER NOT NULL,
    file_path TEXT NOT NULL,
    is_selected BOOLEAN NOT NULL DEFAULT 0,
    width INTEGER NOT NULL,
    height INTEGER NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (nest_id) REFERENCES nests(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS background_music (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nest_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    file_path TEXT NOT NULL,
    duration_seconds INTEGER NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (nest_id) REFERENCES nests(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS board_columns (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nestling_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    order_index INTEGER NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    color TEXT NOT NULL,
    FOREIGN KEY(nestling_id) REFERENCES nestlings(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS board_cards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    column_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY(column_id) REFERENCES board_columns(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS planner_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nestling_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    start_time INTEGER NOT NULL,
    duration INTEGER NOT NULL,
    color TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (nestling_id) REFERENCES nestlings(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS journal_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nestling_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    content TEXT,
    entry_date TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (nestling_id) REFERENCES nestlings(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS journal_templates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nestling_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (nestling_id) REFERENCES nestlings(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS gallery_albums (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nestling_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (nestling_id) REFERENCES nestlings(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS gallery_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    album_id INTEGER,
    nestling_id INTEGER NOT NULL,
    file_path TEXT NOT NULL,
    title TEXT,
    description TEXT,
    is_favorite BOOLEAN NOT NULL DEFAULT 0,
    width INTEGER NOT NULL,
    height INTEGER NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (album_id) REFERENCES gallery_albums(id) ON DELETE SET NULL,
    FOREIGN KEY (nestling_id) REFERENCES nestlings(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS mindmap_nodes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nestling_id INTEGER NOT NULL,
    position_x FLOAT NOT NULL,
    position_y FLOAT NOT NULL,
    height INTEGER NOT NULL,
    width INTEGER NOT NULL,
    label TEXT,
    color TEXT NOT NULL,
    text_color TEXT NOT NULL,
    node_type TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (nestling_id) REFERENCES nestlings(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS mindmap_edges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source_id INTEGER NOT NULL,
    target_id INTEGER NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (source_id) REFERENCES mindmap_nodes(id) ON DELETE CASCADE,
    FOREIGN KEY (target_id) REFERENCES mindmap_nodes(id) ON DELETE CASCADE
);