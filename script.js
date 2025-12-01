// Function to set the theme
function setTheme(theme) {
  const html = document.documentElement;
  if (theme === 'system') {
    // Use system theme
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    setTheme(systemTheme);
    localStorage.setItem('theme', 'system');
    return;
  }

  if (theme === 'dark') {
    html.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    html.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
  updateThemeButtons(theme);
}

// Function to apply the saved theme on page load
function applyTheme() {
  const savedTheme = localStorage.getItem('theme');
  setTheme(savedTheme || 'system'); // Default to system theme
}

function updateThemeButtons(activeTheme) {
    const lightThemeButton = document.getElementById('light-theme-button');
    const darkThemeButton = document.getElementById('dark-theme-button');
    const systemThemeButton = document.getElementById('system-theme-button');

    if(lightThemeButton && darkThemeButton && systemThemeButton) {
        // Reset all buttons
        lightThemeButton.classList.remove('bg-white', 'dark:bg-slate-900', 'text-slate-900', 'dark:text-white');
        darkThemeButton.classList.remove('bg-white', 'dark:bg-slate-900', 'text-slate-900', 'dark:text-white');
        systemThemeButton.classList.remove('bg-white', 'dark:bg-slate-900', 'text-slate-900', 'dark:text-white');

        if (activeTheme === 'dark') {
            darkThemeButton.classList.add('bg-white', 'dark:bg-slate-900', 'text-slate-900', 'dark:text-white');
        } else if (activeTheme === 'light') {
            lightThemeButton.classList.add('bg-white', 'dark:bg-slate-900', 'text-slate-900', 'dark:text-white');
        } else {
            systemThemeButton.classList.add('bg-white', 'dark:bg-slate-900', 'text-slate-900', 'dark:text-white');
        }
    }
}

// Dynamically set back button href
function setBackButtonHref() {
    const backButton = document.getElementById('back-button');
    if (backButton) {
        if (document.referrer.includes('stock-detail.html')) {
            backButton.href = 'stock-detail.html';
        } else {
            backButton.href = 'alerts.html';
        }
    }
}

// Fetch and parse CSV data
async function fetchStockData() {
    const url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQJoI0vyaPtZJTzWiU7gkNmUV7rli5o2M-moulOVkiPa2BZ_d6FrZP0Jxi4JkrRw9pN2WtH7ZDIrTtl/pub?gid=1600033224&single=true&output=csv';
    try {
        const response = await fetch(url);
        const csvText = await response.text();
        const lines = csvText.split('\n').slice(1); // Skip header row
        const stocks = lines.map(line => {
            const [symbol, name, price, change] = line.split(',');
            return { symbol, name, price: parseFloat(price), change };
        });
        return stocks;
    } catch (error) {
        console.error('Error fetching stock data:', error);
        return [];
    }
}

// Search and filter stocks
function filterStocks(stocks, query) {
    const lowerCaseQuery = query.toLowerCase();
    return stocks.filter(stock =>
        stock.symbol.toLowerCase().includes(lowerCaseQuery) ||
        stock.name.toLowerCase().includes(lowerCaseQuery)
    );
}

// Render watchlist
function renderWatchlist(stocks) {
    const container = document.getElementById('watchlist-container');
    container.innerHTML = '';
    stocks.forEach(stock => {
        const stockElement = document.createElement('a');
        stockElement.href = 'stock-detail.html';
        stockElement.className = 'flex items-center gap-4 px-4 min-h-[72px] py-2 justify-between border-t border-gray-200/50 dark:border-gray-700/50';

        const changeClass = stock.change.startsWith('+') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
        const bgClass = stock.change.startsWith('+') ? 'bg-green-500/10 dark:bg-green-500/20' : 'bg-red-500/10 dark:bg-red-500/20';

        stockElement.innerHTML = `
            <div class="flex items-center gap-4">
                <div class="flex flex-col justify-center">
                    <p class="text-gray-900 dark:text-white text-base font-semibold leading-normal line-clamp-1">${stock.symbol}</p>
                    <p class="text-gray-500 dark:text-[#92adc9] text-sm font-normal leading-normal line-clamp-2">${stock.name}</p>
                </div>
            </div>
            <div class="flex flex-col items-end shrink-0">
                <p class="text-gray-900 dark:text-white text-base font-medium leading-normal">$${stock.price.toFixed(2)}</p>
                <div class="flex items-center justify-center rounded-md ${bgClass} px-2 py-0.5">
                    <p class="${changeClass} text-sm font-medium leading-normal">${stock.change}</p>
                </div>
            </div>
        `;
        container.appendChild(stockElement);
    });

    const lastUpdated = document.getElementById('last-updated');
    lastUpdated.textContent = new Date().toLocaleTimeString();
}

// Apply the theme when the DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    applyTheme();
    setBackButtonHref();

    const lightThemeButton = document.getElementById('light-theme-button');
    const darkThemeButton = document.getElementById('dark-theme-button');
    const systemThemeButton = document.getElementById('system-theme-button');

    if(lightThemeButton && darkThemeButton && systemThemeButton) {
        lightThemeButton.addEventListener('click', () => setTheme('light'));
        darkThemeButton.addEventListener('click', () => setTheme('dark'));
        systemThemeButton.addEventListener('click', () => setTheme('system'));
    }

    const searchInput = document.getElementById('search-input');
    const clearSearchButton = document.getElementById('clear-search-button');
    const refreshButton = document.getElementById('refresh-button');

    if(searchInput) {
        let stocks = await fetchStockData();
        renderWatchlist(stocks);

        searchInput.addEventListener('input', () => {
            const query = searchInput.value;
            const filteredStocks = filterStocks(stocks, query);
            renderWatchlist(filteredStocks);

            if (query) {
                clearSearchButton.style.display = 'block';
            } else {
                clearSearchButton.style.display = 'none';
            }
        });

        clearSearchButton.addEventListener('click', () => {
            searchInput.value = '';
            clearSearchButton.style.display = 'none';
            renderWatchlist(stocks);
        });

        refreshButton.addEventListener('click', async () => {
            stocks = await fetchStockData();
            renderWatchlist(stocks);
        });
    }
});
