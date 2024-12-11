document.addEventListener('DOMContentLoaded', () => {


    const toggleButton = document.getElementById('theme-toggle');
    const themeLink = document.getElementById('theme-link');


    if (localStorage.getItem('theme') === 'dark') {
        toggleButton.textContent = '🌞';
    } else {
        toggleButton.textContent = '🌙';
    }

    toggleButton.addEventListener('click', () => {
        if (themeLink.href.includes('/styles.css')) {
            themeLink.href = '/dark-styles.css';
            toggleButton.textContent = '🌞';
            localStorage.setItem('theme', 'dark');
        } else {
            themeLink.href = '/styles.css';
            toggleButton.textContent = '🌙';
            localStorage.setItem('theme', 'light');
        }
    });
});
