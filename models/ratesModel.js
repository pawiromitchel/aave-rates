// models/ratesModel.js
import { ChainId, UiPoolDataProvider } from '@aave/contract-helpers';
import { AaveV3Ethereum, AaveV3Polygon, AaveV3Base, AaveV3Arbitrum, AaveV3Gnosis, AaveV3Optimism, AaveV3BNB } from '@bgd-labs/aave-address-book';
import { ethers } from 'ethers';
import { formatReserves } from '@aave/math-utils';
import { CHAINS } from '../constants/chains.js';

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

    const USDTokens = formattedPoolReserves.filter((token) =>
        token.name === "Wrapped Ether" ||
        token.name === "USD Coin" ||
        token.name === "Tether USD" ||
        token.name === "Dai Stablecoin"
    );

    return USDTokens.map((token) => ({
        chain: chain,
        name: token.name,
        symbol: token.symbol,
        supplyAPY: token.supplyAPY,
        variableBorrowAPY: token.variableBorrowAPY,
    }));
}

export async function fetchAllRates() {
    const results = {};

    for (const chain of Object.values(CHAINS)) {
        results[chain] = await fetchRatesForChain(chain);
    }

    return results;
}
