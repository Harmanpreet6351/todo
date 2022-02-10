const Database = require("better-sqlite3")
const db = Database('data.db', {verbose: console.log})

db.prepare('DROP TABLE IF EXISTS users;').run()

db.prepare(`CREATE TABLE users(
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    passwd NOT NULL,
    email TEXT NOT NULL
);`).run()

db.prepare('DROP TABLE IF EXISTS todos;').run()

db.prepare(`CREATE TABLE todos(
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    task TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);`).run()

console.log('Database initialized')