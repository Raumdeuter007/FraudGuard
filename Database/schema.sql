-- Users
CREATE TABLE users (
    id                  TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    email               TEXT NOT NULL UNIQUE,
    hashed_password     TEXT NOT NULL,
    is_active           BOOLEAN NOT NULL DEFAULT 1,
    is_superuser        BOOLEAN NOT NULL DEFAULT 0,
    is_verified         BOOLEAN NOT NULL DEFAULT 0,
    name                TEXT,
    created_at          TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at          TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

-- Original Files
CREATE TABLE files (
    id                  TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    user_id             TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    imagekit_file_id    TEXT NOT NULL UNIQUE,
    imagekit_url        TEXT NOT NULL,
    file_path           TEXT NOT NULL,

    original_name       TEXT NOT NULL,
    mime_type           TEXT,
    size_bytes          INTEGER,
    upload_status       TEXT NOT NULL DEFAULT 'pending'
        CHECK (upload_status IN ('pending', 'done', 'failed')),

    created_at          TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at          TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX idx_files_user_id ON files(user_id);

-- Heatmaps
CREATE TABLE scans (
    id                      TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    file_id                 TEXT NOT NULL REFERENCES files(id) ON DELETE CASCADE,

    scan_type               TEXT NOT NULL
        CHECK (scan_type IN ('tamper', 'forgery', 'both')),

    status                  TEXT NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'preprocessing', 'inferring', 'generating_heatmap', 'done', 'failed')),

    -- heatmap (single output regardless of scan_type)
    heatmap_imagekit_file_id  TEXT UNIQUE,
    heatmap_imagekit_url      TEXT,
    heatmap_file_path         TEXT,

    -- results (nullable until done)
    tamper_percent          REAL,         -- NULL if scan_type = 'forgery'
    is_tampered             INTEGER,      -- 0 | 1 | NULL
    forgery_confidence      REAL,         -- NULL if scan_type = 'tamper'
    is_forged               INTEGER,      -- 0 | 1 | NULL

    raw_result              TEXT,         -- JSON blob, full model output

    error_message           TEXT,
    started_at              TEXT,
    completed_at            TEXT,
    created_at              TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at              TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX idx_scans_file_id ON scans(file_id);