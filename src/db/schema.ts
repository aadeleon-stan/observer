import type { SQLiteDatabase } from 'expo-sqlite';

const CREATE_ENTRIES = `
CREATE TABLE IF NOT EXISTS entries (
  id          TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  body        TEXT NOT NULL,
  category    TEXT NOT NULL CHECK (category IN ('observation', 'reflection')),
  prompt      TEXT,
  created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  deleted_at  TEXT DEFAULT NULL
);
`;

const CREATE_INDEX_CREATED = `
CREATE INDEX IF NOT EXISTS idx_entries_created_at ON entries(created_at);
`;

export async function migrate(db: SQLiteDatabase) {
  await db.execAsync(CREATE_ENTRIES);
  await db.execAsync(CREATE_INDEX_CREATED);
}
