//I did use Claude in this assignment.
// The toggle button simply just gets my "theme-toggle" element. 
const toggleBtn = document.getElementById('theme-toggle');

function getPreferredTheme() {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

const theme = getPreferredTheme();
document.documentElement.setAttribute('data-theme', theme);
updateButtonText(theme);

//toggle on click
toggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateButtonText(newTheme);
});

function updateButtonText(theme) {
    toggleBtn.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
}
