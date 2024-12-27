let apyData;

async function fetchData() {
    document.getElementById('loading-indicator').classList.remove('hidden');
    document.getElementById('data').classList.add('hidden');

    try {
        const response = await fetch('/rates');
        apyData = await response.json();

        // Populate tables
        populateTable('USDC');
        populateTable('USDT');
        populateTable('WETH');
        populateTable('DAI');

        // Populate the highest Supply APY table
        populateHighestSupplyAPY();
    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        document.getElementById('loading-indicator').classList.add('hidden');
        document.getElementById('data').classList.remove('hidden');
    }
}

function populateTable(asset) {
    const tableBody = document.querySelector(`#${asset.toLowerCase()}-table`);
    tableBody.innerHTML = '';

    for (const chain in apyData) {
        const item = apyData[chain].find(i => i.symbol === asset);
        if (item) {
            const row = `
                <tr>
                    <td class="px-4 py-3 text-gray-100">${chain.charAt(0).toUpperCase() + chain.slice(1)}</td>
                    <td class="px-4 py-3 text-gray-100">${(parseFloat(item.supplyAPY) * 100).toFixed(2)}%</td>
                    <td class="px-4 py-3 text-gray-100">${(parseFloat(item.variableBorrowAPY) * 100).toFixed(2)}%</td>
                </tr>
            `;
            tableBody.insertAdjacentHTML('beforeend', row);
        }
    }
}

function populateHighestSupplyAPY() {
    const tableBody = document.querySelector('#highest-apy-table');
    tableBody.innerHTML = '';

    const tokens = ['USDC', 'USDT', 'WETH', 'DAI'];
    tokens.forEach(token => {
        let highestAPY = 0;
        let highestChain = '';

        for (const chain in apyData) {
            const item = apyData[chain].find(i => i.symbol === token);
            if (item && parseFloat(item.supplyAPY) > highestAPY) {
                highestAPY = parseFloat(item.supplyAPY);
                highestChain = chain.charAt(0).toUpperCase() + chain.slice(1);
            }
        }

        if (highestChain) {
            const row = `
                <tr>
                    <td class="px-4 py-3 text-gray-100">${token}</td>
                    <td class="px-4 py-3 text-gray-100">${highestChain}</td>
                    <td class="px-4 py-3 text-gray-100">${(highestAPY * 100).toFixed(2)}%</td>
                    <td class="px-4 py-3 text-indigo-600"><a target="_blank" rel="noopener noreferrer" href="https://app.aave.com/markets/?marketName=proto_${highestChain.toLocaleLowerCase()}_v3"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg></a></td>
                </tr>
            `;
            tableBody.insertAdjacentHTML('beforeend', row);
        }
    });
}

window.onload = fetchData;