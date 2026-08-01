//setting the fieldset and the radio pickers
const fieldset = document.getElementById('theme-picker');
const radios = fieldset.querySelectorAll('input[name="theme"]');
//setters and getters for local storage
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
//applying the automatic theme when "auto" is selected
function applyTheme(theme) {
    if (theme === 'auto') {
        document.documentElement.removeAttribute('data-theme');
    } else {
        document.documentElement.setAttribute('data-theme', theme);
    }
}
//the initial picker, first either picks saved theme or the automatic
//checks if each value for the radio is the same as the saved value
//then applies the saved theme
//
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