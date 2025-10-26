document.addEventListener('DOMContentLoaded', function () {
    const themeToggle = document.getElementById('themeToggle');
    const currentTheme = localStorage.getItem('theme');

    // Verifica se há um tema salvo no localStorage
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);

        // Atualiza o texto do botão conforme o tema
        if (currentTheme === 'dark') {
            themeToggle.textContent = '🌞 Tema Claro';
        } else {
            themeToggle.textContent = '🌙 Tema Escuro';
        }
    }

    // Adiciona o evento de clique ao botão
    themeToggle.addEventListener('click', function () {
        let theme = 'light';
        if (document.documentElement.getAttribute('data-theme') !== 'dark') {
            theme = 'dark';
            themeToggle.textContent = '🌞 Tema Claro';
        } else {
            themeToggle.textContent = '🌙 Tema Escuro';
        }

        // Aplica o tema e salva no localStorage
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    });
});