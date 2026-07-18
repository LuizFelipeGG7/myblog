/* =========================================================
   index.js — tema (claro/escuro) + revelação ao rolar.
   Compartilhado entre as páginas. Sem módulos/bundler.
   ========================================================= */

(function () {
    const STORAGE_KEY = 'theme';
    const root = document.documentElement;
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)');

    // Tema inicial: preferência salva > preferência do sistema.
    function preferredTheme() {
        return localStorage.getItem(STORAGE_KEY) || (systemDark.matches ? 'dark' : 'light');
    }

    function applyTheme(theme) {
        root.setAttribute('data-theme', theme);
        const toggle = document.getElementById('themeToggle');
        if (toggle) {
            const dark = theme === 'dark';
            toggle.textContent = dark ? '☀️' : '🌙';
            toggle.setAttribute('aria-label', dark ? 'Ativar tema claro' : 'Ativar tema escuro');
            toggle.setAttribute('title', dark ? 'Tema claro' : 'Tema escuro');
        }
    }

    // Aplica o tema o quanto antes (script no final do body).
    applyTheme(preferredTheme());

    document.addEventListener('DOMContentLoaded', function () {
        const toggle = document.getElementById('themeToggle');

        if (toggle) {
            toggle.addEventListener('click', function () {
                const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
                localStorage.setItem(STORAGE_KEY, next);

                // Transição suave entre temas quando suportado.
                if (document.startViewTransition) {
                    document.startViewTransition(() => applyTheme(next));
                } else {
                    applyTheme(next);
                }
            });
        }

        // Acompanha o sistema enquanto o usuário não escolheu manualmente.
        systemDark.addEventListener('change', function (e) {
            if (!localStorage.getItem(STORAGE_KEY)) {
                applyTheme(e.matches ? 'dark' : 'light');
            }
        });

        // Ano atual no rodapé.
        const yearEl = document.getElementById('year');
        if (yearEl) {
            yearEl.textContent = new Date().getFullYear();
        }

        // Lista dinâmica de repositórios do GitHub.
        loadRepos();

        // Revelação ao rolar. (observa também itens inseridos depois)
        const revealItems = document.querySelectorAll('.reveal');
        if ('IntersectionObserver' in window && revealItems.length) {
            const observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in-view');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

            revealItems.forEach(function (el) { observer.observe(el); });
        } else {
            revealItems.forEach(function (el) { el.classList.add('in-view'); });
        }
    });

    /* ---------------------------------------------------------------
       Repositórios do GitHub (seção "Outros repositórios").
       Busca via API pública, exclui os já destacados e alguns repos,
       e usa cache de sessão para poupar o limite de requisições.
       --------------------------------------------------------------- */

    // Repos que NÃO devem aparecer aqui (destacados em "Projetos" + perfil + ocultos).
    const EXCLUDED_REPOS = [
        'mapeamento_pc',
        'contador',
        'trabalho_faculdade',
        'aulas-web',
        'luizfelipegg7'
    ];
    const MAX_REPOS = 6;
    const CACHE_TTL = 60 * 60 * 1000; // 1 hora

    function loadRepos() {
        const list = document.getElementById('repoList');
        if (!list) return;

        const user = list.getAttribute('data-user');
        if (!user) return;

        const cacheKey = 'gh-repos:' + user;
        const cached = readCache(cacheKey);
        if (cached) {
            renderRepos(list, cached, user);
            return;
        }

        const url = 'https://api.github.com/users/' + encodeURIComponent(user) +
            '/repos?sort=pushed&per_page=100';

        fetch(url, { headers: { Accept: 'application/vnd.github+json' } })
            .then(function (res) {
                if (!res.ok) throw new Error('HTTP ' + res.status);
                return res.json();
            })
            .then(function (repos) {
                const cleaned = (Array.isArray(repos) ? repos : [])
                    .filter(function (r) { return !r.fork; })
                    .filter(function (r) { return EXCLUDED_REPOS.indexOf(r.name.toLowerCase()) === -1; })
                    .map(function (r) {
                        return {
                            name: r.name,
                            description: r.description,
                            language: r.language,
                            html_url: r.html_url
                        };
                    });
                writeCache(cacheKey, cleaned);
                renderRepos(list, cleaned, user);
            })
            .catch(function () {
                renderReposError(list, user);
            });
    }

    function renderRepos(list, repos, user) {
        list.textContent = '';

        if (!repos.length) {
            renderReposError(list, user);
            return;
        }

        repos.slice(0, MAX_REPOS).forEach(function (repo) {
            const a = document.createElement('a');
            a.className = 'repo-item';
            a.href = repo.html_url;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';

            const icon = document.createElement('span');
            icon.className = 'repo-icon';
            icon.setAttribute('aria-hidden', 'true');
            const iconImg = document.createElement('img');
            iconImg.src = 'blog/img/github-svgrepo-com.svg';
            iconImg.alt = '';
            icon.appendChild(iconImg);

            const body = document.createElement('span');
            body.className = 'repo-body';

            const name = document.createElement('span');
            name.className = 'repo-name';
            name.textContent = repo.name;
            body.appendChild(name);

            if (repo.description) {
                const desc = document.createElement('span');
                desc.className = 'repo-desc';
                desc.textContent = repo.description;
                body.appendChild(desc);
            }

            a.appendChild(icon);
            a.appendChild(body);

            if (repo.language) {
                const lang = document.createElement('span');
                lang.className = 'repo-lang';
                lang.textContent = repo.language;
                a.appendChild(lang);
            }

            const arrow = document.createElement('span');
            arrow.className = 'repo-arrow';
            arrow.setAttribute('aria-hidden', 'true');
            arrow.textContent = '→';
            a.appendChild(arrow);

            list.appendChild(a);
        });
    }

    function renderReposError(list, user) {
        list.textContent = '';
        const p = document.createElement('p');
        p.className = 'repo-state muted';
        p.textContent = 'Não foi possível carregar agora. ';
        const link = document.createElement('a');
        link.href = 'https://github.com/' + user + '?tab=repositories';
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = 'Ver repositórios no GitHub →';
        p.appendChild(link);
        list.appendChild(p);
    }

    function readCache(key) {
        try {
            const raw = sessionStorage.getItem(key);
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            if (Date.now() - parsed.t > CACHE_TTL) return null;
            return parsed.data;
        } catch (e) {
            return null;
        }
    }

    function writeCache(key, data) {
        try {
            sessionStorage.setItem(key, JSON.stringify({ t: Date.now(), data: data }));
        } catch (e) {
            /* sessionStorage indisponível — segue sem cache. */
        }
    }
})();