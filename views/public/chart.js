async function getRatesData() {
    const response = await fetch('/rates/usdc');
    apyData = await response.json();

// Group data by "chain" and extract "supplyAPY" values for the chart
const chartData = apyData.reduce((acc, item) => {
    // Find the existing chain group
    let group = acc.find(entry => entry.name === item.chain);
    if (!group) {
        // If not found, create a new group
        group = { name: item.chain, data: [] };
        acc.push(group);
    }
    // Add the APY value to the group's data array
    group.data.push((item.supplyAPY * 100).toFixed(2)); // Change to item.borrowAPY if needed
    return acc;
}, []);

    var options = {
        chart: {
            type: 'line',
            height: 350
        },
        series: chartData,
        xaxis: {
            categories: apyData.map((data) => data.timestamp)
        }
    }
    var chart = new ApexCharts(document.querySelector("#chart"), options);

    chart.render();
}

getRatesData();



