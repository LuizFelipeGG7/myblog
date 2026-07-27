# myblog

Site pessoal de portfólio e blog do **Luiz Felipe Gregorio**, feito com HTML, CSS e JavaScript puro (sem frameworks, bundlers ou etapa de build).

🔗 **Acesse o site:** [luizfelipegregorio.netlify.app](https://luizfelipegregorio.netlify.app/)

## Sobre

Este projeto reúne, em um só lugar, minha apresentação pessoal e profissional. Nele você encontra:

- **Sobre mim** — uma breve apresentação sobre quem eu sou.
- **Tecnologias** — as ferramentas e linguagens com as quais trabalho.
- **Projetos** — alguns dos trabalhos que desenvolvi.
- **Educação e Cursos** — minha formação e capacitações.
- **Contato** — canais para falar comigo (WhatsApp, e-mail, redes sociais).

O site conta com **tema claro e escuro** (com preferência salva no navegador), animações suaves ao rolar a página e layout responsivo para funcionar bem em qualquer dispositivo.

## Tecnologias

- HTML5
- CSS3 (custom properties, `clamp()`, `color-mix()`, grid, glassmorphism)
- JavaScript (vanilla)

## Como executar localmente

Não há etapa de build. Basta abrir o `index.html` no navegador ou servir a pasta com qualquer servidor estático:

```bash
npx serve .
```

## Estrutura

```
myblog/
├── index.html          # Página inicial (Sobre, Tecnologias, Projetos, Educação, Cursos)
├── contact.html        # Página de contato
└── blog/
    ├── css/
    │   ├── base.css     # Base compartilhada: reset, tokens de tema, componentes
    │   ├── style.css    # Estilos da página inicial
    │   └── contact.css  # Estilos da página de contato
    ├── index.js         # Tema claro/escuro, animações de scroll, ano do rodapé
    └── img/             # Ícones e imagens
```
