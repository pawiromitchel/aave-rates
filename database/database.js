import sqlite3 from 'sqlite3';

const initializeDatabase = async () => {
    const db = new sqlite3.Database('./rates.db');

    await db.exec(`
        CREATE TABLE IF NOT EXISTS rates (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            chain TEXT,
            name TEXT,
            symbol TEXT,
            supplyAPY REAL,
            borrowAPY REAL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    return db;
};

export const db = await initializeDatabase();