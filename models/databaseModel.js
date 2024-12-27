import { CHAINS } from "../constants/chains.js";
import { db } from "../database/database.js";
import { fetchAllRates } from "./ratesModel.js";

export const fetchAndInsertRates = async () => {
    console.log('Fetching and inserting rates...');
    try {
        const rates = await fetchAllRates();

        Object.entries(rates).forEach(([chain, chainRates]) => {
            console.log('inserting rates for', chain);
            console.log(chainRates);
            chainRates.forEach((rate, index) => {
                if(chain === CHAINS.OPTIMISM && index == 1) {
                    console.log('skipping optimism USDC duplicate');
                    return;
                }
                db.run('INSERT INTO rates (chain, name, symbol, supplyAPY, borrowAPY) VALUES (?, ?, ?, ?, ?)', [rate.chain, rate.name, rate.symbol, rate.supplyAPY, rate.variableBorrowAPY])
            });
        });

        console.log('Rates inserted successfully');
    } catch (error) {
        console.error('Failed to fetch and insert rates:', error.message);
    }
};

export function getAllRatesfromDbBySymbol(symbol) {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM rates WHERE symbol = ?', [symbol.toUpperCase()], (error, rows) => {
            if (error) {
                return reject(error);
            }
            resolve(rows);
        });
    });
}