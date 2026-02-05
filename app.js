// Import from node_modules (will be bundled by esbuild)
import { ethers } from 'ethers';
import { UiPoolDataProvider, ChainId } from '@aave/contract-helpers';
import { formatReserves } from '@aave/math-utils';
import { AaveV3Ethereum, AaveV3Polygon, AaveV3Base, AaveV3Arbitrum, AaveV3Gnosis, AaveV3Optimism, AaveV3BNB } from '@bgd-labs/aave-address-book';

// RPC Configuration
const RPC_URLS = {
    ethereum: 'https://1rpc.io/eth',
    polygon: 'https://polygon-pokt.nodies.app',
    base: 'https://1rpc.io/base',
    arbitrum: 'https://1rpc.io/arb',
    gnosis: 'https://1rpc.io/gnosis',
    optimism: 'https://1rpc.io/op',
    bnb: 'https://1rpc.io/bnb'
};

// Initialize providers with explicit chain IDs
const providers = {
    ethereum: new ethers.providers.JsonRpcProvider(RPC_URLS.ethereum, 1),
    polygon: new ethers.providers.JsonRpcProvider(RPC_URLS.polygon, 137),
    base: new ethers.providers.JsonRpcProvider(RPC_URLS.base, 8453),
    arbitrum: new ethers.providers.JsonRpcProvider(RPC_URLS.arbitrum, 42161),
    gnosis: new ethers.providers.JsonRpcProvider(RPC_URLS.gnosis, 100),
    optimism: new ethers.providers.JsonRpcProvider(RPC_URLS.optimism, 10),
    bnb: new ethers.providers.JsonRpcProvider(RPC_URLS.bnb, 56)
};

// Pool configurations
const poolDataConfigs = {
    ethereum: AaveV3Ethereum,
    polygon: AaveV3Polygon,
    base: AaveV3Base,
    arbitrum: AaveV3Arbitrum,
    gnosis: AaveV3Gnosis,
    optimism: AaveV3Optimism,
    bnb: AaveV3BNB
};

// Map chain names to ChainId values
const chainIdMap = {
    ethereum: ChainId.mainnet,
    polygon: ChainId.polygon,
    base: ChainId.base,
    arbitrum: ChainId.arbitrum_one,
    gnosis: ChainId.xdai,
    optimism: ChainId.optimism,
    bnb: ChainId.bnb
};

// All chains to fetch
const CHAINS = ['ethereum', 'polygon', 'base', 'arbitrum', 'gnosis', 'optimism', 'bnb'];

async function fetchRatesForChain(chain) {
    const provider = providers[chain];
    const config = poolDataConfigs[chain];

    const poolDataProviderContract = new UiPoolDataProvider({
        uiPoolDataProviderAddress: config.UI_POOL_DATA_PROVIDER,
        provider,
        chainId: chainIdMap[chain],
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
        token.name === "Dai Stablecoin" ||
        token.name === "USD//C on xDai" ||
        token.name === "Wrapped Ether on xDai"
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

    for (const chain of CHAINS) {
        console.log(`Fetching data for ${chain}...`);
        try {
            const data = await fetchRatesForChain(chain);
            results[chain] = data;
        } catch (error) {
            console.error(`Error fetching ${chain}:`, error);
            results[chain] = [];
        }
    }

    return results;
}
