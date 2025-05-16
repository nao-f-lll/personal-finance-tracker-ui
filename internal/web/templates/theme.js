document.addEventListener('DOMContentLoaded', () => {
    const themeToggleButton = document.getElementById('themeToggle');

    // Cargar preferencia de tema desde localStorage
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeButton(savedTheme);

    // Alternar tema
    themeToggleButton.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeButton(newTheme);
    });

    // Actualizar texto e ícono del botón
    function updateThemeButton(theme) {
        if (theme === 'dark') {
            themeToggleButton.innerHTML = '<i class="fa-solid fa-sun"></i> Cambiar a modo claro';
        } else {
            themeToggleButton.innerHTML = '<i class="fa-solid fa-moon"></i> Cambiar a modo oscuro';
        }
    }
});