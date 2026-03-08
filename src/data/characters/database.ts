import Database from "better-sqlite3";

const db = new Database("./data/rpgweb.db");

db.pragma("journal_mode = WAL");

db.exec(`
    CREATE TABLE IF NOT EXISTS characters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        class TEXT NOT NULL,
        level INTEGER NOT NULL DEFAULT 1
    )
`);

export default db;