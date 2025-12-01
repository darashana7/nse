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

// Apply the theme when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
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
});
