# Portfolio content: Ayaan Hafeez

Use this content as written. You may shorten a sentence to fit a layout, but never
add claims, numbers, users, dates, adjectives like "production-grade", or anything
not stated here. Every fact below has been checked against the repos.

Target reader: an internship recruiter or engineer hiring for **software roles: backend,
AI tooling, and apps**, spending under a minute on the page. Systems is a stated interest,
not the whole pitch.

---

## Meta

- Page title: `Ayaan Hafeez · Software developer: backend, AI tooling & systems`
- Meta description: `4th-year Computer Engineering (Software Option) student at the University of Alberta. Three co-op terms building LLM pipelines and backends at Elev8AI. Ships macOS apps, AI dev tools, and systems projects; merged PRs to Omarchy and Vorssaint.`
- Canonical / og:url: `https://www.ayaanhafeez.dev/`
- og:image: `https://www.ayaanhafeez.dev/opengraph-image` (1200×630)

## Links (must be visible on the first screen, as normal links: resume, GitHub, LinkedIn, blog)

- Resume: https://www.ayaanhafeez.dev/Ayaan_Hafeez_Resume.pdf
- GitHub: https://github.com/mayaanhafeez
- LinkedIn: https://www.linkedin.com/in/ayaanhafeez
- Email: mhafeez1@ualberta.ca (mailto:)
- Personal email: m.ayaan.hafeez@gmail.com (mailto:)
- Blog: https://the-rubber-duck-blog.vercel.app/ (also in the footer)
- Top bar, right-aligned with logos: GitHub, email (m.ayaan.hafeez@gmail.com), LinkedIn
- The two emails live in the contact section, not the first-screen links.

## Hero

- Name: **Ayaan Hafeez**
- One-line pitch, shown as the first of three short bullets in the hero:
  - Backend, AI tooling, and apps; interested in systems
  - 4th-year Computer Engineering (Software Option), University of Alberta
  - 3 co-op terms as an AI Developer at Elev8AI

---

## Experience

### AI Developer: Elev8AI (Remote)
- Dates: Co-op Summer 2025, Winter 2026, Summer 2026 · Part-time Sep 2026 – Present
- Built an NL2SQL network-monitoring chatbot with LangChain, Ollama, ChromaDB, and
  PostgreSQL: an intent classifier routes questions to SQL generation, RAG retrieval, or
  general answers, with session-aware context across turns; 85% answer accuracy on
  internal benchmarks.
- Built the backend for a social media platform: FastAPI with PostgreSQL and Redis, RBAC
  and JWT auth, Stripe subscriptions synced by webhooks, and ML identity verification;
  deployed with Docker and nginx behind a React/TypeScript frontend.
- Built an API documentation scraper (Selenium + OpenAI) that crawls docs sites, GitHub
  repos, and PDFs into typed OpenAPI schemas; extracted 100+ endpoints and cut developer
  hours by 90%.
- Took part in customer requirements meetings for AI and ERP projects and ran functional
  QA on end-to-end business scenarios before delivery.
- This work is under NDA: no links, and no project cards for it (the page doesn't say so).

---

## Open source (merged pull requests; each PR number must be a link)

1. **Omarchy** (Arch + Hyprland Linux distribution, 45K GitHub stars)
   - Fixed a lopsided keyboard/hover highlight on the network panel's header actions and
     made the shared square action button pixel-snap its icon at fractional display scales.
   - PR #8787, merged Oct 2026: https://github.com/omacom/omarchy/pull/8787
2. **Vorssaint** (macOS menu bar toolkit, 29K GitHub stars), Swift
   - Fixed a bug that could leave a laptop with no usable screen after unplugging an
     external monitor: recovery now ignores virtual displays and switches stranded physical
     displays back on, with regression tests for headless setups.
   - PR #624, merged Aug 2026: https://github.com/vorssaint/vorssaint-utils/pull/624
3. **Hyprspace** (tiling window manager for macOS), Swift
   - Added smart single-window gaps and floating-window resize/centre keys (PR #4), and
     modifier-drag to move windows with retiling on drop (PR #5). Both merged Sep 2026.
   - https://github.com/PeachlifeAB/hyprspace-core/pull/4
   - https://github.com/PeachlifeAB/hyprspace-core/pull/5

---

## Featured projects (5, a mix: app, AI tooling, dev tool, extension, one systems deep-dive) — show every field, open by default, no "show more"

Each has: name, what it does (one line), what was hard or interesting, tech tags, links,
and a proof element.

### 1. Kitsune: keyboard launcher for macOS
- What: A launcher that opens on a global hotkey to fuzzy-search apps, a nested command menu,
  search providers, and system actions.
- Hard part: AppKit owns everything native (the panel, rendering, the app index, fuzzy
  matching, the hotkey, and IPC) while an embedded Lua 5.4 runtime owns the data (menus,
  actions, plugins, and the theme), so configs and plugins reshape it without touching Swift.
  Releases publish to a Homebrew cask from a tag push, and a `kitsunectl` CLI drives it from
  scripts.
- Tech: Swift, AppKit, Lua 5.4, Unix sockets, Homebrew
- Links: Site https://kitsune.ayaanhafeez.dev · GitHub https://github.com/mayaanhafeez/app_launcher
- Proof: `public/img/kitsune.jpg`, a 1280×1040 crop of the repo's
  `docs/kitsune-rose-pine-moon-launcher.jpg` around the panel, and the install commands:
  ```
  brew tap mayaanhafeez/kitsune https://github.com/mayaanhafeez/app_launcher
  brew install --cask kitsune
  ```
- Dates: Aug 2026 – Present (v0.9.0 Sep 29, v0.9.1 Oct 26)

### 2. surgraft: token-efficient code moves for LLM tools
- What: Moves functions between files for LLM coding tools without spending tokens on code
  that didn't change.
- Hard part: Locates function boundaries with Python's AST (a regex heuristic for
  JS/TS), byte-copies the exact range, and only sends the snippet to the model for an
  optional edit pass. Ships as a CLI, a Python library, and an MCP server.
- Tech: Python, AST, Claude API, MCP
- Links: PyPI https://pypi.org/project/surgraft/ · GitHub https://github.com/mayaanhafeez/surgraft
- Proof (show as a small table): moving one 20-line function out of a 5,000-line file
  | approach | input tokens |
  |---|---|
  | naive LLM rewrite | ~44,000 |
  | surgraft, copy only | 0 |
  | surgraft + edit pass | ~180 |
- Dates: May – Jul 2026

### 3. ssht: persistent SSH sessions
- What: Turns every SSH connection into a resumable tmux session, so work survives sleep,
  network drops, and switching machines.
- Hard part: It wraps the system `ssh` instead of reimplementing it, so ProxyJump, keys,
  and hardware tokens keep working. A hand-written `~/.ssh/config` parser handles Include
  recursion, Match blocks, and wildcard hosts, and tokio probes hosts concurrently so the
  fuzzy picker never blocks on a slow one. Optional Mosh transport and local-echo mode for
  high-latency links.
- Tech: Rust, tokio, ratatui, SQLite, tmux, mosh
- Links: GitHub https://github.com/mayaanhafeez/ssht · crates.io https://crates.io/crates/ssht
- Proof (show as a code block):
  ```
  brew install mayaanhafeez/tap/ssht
  cargo install ssht
  ```
- Dates: Jun – Aug 2026

### 4. FocusNode: site blocker for Chrome and Firefox
- What: A browser extension that blocks distracting sites while focus mode is on, published
  on the Chrome Web Store and Firefox Add-ons.
- Hard part: One React + Vite codebase ships to Chrome, Firefox, and Zen through the
  WebExtensions API. Blocking covers subdomains, turning focus mode off sends a blocked tab
  back to the page it came from, and settings persist through the storage API with only the
  storage and tabs permissions.
- Tech: React, Vite, JavaScript, WebExtensions API
- Links: Chrome Web Store https://chromewebstore.google.com/detail/focus-mode-blocker/bhkiedimpjpeoggbodjedjcopedhdaoo ·
  Firefox Add-ons https://addons.mozilla.org/en-US/firefox/addon/focusnode-website-blocker/ ·
  GitHub https://github.com/mayaanhafeez/FocusNode
- Proof: screenshot `https://raw.githubusercontent.com/mayaanhafeez/FocusNode/main/screenshots/popup.png` (486×550).
  Don't cite user counts (5 Chrome, 1 Firefox as of Oct 2026).
- Dates: Jan – Jul 2026

### 5. Bare-metal Raspberry Pi 3 kernel
- What: A single-core AArch64 kernel for the Raspberry Pi 3 in C and ARMv8 assembly, with
  no libc, built by following Sergey Matyukevich's raspberry-pi-os lesson series.
- Hard part: Boot and BSS setup, dropping from EL3/EL2 to EL1, exception vectors and timer
  IRQs, and a round-robin preemptive scheduler with context switching; then EL0 user
  processes with system calls (write, malloc, clone/fork, exit) and per-process page
  tables, where fork copies the parent's user pages. Tested under QEMU.
- Tech: C, ARMv8 assembly, QEMU
- Links: GitHub https://github.com/mayaanhafeez/raspberry-pi-os
- Proof (real QEMU output; show as a code block):
  ```
  $ ./run.sh
  Kernel proess started. EL 1
  user process
  1234512345abcdeabcdeabcde1234512345...
  ```
  Caption: two forked user processes with separate page tables, interleaved by the
  preemptive scheduler. (Keep the "proess" typo; it is the kernel's real output.)
- Dates: May – Jul 2026

---

## More projects (compact cards: name, one line, links)

- **macwifi**: Terminal UI for managing Wi-Fi on macOS, a clean-room port of the Linux tool
  impala, with a LaunchAgent daemon and client talking over a Unix socket.
  https://github.com/mayaanhafeez/macwifi
- **simdlings**: A rustlings-style course for ARM NEON SIMD in C: 24 exercises with an
  adversarial test harness, where your kernels must beat the scalar version.
  https://github.com/mayaanhafeez/simdlings
- **ASCII**: Image-to-ASCII converter with a drag-and-drop web UI, a serverless Python API on
  Vercel, and a CLI. https://ascii.ayaanhafeez.dev · https://github.com/mayaanhafeez/ASCII
- **agent-sudo-mac**: Lets coding agents run sudo on macOS without a TTY, using Touch ID
  with a GUI password fallback. https://github.com/mayaanhafeez/agent-sudo-mac

Left off on purpose: Tuesday.com, agent-usage, the EMG controller (1 of 14 commits, so its
latency claims can't be backed), BookmarkAPI.

---

## Skills (short; no bars, percentages, or logos)

- Comfortable with: Python, C, Rust, TypeScript, PostgreSQL, Docker, FastAPI, Linux
- Have used: Swift, Kotlin, ARM assembly, LangChain, Ollama, ChromaDB, Redis, tokio, React

## Education

- University of Alberta: BSc Computer Engineering, Co-op, Software Option. Expected May 2028.
- Relevant coursework: Operating Systems (in progress), Database Management (in progress),
  Software Testing & Maintenance (in progress), Data Structures & Algorithms, Computer
  Organization & Assembly, Software Requirements.

## Contact (closing section)

- Short line: "The fastest way to reach me is email."
- mhafeez1@ualberta.ca · m.ayaan.hafeez@gmail.com · LinkedIn
