import sqlite3 from 'sqlite3';
const db = new sqlite3.Database('database.db');

// Insert a task
const taskName = 'Buy groceries';
db.run(
    `CREATE TABLE IF NOT EXISTS schedule (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        task_name TEXT NOT NULL,
        time TEXT NOT NULL
    )`
);

db.close();
