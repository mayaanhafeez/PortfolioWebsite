# Portfolio

My personal portfolio site, styled as a [Neovim](https://neovim.io/) editor —
sidebar file tree, tabline, statusline, a Telescope-style fuzzy finder, and
vim keybindings for navigation. Built with Next.js 16 (App Router) and React 19.

## Develop

```bash
npm install
npm run dev      # dev server at http://localhost:3000
npm run build    # production build
npm start        # serve the production build
npm run lint     # ESLint (next/core-web-vitals)
```

No test framework is configured.

## How it works

The whole app is two files:

- `src/app/page.js` — a single `"use client"` component holding all state,
  logic, content, and rendering.
- `src/app/globals.css` — all styling, including the color themes.

### Views

A `view` state variable switches between:
- **welcome** — landing screen with ASCII art and action prompts
- **editor** — the nvim-style UI (sidebar, tabline, content pane, statusline)

The editor has five sections — *about, projects, experience, skills, contact* —
and all portfolio content (projects, experience, skills, links) is hardcoded as
constants at the top of `page.js`.

### Modal overlays

- **Telescope** (`Ctrl+P`) — fuzzy finder over the site's content
- **Help** (`:help`) — keybindings reference
- **Command bar** (`:` or `/`) — vim-style commands dispatched to a handler

### Keybindings

Handled via a `keydown` listener on `window`: `j`/`k` scroll, `gg`/`G` jump,
`Ctrl+P` Telescope, `Ctrl+T` cycle theme, `:` command mode, `Esc` close
overlays.

### Theming

Ten dark themes (Tokyo Night default, Catppuccin, Rosé Pine, Gruvbox, Nord,
Dracula, One Dark, Solarized, Everforest, Monokai), defined as
`[data-theme="…"]` blocks in `globals.css`. The selected theme is persisted to
`localStorage` and applied as `data-theme` on the root element.

## Deploy

Optimized for [Vercel](https://vercel.com/) — push to deploy. Uses
[`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)
to load and optimize fonts.
