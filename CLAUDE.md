# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

A static personal portfolio/blog site for Luiz Felipe Gregorio (Portuguese/pt-BR content). No build tooling, no bundler, no framework — plain HTML, CSS, and vanilla JS served directly as static files.

## Running the site

There is no dev server, build step, or test suite configured (`npm test` is a placeholder that exits with an error). To preview changes, open `index.html` or `contact.html` directly in a browser, or serve the directory with any static file server (e.g. `npx serve .`).

## Architecture

- `index.html` — home/"About" page (hero, Sobre, Tecnologias, Projetos, Educação, Cursos). Much of the content is intentionally editable placeholder text in pt-BR.
- `contact.html` — contact page with links (WhatsApp, Gmail).
- `blog/css/base.css` — **shared foundation loaded first on every page**: CSS reset, design tokens (colors, radii, gradients as custom properties on `:root` for light and `[data-theme="dark"]` for dark), and shared components (`.navbar`, `.btn`, `.card`, `.chip`, `.site-footer`, `.reveal`, theme toggle). Change global look/theme here.
- `blog/css/style.css` — home-only styles (`.hero`, `.projects`, `.timeline`, etc.). Loaded after `base.css`.
- `blog/css/contact.css` — contact-only styles. Loaded after `base.css`; fully theme-variable-driven, so `contact.html` participates in the light/dark toggle.
- `blog/index.js` — single script, shared across pages: theme init/toggle (with `View Transitions` when available), `IntersectionObserver` scroll-reveal for `.reveal` elements, and footer year injection (`#year`).
- `blog/img/` — static image/icon assets (favicon, profile photo, SVG icons for GitHub/LinkedIn/WhatsApp/Gmail). Dark-mode icon recoloring is done via a CSS `filter: invert(1)` rule in `base.css`, not separate assets.

Both pages load Google Fonts (Inter + Space Grotesk) via `<link>`, with a system-font fallback in the CSS stack so they still render offline.

## Theming pattern

Theme state is persisted in `localStorage` under the key `theme` and applied via a `data-theme` attribute on `<html>`, toggled by the `#themeToggle` button (see `blog/index.js`). Initial theme falls back to the OS `prefers-color-scheme` when nothing is saved, and follows OS changes until the user picks manually. The `<html>` tag ships with `data-theme="dark"` to avoid a flash before JS runs. When adding theme-aware styles, use the custom properties defined in `base.css` (`--bg`, `--text`, `--primary`, `--surface`, `--grad`, …) rather than hardcoding colors.

## Conventions

- Content and UI text is in Portuguese (pt-BR); keep new user-facing text consistent with this.
- Pages are plain `<script src="blog/index.js">` includes with no modules/bundling — new JS should follow the same plain-script style. `index.js` is wrapped in an IIFE and reads/writes theme before `DOMContentLoaded` to prevent a flash.
- Prefer modern CSS already in use here (custom properties, `clamp()` fluid type, `color-mix()`, grid `auto-fit`/`minmax`, `backdrop-filter` glass) over adding tooling.
- Respect `prefers-reduced-motion` — `base.css` already neutralizes animations/reveals under it.