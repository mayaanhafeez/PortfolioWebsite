# Portfolio content: Ayaan Hafeez

Use this content as written. You may shorten a sentence to fit a layout, but never
add claims, numbers, users, dates, adjectives like "production-grade", or anything
not stated here. Every fact below has been checked against the repos.

Target reader: an internship recruiter or engineer hiring for **backend, AI systems,
or systems programming** roles, spending under a minute on the page.

---

## Meta

- Page title: `Ayaan Hafeez · Backend, AI systems & systems programming`
- Meta description: `4th-year Computer Engineering (Software Option) student at the University of Alberta. Three co-op terms building LLM pipelines and backends at Elev8AI. Systems work in Rust and C; merged PRs to Omarchy and Vorssaint.`
- Canonical / og:url: `https://www.ayaanhafeez.dev/`
- og:image: `https://www.ayaanhafeez.dev/opengraph-image` (1200×630)

## Links (must be visible on the first screen, as normal links)

- Resume: https://www.ayaanhafeez.dev/Ayaan_Hafeez_Resume.pdf
- GitHub: https://github.com/mayaanhafeez
- LinkedIn: https://www.linkedin.com/in/ayaanhafeez
- Email: mhafeez1@ualberta.ca (mailto:)
- Personal email: m.ayaan.hafeez@gmail.com (mailto:)
- Secondary (footer only): Blog https://the-rubber-duck-blog.vercel.app/

## Hero

- Name: **Ayaan Hafeez**
- One-line pitch: **I build backend services, AI systems, and low-level software.**
- Supporting line: 4th-year Computer Engineering (Software Option) at the University of
  Alberta. Three co-op terms as an AI Developer at Elev8AI. Looking for 2027 internships
  in backend, AI infrastructure, and systems.
- Location: Edmonton, AB

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
- Note: this work is under NDA, so there are no links. Do not show it as project cards.

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
3. **Hyprspace** (AeroSpace fork for macOS window management), Swift
   - Added smart single-window gaps and floating-window resize/centre keys (PR #4), and
     modifier-drag to move windows with retiling on drop (PR #5). Both merged Sep 2026.
   - https://github.com/PeachlifeAB/hyprspace-core/pull/4
   - https://github.com/PeachlifeAB/hyprspace-core/pull/5

---

## Featured projects (5) — show every field, open by default, no "show more"

Each has: name, what it does (one line), what was hard or interesting, tech tags, links,
and a proof element.

### 1. ssht: persistent SSH sessions
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

### 2. Bare-metal Raspberry Pi 3 kernel
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

### 3. macwifi: Wi-Fi manager for the macOS terminal
- What: A terminal UI for scanning, joining, and managing Wi-Fi on macOS; a clean-room port
  of the Linux tool impala.
- Hard part: Split into a LaunchAgent daemon that owns the CoreWLAN interface and a client
  that talks to it over a Unix socket, so scans run in a session that gets real network
  names instead of redacted ones. Speed tests from four backends are normalized into one
  schema and streamed as JSONL events that other front ends can follow live.
- Tech: Rust, tokio, ratatui, CoreWLAN, Keychain, Unix sockets
- Links: GitHub https://github.com/mayaanhafeez/macwifi
- Proof: screenshot
  `https://raw.githubusercontent.com/mayaanhafeez/macwifi/main/images/demo.png`
  alt: "macwifi TUI showing known networks, new networks, and device tables"
  Also: `brew install mayaanhafeez/tap/macwifi`
- Dates: Jun – Sep 2026

### 4. surgraft: token-efficient code moves for LLM tools
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

### 5. simdlings: learn ARM NEON SIMD by fixing broken kernels
- What: A rustlings-style course in C: 24 exercises where you repair broken NEON vector
  code, then write kernels that must beat the scalar version by 1.6×–3×.
- Hard part: The test harness is adversarial. Buffers end against a PROT_NONE guard page so
  a one-byte overread faults immediately, canaries catch negative indexing, every kernel is
  checked at awkward lengths (0, 1, 3, 17, 1001, ...), and the scalar reference is compiled
  with autovectorization off so measured speedups are real.
- Tech: C, ARM NEON, Bash
- Links: GitHub https://github.com/mayaanhafeez/simdlings

---

## More projects (compact list: name, one line, link)

- **agent-usage**: Rust TUI showing token usage and rate limits for Claude Code, Codex,
  OpenCode, and Gemini CLI side by side, read from each tool's local history.
  https://github.com/mayaanhafeez/agent-usage
- **agent-sudo-mac**: Lets coding agents run sudo on macOS without a TTY, using Touch ID
  with a GUI password fallback. https://github.com/mayaanhafeez/agent-sudo-mac
- **Kitsune**: Keyboard launcher for macOS in Swift and AppKit, scriptable with embedded
  Lua 5.4; installs via Homebrew. https://kitsune.ayaanhafeez.dev ·
  https://github.com/mayaanhafeez/app_launcher
- **FocusNode**: Site-blocking browser extension published on the Chrome Web Store and
  Firefox Add-ons. https://github.com/mayaanhafeez/FocusNode

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
- mhafeez1@ualberta.ca · m.ayaan.hafeez@gmail.com · GitHub · LinkedIn · Resume (PDF)
