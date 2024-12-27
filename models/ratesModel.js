// models/ratesModel.js
import { ChainId, UiPoolDataProvider } from '@aave/contract-helpers';
import { AaveV3Ethereum, AaveV3Polygon, AaveV3Base, AaveV3Arbitrum, AaveV3Gnosis, AaveV3Optimism, AaveV3BNB } from '@bgd-labs/aave-address-book';
import { ethers } from 'ethers';
import { formatReserves } from '@aave/math-utils';
import { CHAINS } from '../constants/chains.js';

// In-memory cache
const CACHE = {};
const CACHE_THRESHOLD = process.env.CACHE_THRESHOLD * 60 * 1000;

// Initialize providers and pool configurations
const providers = {
    ethereum: new ethers.providers.JsonRpcProvider(process.env.ETH_RPC),
    polygon: new ethers.providers.JsonRpcProvider(process.env.POL_RPC),
    base: new ethers.providers.JsonRpcProvider(process.env.BASE_RPC),
    arbitrum: new ethers.providers.JsonRpcProvider(process.env.ARBITRUM_RPC),
    gnosis: new ethers.providers.JsonRpcProvider(process.env.GNOSIS_RPC),
    optimism: new ethers.providers.JsonRpcProvider(process.env.OPTIMISM_RPC),
    bnb: new ethers.providers.JsonRpcProvider(process.env.BNB_RPC),
};

const poolDataConfigs = {
    ethereum: AaveV3Ethereum,
    polygon: AaveV3Polygon,
    base: AaveV3Base,
    arbitrum: AaveV3Arbitrum,
    gnosis: AaveV3Gnosis,
    optimism: AaveV3Optimism,
    bnb: AaveV3BNB
};

export async function fetchRatesForChain(chain) {
    const provider = providers[chain];
    const config = poolDataConfigs[chain];

    const poolDataProviderContract = new UiPoolDataProvider({
        uiPoolDataProviderAddress: config.UI_POOL_DATA_PROVIDER,
        provider,
        chainId: ChainId[chain],
    });

    const reserves = await poolDataProviderContract.getReservesHumanized({
        lendingPoolAddressProvider: config.POOL_ADDRESSES_PROVIDER,
    });

    const reservesArray = reserves.reservesData;
    const baseCurrencyData = reserves.baseCurrencyData;

    const formattedPoolReserves = formatReserves({
        reserves: reservesArray,
        marketReferenceCurrencyDecimals: baseCurrencyData.marketReferenceCurrencyDecimals,
        marketReferencePriceInUsd: baseCurrencyData.marketReferenceCurrencyPriceInUsd,
    });

    const tokens = formattedPoolReserves.filter((token) =>
        token.name === "Wrapped Ether" ||
        token.name === "USD Coin" ||
        token.name === "Tether USD" ||
        token.name === "Dai Stablecoin" ||
        token.name === "USD//C on xDai" ||
        token.name === "Wrapped Ether on xDai"
    );

    return tokens.map((token) => ({
        chain: chain,
        name: token.name,
        symbol: token.symbol,
        supplyAPY: token.supplyAPY,
        variableBorrowAPY: token.variableBorrowAPY,
    }));
}

export async function fetchAllRates() {
    const results = {};
    const currentTime = Date.now();

    for (const chain of Object.values(CHAINS)) {
        // Check if the chain data exists in the cache and is within the threshold
        if (CACHE[chain] && currentTime - CACHE[chain].timestamp < CACHE_THRESHOLD) {
            console.log(`Using cached data for ${chain}`);
            results[chain] = CACHE[chain].data;
        } else {
            // Fetch fresh data if not in cache or cache is stale
            console.log(`Fetching fresh data for ${chain}`);
            const data = await fetchRatesForChain(chain);
            results[chain] = data;

            // Update the cache
            CACHE[chain] = {
                data,
                timestamp: currentTime,
            };
        }
    }

    return results;
}
