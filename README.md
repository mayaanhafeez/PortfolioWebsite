# Portfolio

My personal portfolio site, styled as a [Neovim](https://neovim.io/) editor —
sidebar file tree, tabline, statusline, a Telescope-style fuzzy finder, vim
keybindings for navigation, and an agentic AI assistant. Built with Next.js 16
(App Router) and React 19.

## Develop

```bash
npm install
npm run dev      # dev server at http://localhost:3000
npm run build    # production build
npm start        # serve the production build
npm run lint     # ESLint (next/core-web-vitals)
```

No test framework is configured.

### Environment variables

```
GEMINI_API_KEY=      # Google AI Studio API key for the AI assistant
UPSTASH_REDIS_REST_URL=    # Upstash Redis URL for rate limiting
UPSTASH_REDIS_REST_TOKEN=  # Upstash Redis token
```

## How it works

Core files:

- `src/app/page.js` — single `"use client"` component: all state, logic, content, rendering.
- `src/app/globals.css` — all styling and the 15 color themes.
- `src/app/components/AIChat.js` — AI chat modal component.
- `src/app/api/ai/` — streaming API route that calls Gemini with tool-call support.

### Views

A `view` state variable switches between:
- **welcome** — landing screen with ASCII art and action prompts
- **editor** — the nvim-style UI (sidebar, tabline, content pane, statusline)

The editor has five sections — *about, projects, experience, skills, contact* —
and all portfolio content (projects, experience, skills, links) is hardcoded as
constants at the top of `page.js`.

### Modal overlays

- **Telescope** (`Ctrl+P`) — fuzzy finder over the site's content
- **AI assistant** (`:ai` or `:chat`, or "ask AI" on any project card) — chat with an
  LLM that knows the portfolio content and can navigate sections, switch themes,
  open links, and summarize recent public GitHub activity via tool calls. Each
  "ask AI" button on a project card opens a fresh conversation pre-loaded with a
  question about that project.
- **Help** (`:help`) — keybindings reference
- **Command bar** (`:` or `/`) — vim-style commands dispatched to a handler

### Keybindings

Handled via a `keydown` listener on `window`: `j`/`k` scroll, `gg`/`G` jump,
`Ctrl+P` Telescope, `Ctrl+T` cycle theme, `Ctrl+S` cycle style, `:` command
mode, `Esc` close overlays.

### Theming

Fifteen dark themes (Tokyo Night default, Catppuccin, Rosé Pine, Gruvbox, Nord,
Dracula, One Dark, Solarized, Everforest, Monokai, Tomorrow Night Burns,
Andromeda, Hinterlands, Vanta Black, Retro '82),
defined as `[data-theme="…"]` blocks in `globals.css`. The selected theme is
persisted to `localStorage` and applied as `data-theme` on the root element.

## Deploy

Optimized for [Vercel](https://vercel.com/) — push to deploy. Uses
[`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)
to load and optimize fonts. Set the environment variables above in the Vercel
project settings.
