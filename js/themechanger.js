const fieldset = document.getElementById('theme-picker');
const radios = fieldset.querySelectorAll('input[name="theme"]');

function safeGet(key) {
    try {
        return localStorage.getItem(key);
    } catch (e) {
        return null;
    }
}

function safeSet(key, value) {
    try {
        localStorage.setItem(key, value);
    } catch (e) {

    }
}

function applyTheme(theme) {
    if (theme === 'auto') {
        document.documentElement.removeAttribute('data-theme');
    } else {
        document.documentElement.setAttribute('data-theme', theme);
    }
}

function initPicker() {
    const saved = safeGet('theme') || 'auto';

    radios.forEach(radio => {
        radio.checked = radio.value === saved;
    });

    applyTheme(saved);

    fieldset.hidden = false;
}

radios.forEach(radio => {
    radio.addEventListener('change', () => {
        const chosen = radio.value;
        applyTheme(chosen);
        safeSet('theme', chosen);
    });
});

initPicker();