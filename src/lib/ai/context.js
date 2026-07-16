const SECTIONS = ["about", "projects", "experience", "skills", "contact"];

const THEMES = [
  "tokyo-night", "catppuccin", "rose-pine", "gruvbox", "nord",
  "dracula", "one-dark", "solarized", "everforest", "monokai", "tomorrow-night-burns",
];

const PROJECTS = [
  {
    title: "Bare Metal Raspberry Pi OS",
    subtitle: "OS kernel from scratch in C and ARM Assembly",
    tech: ["C", "ARM Assembly", "Raspberry Pi"],
    bullets: [
      "Built a bare-metal OS kernel across 6 subsystems: bootloader, UART/GPIO drivers, interrupt controller, preemptive scheduler, system calls, and MMU-backed virtual memory — zero external dependencies.",
      "Implemented preemptive process scheduler and fork-based process isolation using ARM exception levels and per-process page tables, supporting concurrent execution across all 4 CPU cores.",
    ],
    links: [{ label: "GitHub", href: "https://github.com/mayaanhafeez/raspberry-pi-os" }],
    type: "personal",
  },
  {
    title: "Terminal Mystery",
    subtitle: "Murder-mystery game played through a fake terminal",
    tech: ["Lua", "LÖVE"],
    bullets: [
      "The mansion is a virtual filesystem — rooms are directories, evidence is files — solved by walking around, reading clues, and using grep.",
      "Commands unlock progressively as you investigate; grep -r is the core mechanic for correlating evidence across rooms.",
      "Vertical slice: one murder, four suspects, five rooms, solvable in one sitting.",
    ],
    links: [{ label: "GitHub", href: "https://github.com/mayaanhafeez/TerminalMystery" }],
    type: "personal", wip: true,
  },
  {
    title: "macwifi — Wi-Fi TUI for macOS",
    subtitle: "Clean-room macOS port of impala (Linux/iwd)",
    tech: ["Rust", "ratatui", "tokio", "CoreWLAN", "objc2", "Security.framework"],
    bullets: [
      "Terminal UI for managing Wi-Fi on macOS — live scan/associate (open, WPA-PSK, WPA-Enterprise PEAP, hidden networks), saved-network management, QR sharing, and an adapter info popup.",
      "Split daemon/client architecture over a Unix socket: a LaunchAgent-managed daemon owns the CoreWLAN interface in a proper Aqua session so scans return real SSIDs instead of redacted strings.",
      "Silent reconnect via macwifi's own login-keychain cache: passwords entered on first connect are stored under the app's stable code-signing identity, so reconnects are promptless. QR-share reads from the System keychain (one admin-auth dialog per share — unavoidable for any third-party app). Ships a self-contained, code-signed .app bundle with Location entitlements.",
    ],
    links: [{ label: "GitHub", href: "https://github.com/mayaanhafeez/macwifi" }],
    type: "personal",
  },
  {
    title: "ssht — Persistent SSH Sessions",
    subtitle: "Every SSH connection becomes a resumable tmux session",
    tech: ["Rust", "ratatui", "tokio", "rusqlite", "nucleo", "tmux"],
    bullets: [
      "Wraps the system ssh binary (not a reimplementation) and runs tmux new-session -A on the remote, so connections survive sleep/network drops and reattach from any machine — ProxyJump, IdentityFile, and hardware keys all keep working.",
      "From-scratch SSH config parser handles Include globbing/recursion, Match blocks, and wildcard Host entries that naive line-scanners miss; falls back to known_hosts.",
      "ratatui + nucleo fuzzy picker stays instant on long host lists; tokio fires live tmux-session probes concurrently in the background so opening never blocks on a slow host. SQLite stores last-connected times, counts, and notes.",
    ],
    links: [
      { label: "crates.io", href: "https://crates.io/crates/ssht" },
      { label: "GitHub", href: "https://github.com/mayaanhafeez/ssht" },
    ],
    type: "personal",
  },
  {
    title: "ayaanhafeez.dev — Portfolio",
    subtitle: "This site — Neovim-themed portfolio with an agentic AI assistant",
    tech: ["Next.js", "React", "JavaScript", "Groq API", "Upstash Redis", "CSS"],
    bullets: [
      "Single-page app styled as a Neovim editor: sidebar file tree, tabline, statusline, Telescope fuzzy finder (Ctrl+P), and full vim keybindings (j/k scroll, gg/G jump, : command mode).",
      "Agentic AI assistant (llama-3.3-70b via Groq) with tool calls for navigating sections, switching themes, and opening links — responds to natural language like 'go to projects' or 'switch to gruvbox'. Streaming SSE responses.",
      "11 color themes (Tokyo Night, Catppuccin, Rosé Pine, Gruvbox, Nord, Dracula, One Dark, Solarized, Everforest, Monokai, Tomorrow Night Burns) persisted to localStorage; per-project 'Ask AI' buttons open a pre-prompted chat about that project.",
    ],
    links: [
      { label: "Live", href: "https://ayaanhafeez.dev" },
      { label: "GitHub", href: "https://github.com/mayaanhafeez/portfolio" },
    ],
    type: "personal",
  },
  {
    title: "The Rubber Duck Blog",
    subtitle: "Neovim-styled developer blog",
    tech: ["Astro", "TypeScript", "MDX", "Vercel"],
    bullets: [
      "Documents my dev experiences — issues I faced while coding and how I overcame them.",
      "Named after rubber duck debugging — because half my bugs get solved the moment I start writing about them.",
    ],
    links: [
      { label: "Live", href: "https://the-rubber-duck-blog.vercel.app/" },
      { label: "GitHub", href: "https://github.com/mayaanhafeez/blog_post" },
    ],
    type: "personal",
  },
  {
    title: "EMG Controller",
    subtitle: "Real-time muscle-to-keystroke input device",
    tech: ["Arduino", "Python", "BioAmp EXG Pills", "scipy", "NumPy", "asyncio"],
    bullets: [
      "Reads 5 EMG channels concurrently via asyncio; band-pass filtering, envelope detection, and peak analysis isolate muscle contractions from noise.",
      "Maps left/right fist-clench gestures to directional keyboard inputs with <50 ms end-to-end latency and 40% fewer false activations via tuned peak thresholds and startup-spike suppression.",
    ],
    links: [{ label: "GitHub", href: "https://github.com/mayaanhafeez/PlayMG" }],
    type: "personal",
  },
  {
    title: "Social Media Platform",
    subtitle: "Full-stack social media application — REST API + React frontend",
    tech: ["Python", "FastAPI", "React", "TypeScript", "PostgreSQL", "Redis", "Docker", "Stripe", "JWT", "Tailwind CSS"],
    bullets: [
      "Production REST API with RBAC, JWT auth, and Argon2 hashing; containerized with Docker Compose (FastAPI + PostgreSQL + Redis).",
      "Stripe subscription management with webhook-driven payment sync.",
      "Pluggable ML identity verification: OCR, face matching, liveness, tamper detection.",
      "React + TypeScript SPA with React Router and context-based auth; served behind nginx in Docker.",
    ],
    links: [],
    type: "professional", wip: true,
  },
  {
    title: "Workforce Mgmt — Android App",
    subtitle: "Native Android with real-time CV",
    tech: ["Kotlin", "Jetpack Compose", "CameraX", "ML Kit", "AWS Rekognition", "Room", "Hilt"],
    bullets: [
      "Kotlin + Jetpack Compose with MVVM architecture and Hilt DI.",
      "Real-time face detection via ML Kit with quality validation.",
      "AWS Rekognition for cloud face recognition with confidence thresholds.",
      "Room for offline-first persistence with coroutine reactive flows.",
    ],
    links: [],
    type: "professional",
  },
  {
    title: "Network Monitoring Chatbot",
    subtitle: "NL2SQL chatbot for ISP network performance analytics",
    tech: ["Python", "FastAPI", "LangChain", "Ollama", "ChromaDB", "PostgreSQL"],
    bullets: [
      "Intent classifier routes queries to NL2SQL, RAG, or general-knowledge paths; session-aware context management across multi-turn conversations.",
      "SQL agent generates queries against a network KPI database (QoE, download, ping, DNS, PLT) with bot/region name resolution and 85% answer accuracy.",
      "Produces downloadable CSV and matplotlib graph artifacts alongside natural-language answers.",
    ],
    links: [],
    type: "professional",
  },
  {
    title: "API Documentation Scraper",
    subtitle: "Crawl-to-OpenAPI pipeline for docs sites, GitHub repos, and PDFs",
    tech: ["Python", "Selenium", "OpenAI", "BeautifulSoup", "OpenAPI"],
    bullets: [
      "4-stage pipeline: Selenium-powered crawl → content cleaning → LLM endpoint extraction → structured JSON output.",
      "Handles docs sites, GitHub repos, and PDFs; LLM extraction converts unstructured text into typed endpoint schemas.",
      "Validation layer merges multi-source results and compares against reference OpenAPI specs — extracted 100+ endpoints, cutting developer hours by 90%.",
    ],
    links: [],
    type: "professional", wip: true,
  },
  {
    title: "ASCII — Image Converter",
    subtitle: "Web app + CLI for converting images to ASCII art",
    tech: ["Python", "HTML/CSS/JS", "Vercel", "Pillow"],
    bullets: [
      "Drag-and-drop web UI with live preview, adjustable ramp, width/height, contrast, gamma, dither, and invert controls.",
      "Serverless Python API (Vercel Functions) accepting base64 images and returning ASCII output with CORS support.",
      "CLI tool with configurable ramps (detailed, blocks, classic), chat-mode code-fence output, and gamma/contrast pipeline.",
    ],
    links: [
      { label: "Live Demo", href: "https://ascii.ayaanhafeez.dev" },
      { label: "GitHub", href: "https://github.com/mayaanhafeez/ASCII" },
    ],
    type: "personal",
  },
  {
    title: "surgraft",
    subtitle: "Token-efficient code grafting — AST-locate, byte-copy, LLM-edit",
    tech: ["Python", "Claude API", "AST"],
    bullets: [
      "AST parsing locates exact function boundaries (zero tokens); shell-level byte copy moves code without involving the LLM.",
      "Optional LLM edit pass sees only the extracted snippet — ~98% token reduction vs. naive rewrite on a 5,000-line file.",
      "CLI + library API; supports Python (exact via ast module) and JS/TS/JSX/TSX (regex heuristic).",
    ],
    links: [
      { label: "PyPI", href: "https://pypi.org/project/surgraft/" },
      { label: "GitHub", href: "https://github.com/mayaanhafeez/surgraft" },
    ],
    type: "personal",
  },
  {
    title: "lualings",
    subtitle: "Hands-on Lua learning via broken programs — rustlings for Lua",
    tech: ["Lua"],
    bullets: [
      "32 fix-the-broken-program exercises spanning 13 topics: variables, tables, closures, metatables, OOP, coroutines, and more.",
      "CLI runner with watch mode, per-exercise hints, and a verify command that grades all exercises at once.",
      "Inspired by rustlings and ziglings; built to gain enough Lua fluency to write Terminal Mystery.",
    ],
    links: [{ label: "GitHub", href: "https://github.com/mayaanhafeez/lualings" }],
    type: "personal",
  },
  {
    title: "keyboard_cleaner",
    subtitle: "Menu-bar app that freezes your Mac's keyboard so you can wipe it down",
    tech: ["Swift", "AppKit", "Cocoa", "CoreGraphics", "CGEventTap", "Bash"],
    bullets: [
      "Lives in the menu bar as an .accessory NSApplication (no Dock icon, no window): an NSStatusItem hosts a −/+ duration stepper and Start/End toggle, with a live countdown shown both in the popup and the menu-bar icon. The stepper row sits in an NSVisualEffectView so its glass matches the system menu material.",
      "Installs a CGEventTap at the session level that returns nil for every key-down/up, modifier change, and NX_SYSDEFINED media event — keyboard goes dead without locking the screen while the mouse and trackpad keep working.",
      "Emergency unlock: Esc held for 3 continuous seconds re-enables the keyboard; a RunLoop timer ticks 10×/second to redraw the countdown, enforce auto-unlock, and re-enable the tap if macOS ever disables it. Retains a terminal (--cli) mode. Single Swift file, zero dependencies.",
    ],
    links: [{ label: "GitHub", href: "https://github.com/mayaanhafeez/keyboard_cleaner" }],
    type: "personal",
  },
  {
    title: "FocusNode — Browser Extension",
    subtitle: "Blocks distracting sites during focus — Chrome, Firefox, and Zen",
    tech: ["React", "Vite", "WebExtensions API", "JavaScript"],
    bullets: [
      "Cross-browser extension (Chrome, Firefox, Zen) that blocks user-defined domains in real time, covers subdomains, and redirects tabs back when focus mode is turned off.",
      "Persistent settings and block list via the storage API across browser restarts.",
    ],
    links: [
      { label: "Chrome Web Store", href: "https://chromewebstore.google.com/detail/focus-mode-blocker/bhkiedimpjpeoggbodjedjcopedhdaoo" },
      { label: "Firefox Add-ons", href: "https://addons.mozilla.org/en-US/firefox/addon/focusnode-website-blocker/" },
      { label: "GitHub", href: "https://github.com/mayaanhafeez/FocusNode" },
    ],
    type: "personal",
  },
  {
    title: "Tuesday.com — Hackathon App",
    subtitle: "Built at HackED 2025",
    tech: ["Node.js", "Express", "MongoDB", "JavaScript"],
    bullets: [
      "Team app with AI-driven task automation concept.",
      "End-to-end demo shipped in 48 hours.",
    ],
    links: [{ label: "GitHub", href: "https://github.com/mayaanhafeez/tuesday.com" }],
    type: "personal",
  },
];

const EXPERIENCE = [
  {
    role: "AI Developer",
    org: "Elev8AI",
    time: "May 2025 – Present",
    bullets: [
      "NL2SQL network-monitoring chatbot (LangChain, Ollama, ChromaDB, PostgreSQL) with intent classification, RAG retrieval, session-aware context management, and CSV/graph artifact generation; 85% answer accuracy.",
      "Multi-turn LangChain SQL agents and prompt pipelines for an AI trip-planning platform using GPT-4, enabling structured itinerary generation across database-backed and general-knowledge destinations.",
      "Full-stack social media platform: FastAPI backend with RBAC, JWT auth, Stripe payments, and AWS Textract/Rekognition ML identity verification; React + TypeScript frontend served via nginx in Docker.",
      "API documentation scraper (Selenium + OpenAI) crawling docs sites, GitHub repos, and PDFs into typed OpenAPI schemas — extracted 100+ endpoints, cutting developer hours by 90%.",
      "Android face-recognition attendance system in Kotlin + Jetpack Compose with CameraX and Google ML Kit — real-time face detection, head-pose estimation, and frame-level deduplication.",
    ],
  },
];

const SKILLS = {
  Languages: ["Python", "Kotlin", "Java", "C/C++", "Rust", "Swift", "JavaScript", "TypeScript", "Lua", "SQL", "Bash", "ARM/MIPS", "VHDL"],
  Frameworks: ["FastAPI", "Next.js", "Node.js", "React", "Jetpack Compose", "Vite", "Express", "Flask", "LangChain", "ratatui", "tokio", "AppKit / Cocoa", "SQLAlchemy", "scikit-learn", "NumPy", "pandas", "scipy", "Tailwind CSS"],
  Tools: ["Git", "Docker", "PostgreSQL", "Redis", "MongoDB", "ChromaDB", "Selenium", "Ollama", "Groq API", "OpenAI API", "Anthropic API", "AWS", "Stripe", "VS Code", "Android Studio"],
  "ML / Vision": ["ML Kit", "CameraX", "AWS Rekognition", "docTR", "InsightFace", "OpenCV"],
  Hardware: ["FPGA (Zybo)", "Arduino", "ARM Cortex-M4", "Raspberry Pi", "Analog Discovery", "BioAMP EXG"],
};

const LINKS = {
  github: "https://github.com/mayaanhafeez",
  linkedin: "https://linkedin.com/in/ayaanhafeez",
  email: "mhafeez1@ualberta.ca",
  resume: "/resume.pdf",
  blog: "https://the-rubber-duck-blog.vercel.app/",
};

function serializeProjects() {
  return PROJECTS.map((p) => {
    const linkStr = p.links.length
      ? p.links.map((l) => `${l.label}: ${l.href}`).join(", ")
      : p.type === "professional" ? "NDA — no public link" : "no links";
    return `- ${p.title}${p.wip ? " [WIP]" : ""} (${p.type}): ${p.subtitle}. Tech: ${p.tech.join(", ")}. Links: ${linkStr}`;
  }).join("\n");
}

function serializeSkills() {
  return Object.entries(SKILLS)
    .map(([cat, items]) => `  ${cat}: ${items.join(", ")}`)
    .join("\n");
}

export function buildSystemPrompt() {
  return `You are an AI assistant embedded in Ayaan Hafeez's portfolio website. The site is styled as a Neovim editor.

SCOPE: Only answer questions about Ayaan, his projects, skills, experience, and how to use this portfolio interface. If asked anything unrelated, politely decline in one sentence.

RESPONSE STYLE: Be concise and direct. Max 300 words. No markdown headers or bullet lists — use plain prose or short comma-separated lists. Terminal-friendly tone.

TOOLS: Call tools only when the user explicitly requests an action:
- navigate_section: when the user asks to go to, navigate to, or open a section. Do not call it when merely answering a question that mentions a section.
- set_theme: only when the user asks to change / switch / set the theme
- open_link: only when the user explicitly asks to open, visit, or go to a URL or external page — NEVER call open_link just because a URL appears in the data you are referencing
- get_github_activity: call it immediately (do not ask for confirmation first) when the user asks what Ayaan has been working on/up to recently, or about his recent commits/GitHub activity. Public activity only. Once it returns, summarize the actual repos and commit messages it found, by name — never deflect the user to go check GitHub themselves, that defeats the point of calling the tool.

---

PORTFOLIO INTERFACE
- Sections: ${SECTIONS.join(", ")}
- Commands: :open <section>, :theme <name>, :github, :linkedin, :email, :resume, :blog, :help, Ctrl+P (fuzzy finder), Ctrl+T (cycle theme)
- Themes (${THEMES.length} available): ${THEMES.join(", ")}

---

ABOUT AYAAN
3rd-year Computer Engineering student at University of Alberta. AI Developer at Elev8AI (May 2025 – present). Interests: systems programming, AI/ML, TUI tools, embedded systems.

Contact: ${LINKS.email} | GitHub: ${LINKS.github} | LinkedIn: ${LINKS.linkedin} | Resume: ${LINKS.resume} | Blog: ${LINKS.blog}

---

EXPERIENCE
${EXPERIENCE.map((e) => `${e.role} @ ${e.org} (${e.time}): ${e.bullets[0]}`).join("\n")}

---

SKILLS
${serializeSkills()}

---

PROJECTS (${PROJECTS.length} total)
${serializeProjects()}`;
}
