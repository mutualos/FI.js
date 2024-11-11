const equities = {
    functions: {
        intrinsicValue: {
            description: "Intrinsic value is an estimate of a company's true worth based on its financial performance and future cash flow projections.",
            
            // Main function to be called by processFormula
            implementation: function(symbol) {
                if (!symbol) {
                    displayError('Please enter a stock symbol.');
                    return 0; // Return 0 if no symbol provided
                }

                // Return cached data if available, otherwise start polling
                if (equities.functions.intrinsicValue.cachedData?.symbol === symbol) {
                    return equities.functions.intrinsicValue.cachedData.price || 0;
                } else {
                    // Trigger async fetch if data is not cached
                    equities.functions.getStockData(symbol);
                    equities.functions.pollForData(symbol);
                    return 0; // Placeholder return for processFormula
                }
            },
            
            cachedData: null // To store the cached data
        },

        // Asynchronous data fetch
        getStockData: async function(symbol) {
            try {
                const response = await fetch(`https://bankersiq.com/api/equities?symbol=${symbol}`);
                const data = await response.json();
                
                if (data.error) {
                    displayError(data.error);
                } else {
                    // Cache the result with symbol and price
                    equities.functions.intrinsicValue.cachedData = { symbol: symbol, price: data.currentPrice };
                }
            } catch (error) {
                console.error('An error occurred while fetching data:', error);
                displayError('An error occurred while fetching data.');
            }
        },

        // Polling function to wait for data to be available
        pollForData: function(symbol) {
            const interval = setInterval(() => {
                // Check if data is cached for the symbol
                if (equities.functions.intrinsicValue.cachedData?.symbol === symbol) {
                    console.log('Data is now available for:', symbol);
                    document.getElementById('outputElement').textContent = equities.functions.intrinsicValue.cachedData.price;
                    clearInterval(interval); // Stop polling
                }
            }, 100); // Check every 100 milliseconds
        }
    }
};

window.equities = equities; // Make it globally accessible
