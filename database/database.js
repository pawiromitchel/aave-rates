import sqlite3 from 'sqlite3';
import { fetchAllRates } from '../models/ratesModel.js';

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

const db = await initializeDatabase();
const fetchAndInsertRates = async () => {
    console.log('Fetching and inserting rates...');
    try {
        const rates = await fetchAllRates();

        Object.entries(rates).forEach(([chain, chainRates]) => {
            console.log('inserting rates for', chain);
            chainRates.forEach(rate => {
                db.run('INSERT INTO rates (chain, name, symbol, supplyAPY, borrowAPY) VALUES (?, ?, ?, ?, ?)', [rate.chain, rate.name, rate.symbol, rate.supplyAPY, rate.variableBorrowAPY])
            });
        });

        console.log('Rates inserted successfully');
    } catch (error) {
        console.error('Failed to fetch and insert rates:', error.message);
    }
};

export { fetchAndInsertRates };