"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import AIChat from "./components/AIChat";

/* ════════════════════════════════════════
   DATA
   ════════════════════════════════════════ */

const LINKS = {
  email: "mhafeez1@ualberta.ca",
  personalEmail: "m.ayaan.hafeez@gmail.com",
  github: "https://github.com/mayaanhafeez",
  linkedin: "https://linkedin.com/in/ayaanhafeez",
  resume: "/resume.pdf",
  blog: "https://the-rubber-duck-blog.vercel.app/",
};

const THEMES = [
  { id: "tokyo-night", label: "Tokyo Night" },
  { id: "catppuccin",  label: "Catppuccin"  },
  { id: "rose-pine",   label: "Rosé Pine"   },
  { id: "gruvbox",     label: "Gruvbox"     },
  { id: "nord",        label: "Nord"        },
  { id: "dracula",     label: "Dracula"     },
  { id: "one-dark",    label: "One Dark"    },
  { id: "solarized",   label: "Solarized"   },
  { id: "everforest",  label: "Everforest"  },
  { id: "monokai",              label: "Monokai"              },
  { id: "tomorrow-night-burns", label: "Tomorrow Night Burns"  },
  { id: "andromeda",            label: "Andromeda"             },
  { id: "hinterlands",          label: "Hinterlands"           },
  { id: "vanta-black",          label: "Vanta Black"           },
];

// visual language layered on top of THEMES — a theme picks the palette,
// a style picks how glass/blur/radius/motion is built from it (see the
// STYLES token blocks in globals.css)
const STYLES = [
  { id: "rice",    label: "Omarchy Rice" },
  { id: "neon",    label: "Neon Glass" },
  { id: "acrylic", label: "Frosted Acrylic" },
  { id: "legacy",  label: "Legacy" },
];

const SECTIONS = [
  { id: "about", label: "about.md", icon: "📄", desc: "About me" },
  { id: "projects", label: "projects.md", icon: "📂", desc: "Featured projects" },
  { id: "experience", label: "experience.md", icon: "💼", desc: "Work experience" },
  { id: "skills", label: "skills.md", icon: "⚡", desc: "Technical skills" },
  { id: "contact", label: "contact.sh", icon: "📨", desc: "Get in touch" },
];

// Dashboard (welcome view) actions — display data only; dispatch lives in runWelcomeAction
const WELCOME_ACTIONS = [
  { key: ":ai", label: "Ask the AI assistant", className: "welcomeActionAI" },
  { key: "Enter", label: "Open portfolio" },
  { key: "Ctrl+P", label: "Find anything" },
  { key: ":help", label: "Show all commands" },
  { key: ":github", label: "GitHub profile" },
  { key: ":linkedin", label: "LinkedIn profile" },
  { key: ":resume", label: "Download resume" },
  { key: ":blog", label: "Read my blog" },
];

const PROJECTS = [
  {
    title: "Bare Metal Raspberry Pi OS",
    subtitle: "OS kernel from scratch in C and ARM Assembly",
    type: "personal",
    tech: ["C", "ARM Assembly", "Raspberry Pi"],
    bullets: [
      "Built a bare-metal OS kernel across 6 subsystems: bootloader, UART/GPIO drivers, interrupt controller, preemptive scheduler, system calls, and MMU-backed virtual memory — zero external dependencies.",
      "Implemented preemptive process scheduler and fork-based process isolation using ARM exception levels and per-process page tables, supporting concurrent execution across all 4 CPU cores.",
    ],
    links: [{ label: "GitHub", href: "https://github.com/mayaanhafeez/raspberry-pi-os" }],
  },
  {
    title: "Terminal Mystery",
    subtitle: "Murder-mystery game played through a fake terminal",
    type: "personal",
    wip: true,
    tech: ["Lua", "LÖVE"],
    bullets: [
      "The venue is a virtual filesystem — rooms are directories, evidence is files — solved by walking around, reading clues, and using grep.",
      "Commands unlock progressively as you investigate; grep -r is the core mechanic for correlating evidence across rooms.",
      "Set at an AI startup's Series C launch party: the founder is dead, four suspects, solvable in one sitting.",
    ],
    links: [
      { label: "GitHub", href: "https://github.com/mayaanhafeez/TerminalMystery" },
    ],
  },
  {
    title: "macwifi — Wi-Fi TUI for macOS",
    subtitle: "Clean-room macOS port of impala (Linux/iwd)",
    type: "personal",
    tech: ["Rust", "ratatui", "tokio", "CoreWLAN", "objc2", "Security.framework"],
    bullets: [
      "Terminal UI for managing Wi-Fi on macOS — live scan/associate (open, WPA-PSK, WPA-Enterprise PEAP, hidden networks), saved-network management, QR sharing, and an adapter info popup.",
      "Split daemon/client architecture over a Unix socket: a LaunchAgent-managed daemon owns the CoreWLAN interface in a proper Aqua session so scans return real SSIDs instead of redacted strings.",
      "Silent reconnect via macwifi's own login-keychain cache: passwords entered on first connect are stored under the app's stable code-signing identity, so reconnects are promptless. QR-share reads from the System keychain (one admin-auth dialog per share — unavoidable for any third-party app). Ships a self-contained, code-signed .app bundle with Location entitlements.",
    ],
    links: [{ label: "GitHub", href: "https://github.com/mayaanhafeez/macwifi" }],
  },
  {
    title: "ssht — Persistent SSH Sessions",
    subtitle: "Every SSH connection becomes a resumable tmux session",
    type: "personal",
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
  },
  {
    title: "ayaanhafeez.dev — Portfolio",
    subtitle: "This site — Neovim-themed portfolio with an agentic AI assistant",
    type: "personal",
    tech: ["Next.js", "React", "JavaScript", "Groq API", "Upstash Redis", "CSS"],
    bullets: [
      "Single-page app styled as a Neovim editor: sidebar file tree, tabline, statusline, Telescope fuzzy finder (Ctrl+P), and full vim keybindings (j/k scroll, gg/G jump, : command mode).",
      "Agentic AI assistant (llama-3.3-70b via Groq) with tool calls for navigating sections, switching themes, and opening links — responds to natural language like 'go to projects' or 'switch to gruvbox'. Streaming SSE responses.",
      "14 color themes (Tokyo Night, Catppuccin, Rosé Pine, Gruvbox, Nord, Dracula, One Dark, Solarized, Everforest, Monokai, Tomorrow Night Burns, Andromeda, Hinterlands, Vanta Black) × 4 visual styles (Omarchy Rice, Neon Glass, Frosted Acrylic, Legacy), all persisted to localStorage; per-project 'Ask AI' buttons open a pre-prompted chat about that project.",
    ],
    links: [
      { label: "Live", href: "https://ayaanhafeez.dev" },
      { label: "GitHub", href: "https://github.com/mayaanhafeez/portfolio" },
    ],
  },
  {
    title: "The Rubber Duck Blog",
    subtitle: "Neovim-styled developer blog",
    type: "personal",
    tech: ["Astro", "TypeScript", "MDX", "Vercel"],
    bullets: [
      "Documents my dev experiences — issues I faced while coding and how I overcame them.",
      "Named after rubber duck debugging — because half my bugs get solved the moment I start writing about them.",
    ],
    links: [
      { label: "Live", href: "https://the-rubber-duck-blog.vercel.app/" },
      { label: "GitHub", href: "https://github.com/mayaanhafeez/blog_post" },
    ],
  },
  {
    title: "EMG Controller",
    subtitle: "Real-time muscle-to-keystroke input device",
    type: "personal",
    tech: ["Arduino", "Python", "BioAmp EXG Pills", "scipy", "NumPy", "asyncio"],
    bullets: [
      "Reads 5 EMG channels concurrently via asyncio; band-pass filtering, envelope detection, and peak analysis isolate muscle contractions from noise.",
      "Maps left/right fist-clench gestures to directional keyboard inputs with <50 ms end-to-end latency and 40% fewer false activations via tuned peak thresholds and startup-spike suppression.",
    ],
    links: [{ label: "GitHub", href: "https://github.com/mayaanhafeez/PlayMG" }],
  },
  {
    title: "Social Media Platform",
    subtitle: "Full-stack social media application — REST API + React frontend",
    type: "professional",
    wip: true,
    tech: ["Python", "FastAPI", "React", "TypeScript", "PostgreSQL", "Redis", "Docker", "Stripe", "JWT", "Tailwind CSS"],
    bullets: [
      "Production REST API with RBAC, JWT auth, and Argon2 hashing; containerized with Docker Compose (FastAPI + PostgreSQL + Redis).",
      "Stripe subscription management with webhook-driven payment sync.",
      "Pluggable ML identity verification: OCR, face matching, liveness, tamper detection.",
      "React + TypeScript SPA with React Router and context-based auth; served behind nginx in Docker.",
    ],
    nda: true,
    links: [],
  },
  {
    title: "Workforce Mgmt — Android App",
    subtitle: "Native Android with real-time CV",
    type: "professional",
    tech: ["Kotlin", "Jetpack Compose", "CameraX", "ML Kit", "AWS Rekognition", "Room", "Hilt"],
    bullets: [
      "Kotlin + Jetpack Compose with MVVM architecture and Hilt DI.",
      "Real-time face detection via ML Kit with quality validation.",
      "AWS Rekognition for cloud face recognition with confidence thresholds.",
      "Room for offline-first persistence with coroutine reactive flows.",
    ],
    nda: true,
    links: [],
  },
  {
    title: "Network Monitoring Chatbot",
    subtitle: "NL2SQL chatbot for ISP network performance analytics",
    type: "professional",
    tech: ["Python", "FastAPI", "LangChain", "Ollama", "ChromaDB", "PostgreSQL"],
    bullets: [
      "Intent classifier routes queries to NL2SQL, RAG, or general-knowledge paths; session-aware context management across multi-turn conversations.",
      "SQL agent generates queries against a network KPI database (QoE, download, ping, DNS, PLT) with bot/region name resolution and 85% answer accuracy.",
      "Produces downloadable CSV and matplotlib graph artifacts alongside natural-language answers.",
    ],
    nda: true,
    links: [],
  },
  {
    title: "API Documentation Scraper",
    subtitle: "Crawl-to-OpenAPI pipeline for docs sites, GitHub repos, and PDFs",
    type: "professional",
    wip: true,
    tech: ["Python", "Selenium", "OpenAI", "BeautifulSoup", "OpenAPI"],
    bullets: [
      "4-stage pipeline: Selenium-powered crawl → content cleaning → LLM endpoint extraction → structured JSON output.",
      "Handles docs sites, GitHub repos, and PDFs; LLM extraction converts unstructured text into typed endpoint schemas.",
      "Validation layer merges multi-source results and compares against reference OpenAPI specs — extracted 100+ endpoints, cutting developer hours by 90%.",
    ],
    nda: true,
    links: [],
  },
  {
    title: "ASCII — Image Converter",
    subtitle: "Web app + CLI for converting images to ASCII art",
    type: "personal",
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
  },
  {
    title: "surgraft",
    subtitle: "Token-efficient code grafting — AST-locate, byte-copy, LLM-edit",
    type: "personal",
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
  },
  {
    title: "lualings",
    subtitle: "Hands-on Lua learning via broken programs — rustlings for Lua",
    type: "personal",
    tech: ["Lua"],
    bullets: [
      "32 fix-the-broken-program exercises spanning 13 topics: variables, tables, closures, metatables, OOP, coroutines, and more.",
      "CLI runner with watch mode, per-exercise hints, and a verify command that grades all exercises at once.",
      "Inspired by rustlings and ziglings; built to gain enough Lua fluency to write Terminal Mystery.",
    ],
    links: [{ label: "GitHub", href: "https://github.com/mayaanhafeez/lualings" }],
  },
  {
    title: "keyboard_cleaner",
    subtitle: "Menu-bar app that freezes your Mac's keyboard so you can wipe it down",
    type: "personal",
    tech: ["Swift", "AppKit", "Cocoa", "CoreGraphics", "CGEventTap", "Bash"],
    bullets: [
      "Lives in the menu bar as an .accessory NSApplication (no Dock icon, no window): an NSStatusItem hosts a −/+ duration stepper and Start/End toggle, with a live countdown shown both in the popup and the menu-bar icon. The stepper row sits in an NSVisualEffectView so its glass matches the system menu material.",
      "Installs a CGEventTap at the session level that returns nil for every key-down/up, modifier change, and NX_SYSDEFINED media event — keyboard goes dead without locking the screen while the mouse and trackpad keep working.",
      "Emergency unlock: Esc held for 3 continuous seconds re-enables the keyboard; a RunLoop timer ticks 10×/second to redraw the countdown, enforce auto-unlock, and re-enable the tap if macOS ever disables it. Retains a terminal (--cli) mode. Single Swift file, zero dependencies.",
    ],
    links: [{ label: "GitHub", href: "https://github.com/mayaanhafeez/keyboard_cleaner" }],
  },
  {
    title: "FocusNode — Browser Extension",
    subtitle: "Blocks distracting sites during focus — Chrome, Firefox, and Zen",
    type: "personal",
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
  },
  {
    title: "Tuesday.com — Hackathon App",
    subtitle: "Built at HackED 2025",
    type: "personal",
    tech: ["Node.js", "Express", "MongoDB", "JavaScript"],
    bullets: [
      "Team app with AI-driven task automation concept.",
      "End-to-end demo shipped in 48 hours.",
    ],
    links: [{ label: "GitHub", href: "https://github.com/mayaanhafeez/tuesday.com" }],
  },
];

const EXPERIENCE = [
  {
    role: "AI Developer",
    org: "Elev8AI",
    time: "May 2025 – Present",
    location: "Remote",
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


/* all items searchable via telescope */
const TELESCOPE_ITEMS = [
  ...SECTIONS.map((s) => ({ type: "section", id: s.id, icon: s.icon, label: s.label, desc: s.desc })),
  { type: "link", id: "github", icon: "🔗", label: "github", desc: "Open GitHub profile", href: LINKS.github },
  { type: "link", id: "linkedin", icon: "🔗", label: "linkedin", desc: "Open LinkedIn profile", href: LINKS.linkedin },
  { type: "link", id: "email", icon: "✉️", label: "email", desc: `Mail ${LINKS.email}`, href: `mailto:${LINKS.email}` },
  { type: "link", id: "resume", icon: "📎", label: "resume.pdf", desc: "Download resume", href: LINKS.resume },
  { type: "link", id: "blog", icon: "📝", label: "blog", desc: "Open The Rubber Duck Blog", href: LINKS.blog },
  { type: "action", id: "help", icon: "❓", label: ":help", desc: "Show all commands" },
];

/* ════════════════════════════════════════
   COMMANDS
   ════════════════════════════════════════ */

const HELP_DATA = [
  {
    title: "Navigation",
    cmds: [
      { cmd: ":open <section>", desc: "Navigate to a section (about, projects, experience, skills, contact)" },
      { cmd: ":e <section>", desc: "Same as :open" },
      { cmd: ":ls", desc: "List all open buffers" },
      { cmd: "gg", desc: "Scroll to top" },
      { cmd: "G", desc: "Scroll to bottom" },
      { cmd: "h j k l", desc: "Move card selection left/down/up/right" },
      { cmd: "Enter", desc: "Open the selected card's link" },
    ],
  },
  {
    title: "Popups",
    cmds: [
      { cmd: "Ctrl+P", desc: "Open Telescope fuzzy finder" },
      { cmd: ":help", desc: "Show this help popup" },
      { cmd: ":ai  or  :chat", desc: "Open AI assistant — ask about projects, navigate, change theme/style" },
      { cmd: "Esc", desc: "Close any popup / exit command mode" },
    ],
  },
  {
    title: "Links",
    cmds: [
      { cmd: ":github", desc: "Open GitHub profile" },
      { cmd: ":linkedin", desc: "Open LinkedIn profile" },
      { cmd: ":email", desc: "Compose email" },
      { cmd: ":resume", desc: "Open resume PDF" },
      { cmd: ":blog", desc: "Open The Rubber Duck Blog" },
    ],
  },
  {
    title: "Display",
    cmds: [
      { cmd: ":theme <name>", desc: "Switch color scheme (tokyo-night, catppuccin, rose-pine, gruvbox, nord, dracula, one-dark, solarized, everforest, monokai, tomorrow-night-burns, andromeda, hinterlands, vanta-black)" },
      { cmd: ":theme", desc: "Cycle to next theme" },
      { cmd: "Ctrl+T", desc: "Cycle theme" },
      { cmd: ":style <name>", desc: "Switch visual style (rice, neon, acrylic, legacy)" },
      { cmd: ":style", desc: "Cycle to next style" },
      { cmd: "Ctrl+S", desc: "Cycle style" },
    ],
  },
  {
    title: "Fun",
    cmds: [
      { cmd: ":q / :quit / :wq", desc: "Try to quit (good luck)" },
      { cmd: ":whoami", desc: "Print user info" },
      { cmd: ":date", desc: "Print current date" },
    ],
  },
];

/* ════════════════════════════════════════
   COMPONENTS
   ════════════════════════════════════════ */

function Pill({ children }) {
  return <span className="pill">{children}</span>;
}

function ProjectCard({ p, onAskAI }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="projectCard" data-nav data-card-id={`project-${p.title}`}>
      <div className="projectTop">
        <h3 className="projectTitle">{p.title}</h3>
        {p.type && (
          <span className={`typeBadge ${p.type}`}>
            {p.type === "professional" ? "pro" : "personal"}
          </span>
        )}
      </div>
      <p className="projectSub">{p.subtitle}</p>
      <div className="pillRow">
        {p.tech.map((t) => <Pill key={t}>{t}</Pill>)}
      </div>
      <button
        className="foldToggle"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
      >
        {expanded ? "▾ show less" : "▸ show more"}
      </button>
      {expanded && (
        <ul className="projectList">
          {p.bullets.map((b, i) => <li key={i}>{b}</li>)}
        </ul>
      )}
      {p.wip && <div className="wipNotice">◌ work in progress</div>}
      {p.nda && <div className="ndaNotice">⚠ source under NDA</div>}
      <div className="linkRow">
        {p.links && p.links.map((l) => (
          <a key={l.href} className="linkBtn" href={l.href} target="_blank" rel="noreferrer">
            {l.label} →
          </a>
        ))}
        <button className="askAiBtn" onClick={() => onAskAI(p)}>
          ⬡ ask AI
        </button>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   MAIN PAGE
   ════════════════════════════════════════ */

export default function Page() {
  const [view, setView] = useState("welcome"); // "welcome" | "editor"
  const [welcomeIdx, setWelcomeIdx] = useState(-1); // selected dashboard action (-1 = none)
  const [active, setActive] = useState("about");
  const [mode, setMode] = useState("normal"); // "normal" | "command"
  const [cmdText, setCmdText] = useState("");
  const [cmdMsg, setCmdMsg] = useState(null); // { text, type: "success"|"error"|"info" }
  const [showTelescope, setShowTelescope] = useState(false);
  const [teleQuery, setTeleQuery] = useState("");
  const [teleIdx, setTeleIdx] = useState(0);
  const [showHelp, setShowHelp] = useState(false);
  const [cmdHistory, setCmdHistory] = useState([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [theme, setTheme] = useState("tokyo-night");
  const [style, setStyle] = useState("rice");
  const [showAI, setShowAI] = useState(false);
  const [aiInitialPrompt, setAiInitialPrompt] = useState(null);
  const [aiMessages, setAiMessages] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);

  const editorRef = useRef(null);
  const asciiRef = useRef(null);
  const sectionRefs = useRef({});
  const cmdInputRef = useRef(null);
  const teleInputRef = useRef(null);
  const aiInputRef = useRef(null);
  const navSelRef = useRef(null); // currently vim-selected DOM element
  const navInsideRef = useRef(null); // card we've "entered" (two-level nav)
  const focusRingRef = useRef(null); // the gliding selection outline
  const editorContentRef = useRef(null); // ring's positioning context

  /* ── helpers ── */

  const scrollTo = useCallback((id) => {
    const el = sectionRefs.current[id];
    if (el && editorRef.current) {
      editorRef.current.scrollTo({ top: el.offsetTop - 12, behavior: "smooth" });
      setActive(id);
    }
  }, []);

  const openLink = useCallback((href) => {
    window.open(href, "_blank", "noopener");
  }, []);

  const openAIForProject = useCallback((project) => {
    setAiMessages([]);
    setAiInitialPrompt(`Explain the ${project.title} project`);
    setShowAI(true);
  }, []);

  const flashMsg = useCallback((text, type = "info") => {
    setCmdMsg({ text, type });
    setTimeout(() => setCmdMsg(null), 3000);
  }, []);

  const enterEditor = useCallback((sectionId) => {
    setView("editor");
    if (sectionId) {
      setTimeout(() => scrollTo(sectionId), 50);
    }
  }, [scrollTo]);

  const enterCommand = useCallback(() => {
    setMode("command");
    setCmdText("");
    setCmdMsg(null);
    setHistoryIdx(-1);
    setTimeout(() => cmdInputRef.current?.focus(), 0);
  }, []);

  const exitCommand = useCallback(() => {
    setMode("normal");
    setCmdText("");
  }, []);

  /* ── execute command ── */

  const execCmd = useCallback((raw) => {
    const input = raw.trim();
    if (!input) { exitCommand(); return; }

    setCmdHistory((h) => [input, ...h.slice(0, 50)]);
    exitCommand();

    const parts = input.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const arg = parts.slice(1).join(" ").toLowerCase();

    // open / edit
    if (cmd === "open" || cmd === "e" || cmd === "edit") {
      const sec = SECTIONS.find((s) => s.id === arg || s.label === arg || s.label.startsWith(arg));
      if (sec) {
        if (view !== "editor") enterEditor(sec.id);
        else scrollTo(sec.id);
        flashMsg(`-- opened ${sec.label} --`, "success");
      } else {
        flashMsg(`E484: Can't open file "${arg}"`, "error");
      }
      return;
    }

    // ls
    if (cmd === "ls" || cmd === "buffers") {
      const list = SECTIONS.map((s, i) => `  ${i + 1}: ${s.label}`).join("  |  ");
      flashMsg(list, "info");
      return;
    }

    // help
    if (cmd === "help" || cmd === "h") {
      setShowHelp(true);
      return;
    }

    // links
    if (cmd === "github" || cmd === "gh") { openLink(LINKS.github); flashMsg("Opening GitHub...", "success"); return; }
    if (cmd === "linkedin" || cmd === "li") { openLink(LINKS.linkedin); flashMsg("Opening LinkedIn...", "success"); return; }
    if (cmd === "email" || cmd === "mail") { openLink(`mailto:${LINKS.email}`); flashMsg("Opening email...", "success"); return; }
    if (cmd === "resume" || cmd === "cv") { openLink(LINKS.resume); flashMsg("Opening resume...", "success"); return; }
    if (cmd === "blog") { openLink(LINKS.blog); flashMsg("Opening blog...", "success"); return; }

    // quit easter egg
    if (cmd === "q" || cmd === "quit" || cmd === "q!" || cmd === "wq" || cmd === "wq!" || cmd === "x") {
      flashMsg("E162: Can't quit vim. This is your life now.", "error");
      return;
    }

    // whoami
    if (cmd === "whoami") {
      flashMsg("ayaan — 3rd-year CompE student, AI Developer @ Elev8AI", "info");
      return;
    }

    // date
    if (cmd === "date") {
      flashMsg(new Date().toString(), "info");
      return;
    }

    // find / telescope
    if (cmd === "find" || cmd === "telescope" || cmd === "ff") {
      setShowTelescope(true);
      return;
    }

    // ai chat
    if (cmd === "ai" || cmd === "chat") {
      setShowAI(true);
      return;
    }

    // home / welcome
    if (cmd === "home" || cmd === "welcome" || cmd === "dashboard") {
      setView("welcome");
      flashMsg("-- back to dashboard --", "info");
      return;
    }

    // clear
    if (cmd === "clear" || cmd === "cls") {
      setCmdMsg(null);
      return;
    }

    // theme
    if (cmd === "theme" || cmd === "colorscheme" || cmd === "cs") {
      if (!arg) {
        const idx = THEMES.findIndex((t) => t.id === theme);
        const next = THEMES[(idx + 1) % THEMES.length];
        setTheme(next.id);
        flashMsg(`-- theme: ${next.label} --`, "success");
      } else {
        const found = THEMES.find(
          (t) => t.id === arg || t.id.startsWith(arg) || t.label.toLowerCase() === arg
        );
        if (found) {
          setTheme(found.id);
          flashMsg(`-- theme: ${found.label} --`, "success");
        } else {
          flashMsg(`E: unknown theme "${arg}". available: ${THEMES.map((t) => t.id).join(", ")}`, "error");
        }
      }
      return;
    }

    // style
    if (cmd === "style") {
      if (!arg) {
        const idx = STYLES.findIndex((s) => s.id === style);
        const next = STYLES[(idx + 1) % STYLES.length];
        setStyle(next.id);
        flashMsg(`-- style: ${next.label} --`, "success");
      } else {
        const found = STYLES.find(
          (s) => s.id === arg || s.id.startsWith(arg) || s.label.toLowerCase() === arg
        );
        if (found) {
          setStyle(found.id);
          flashMsg(`-- style: ${found.label} --`, "success");
        } else {
          flashMsg(`E: unknown style "${arg}". available: ${STYLES.map((s) => s.id).join(", ")}`, "error");
        }
      }
      return;
    }

    flashMsg(`E492: Not an editor command: ${cmd}`, "error");
  }, [exitCommand, scrollTo, flashMsg, openLink, enterEditor, view, theme, style]);

  /* ── welcome banner: shrink the ASCII name to fit the viewport width ── */
  useEffect(() => {
    if (view !== "welcome") return;
    const fit = () => {
      const el = asciiRef.current;
      if (!el) return;
      el.style.fontSize = ""; // reset to the CSS cap before measuring
      const base = parseFloat(getComputedStyle(el).fontSize);
      const parent = el.parentElement;
      const cs = getComputedStyle(parent);
      const avail = parent.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      const natural = el.scrollWidth;
      if (natural > avail) el.style.fontSize = `${(base * avail) / natural}px`;
    };
    fit();
    window.addEventListener("resize", fit);
    if (document.fonts?.ready) document.fonts.ready.then(fit);
    return () => window.removeEventListener("resize", fit);
  }, [view]);

  /* ── theme: load from localStorage on mount ── */
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved && THEMES.some((t) => t.id === saved)) setTheme(saved);
  }, []);

  /* ── theme: sync to <html> and persist ── */
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  /* ── style: load from localStorage on mount ── */
  useEffect(() => {
    const saved = localStorage.getItem("style");
    if (saved && STYLES.some((s) => s.id === saved)) setStyle(saved);
  }, []);

  /* ── style: sync to <body> and persist ── */
  useEffect(() => {
    document.body.dataset.style = style;
    localStorage.setItem("style", style);
  }, [style]);

  /* ── track scroll ── */
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    const onScroll = () => {
      const ids = SECTIONS.map((s) => s.id);
      let current = ids[0];
      for (const id of ids) {
        const el = sectionRefs.current[id];
        if (el && el.offsetTop - 20 <= editor.scrollTop) current = id;
      }
      if (editor.scrollHeight - editor.scrollTop - editor.clientHeight <= 5) {
        current = ids[ids.length - 1];
      }
      setActive(current);
    };
    editor.addEventListener("scroll", onScroll, { passive: true });
    return () => editor.removeEventListener("scroll", onScroll);
  }, [view]);

  /* ── open the telescope finder ── */
  const openTelescope = useCallback(() => {
    setShowTelescope(true);
    setTeleQuery("");
    setTeleIdx(0);
    setTimeout(() => teleInputRef.current?.focus(), 0);
  }, []);

  /* ── vim spatial navigation with h/j/k/l (+ arrow keys) ──
     Two levels: at "card level" you move between whole cards (plus any loose
     links/buttons that aren't inside a card). Enter zooms *into* the selected
     card; then h/j/k/l move between that card's own links/buttons (github,
     show more, ask AI…). Escape zooms back out. Selection is tracked
     imperatively (navSelRef) via a class, so keyboard focus stays on <body>
     and command mode / other keys keep working. */
  const isNavable = (el) => el.getClientRects().length > 0 && !el.disabled;

  const collectNav = useCallback(() => {
    const inside = navInsideRef.current;
    if (inside) {
      // inside a card: only its own interactive children
      return Array.from(inside.querySelectorAll("a[href], button")).filter(isNavable);
    }
    // card level: every card, plus interactive elements not inside a card
    const cards = Array.from(document.querySelectorAll(".editorPane [data-nav]"));
    const loose = Array.from(
      document.querySelectorAll(".editorPane a[href], .editorPane button")
    ).filter((el) => !el.closest("[data-nav]"));
    return [...cards, ...loose].filter(isNavable);
  }, []);

  // move the gliding focus ring over `el` (or hide it when null)
  const positionRing = useCallback((el) => {
    const ring = focusRingRef.current;
    const content = editorContentRef.current;
    if (!ring || !content) return;
    if (!el) { ring.classList.remove("on"); return; }
    // offset relative to the (scrolling) content, so the ring scrolls with it
    const r = el.getBoundingClientRect();
    const c = content.getBoundingClientRect();
    const pad = el.matches("[data-nav]") ? 0 : 3; // hug buttons/links a little
    const x = r.left - c.left - pad;
    const y = r.top - c.top - pad;
    // when the ring is appearing fresh, jump into place (no fly-in from 0,0);
    // once visible, let CSS transition the move so it glides between targets
    const wasOn = ring.classList.contains("on");
    if (!wasOn) ring.style.transition = "none";
    ring.style.transform = `translate(${x}px, ${y}px)`;
    ring.style.width = `${r.width + pad * 2}px`;
    ring.style.height = `${r.height + pad * 2}px`;
    // match the card's rounded corners, tighter for buttons/links
    ring.style.borderRadius = el.matches("[data-nav]") ? "var(--radius-card)" : "8px";
    if (!wasOn) {
      void ring.offsetWidth; // reflow so the jump isn't animated
      ring.style.transition = ""; // restore CSS transition for later moves
    }
    ring.classList.add("on");
  }, []);

  const setNavSel = useCallback((el) => {
    navSelRef.current = el;
    if (el) el.scrollIntoView({ block: "nearest", behavior: "smooth" });
    positionRing(el);
  }, [positionRing]);

  const moveNav = useCallback((dir) => {
    const els = collectNav();
    if (!els.length) return;

    const curEl = navSelRef.current && els.includes(navSelRef.current) ? navSelRef.current : null;

    // nothing selected yet → grab the element nearest the top of the viewport
    if (!curEl) {
      let pick = els[0];
      let best = Infinity;
      for (const el of els) {
        const r = el.getBoundingClientRect();
        const d = r.top >= 0 ? r.top : Infinity;
        if (d < best) { best = d; pick = el; }
      }
      setNavSel(pick);
      return;
    }

    const cur = curEl.getBoundingClientRect();
    const cx = cur.left + cur.width / 2;
    const cy = cur.top + cur.height / 2;
    const horizontal = dir === "h" || dir === "l";

    // gap between two 1-D ranges — 0 when they overlap. Using edge-gap (not
    // center distance) means a wide target below/beside is reachable from any
    // element whose extent overlaps it, not just the one that's centred on it.
    const gap = (aMin, aMax, bMin, bMax) =>
      aMax < bMin ? bMin - aMax : bMax < aMin ? aMin - bMax : 0;

    let best = null;
    let bestScore = Infinity;
    for (const el of els) {
      if (el === curEl) continue;
      const r = el.getBoundingClientRect();
      const dx = r.left + r.width / 2 - cx;
      const dy = r.top + r.height / 2 - cy;
      if (dir === "l" && dx <= 5) continue;
      if (dir === "h" && dx >= -5) continue;
      if (dir === "j" && dy <= 5) continue;
      if (dir === "k" && dy >= -5) continue;
      const primary = horizontal ? Math.abs(dx) : Math.abs(dy);
      const cross = horizontal
        ? gap(cur.top, cur.bottom, r.top, r.bottom)
        : gap(cur.left, cur.right, r.left, r.right);
      const score = primary + cross * 2;
      if (score < bestScore) { bestScore = score; best = el; }
    }

    if (best) setNavSel(best);
  }, [collectNav, setNavSel]);

  /* ── step "into" a card: the ring glides onto its first link/button ── */
  const enterCard = useCallback((card) => {
    navInsideRef.current = card;
    // pre-select the top-most interactive element inside the card
    const inner = Array.from(card.querySelectorAll("a[href], button"))
      .filter(isNavable)
      .sort((a, b) => {
        const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
        return ra.top - rb.top || ra.left - rb.left;
      });
    setNavSel(inner[0] ?? null);
  }, [setNavSel]);

  /* ── step back "out": the ring glides back to wrap the whole card ── */
  const exitCard = useCallback(() => {
    const card = navInsideRef.current;
    if (!card) return false;
    navInsideRef.current = null;
    setNavSel(card);
    return true;
  }, [setNavSel]);

  /* ── activate the selected element (Enter) ── */
  const activateNav = useCallback(() => {
    const el = navSelRef.current;
    if (!el) return false;
    // already inside a card → clicking one of its links/buttons
    if (navInsideRef.current) {
      if (el.matches("a[href], button")) { el.click(); return true; }
      return false;
    }
    // card level: a card with interactive children → zoom into it
    if (el.matches("[data-nav]")) {
      if (el.querySelector("a[href], button")) { enterCard(el); return true; }
      return false;
    }
    // loose link/button → click directly
    if (el.matches("a[href], button")) { el.click(); return true; }
    return false;
  }, [enterCard]);

  /* ── dashboard actions (welcome view): run the action at index i ── */
  const runWelcomeAction = useCallback((i) => {
    switch (i) {
      case 0: setShowAI(true); break;
      case 1: enterEditor("about"); break;
      case 2: openTelescope(); break;
      case 3: setShowHelp(true); break;
      case 4: openLink(LINKS.github); break;
      case 5: openLink(LINKS.linkedin); break;
      case 6: openLink(LINKS.resume); break;
      case 7: openLink(LINKS.blog); break;
    }
  }, [enterEditor, openLink, openTelescope]);

  /* ── global keyboard shortcuts ── */
  useEffect(() => {
    const onKey = (e) => {
      // don't intercept if user is in an input that isn't ours
      const tag = e.target.tagName;
      const isOurInput = e.target === cmdInputRef.current || e.target === teleInputRef.current || e.target === aiInputRef.current;
      if (!isOurInput && (tag === "INPUT" || tag === "TEXTAREA")) return;

      // Escape — close everything
      if (e.key === "Escape") {
        if (showAI) { setShowAI(false); return; }
        if (showTelescope) { setShowTelescope(false); setTeleQuery(""); return; }
        if (showHelp) { setShowHelp(false); return; }
        if (mode === "command") { exitCommand(); return; }
        if (navInsideRef.current) { exitCard(); return; }
        if (navSelRef.current) { setNavSel(null); return; }
        return;
      }

      // Ctrl+P — telescope
      if ((e.ctrlKey || e.metaKey) && e.key === "p") {
        e.preventDefault();
        setShowTelescope(true);
        setTeleQuery("");
        setTeleIdx(0);
        setTimeout(() => teleInputRef.current?.focus(), 0);
        return;
      }

      // Ctrl+T — cycle theme
      if ((e.ctrlKey || e.metaKey) && e.key === "t") {
        e.preventDefault();
        const idx = THEMES.findIndex((t) => t.id === theme);
        const next = THEMES[(idx + 1) % THEMES.length];
        setTheme(next.id);
        flashMsg(`-- theme: ${next.label} --`, "success");
        return;
      }

      // Ctrl+S — cycle style (prevents the browser save dialog)
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        const idx = STYLES.findIndex((s) => s.id === style);
        const next = STYLES[(idx + 1) % STYLES.length];
        setStyle(next.id);
        flashMsg(`-- style: ${next.label} --`, "success");
        return;
      }

      // if any overlay is open, let it handle keys
      if (showAI || showTelescope || showHelp) return;

      // command mode input handling
      if (mode === "command") return;

      // NORMAL mode keys
      if (e.target !== document.body && !isOurInput) return;

      // : — enter command mode
      if (e.key === ":") {
        e.preventDefault();
        enterCommand();
        return;
      }

      // / — also enter command (search-style)
      if (e.key === "/") {
        e.preventDefault();
        enterCommand();
        return;
      }

      // welcome screen — j/k or arrows to select an action, Enter to run it.
      // Nothing is selected initially; the first nav key lands on "Open
      // portfolio" (index 1), from which `k`/↑ reaches the AI action.
      if (view === "welcome") {
        if (e.key === "j" || e.key === "ArrowDown") {
          e.preventDefault();
          setWelcomeIdx((i) => (i < 0 ? 1 : Math.min(i + 1, WELCOME_ACTIONS.length - 1)));
          return;
        }
        if (e.key === "k" || e.key === "ArrowUp") {
          e.preventDefault();
          setWelcomeIdx((i) => (i < 0 ? 1 : Math.max(i - 1, 0)));
          return;
        }
        if (e.key === "Enter") {
          e.preventDefault();
          runWelcomeAction(welcomeIdx < 0 ? 1 : welcomeIdx); // default: Open portfolio
          return;
        }
        return;
      }

      // h/j/k/l (+ arrow keys) — move spatial selection between cards, or
      // between a card's own links/buttons once you've entered it
      if (view === "editor") {
        const dir =
          e.key === "h" || e.key === "ArrowLeft" ? "h" :
          e.key === "l" || e.key === "ArrowRight" ? "l" :
          e.key === "j" || e.key === "ArrowDown" ? "j" :
          e.key === "k" || e.key === "ArrowUp" ? "k" : null;
        if (dir) {
          e.preventDefault();
          moveNav(dir);
          return;
        }
        if (e.key === "Enter") {
          if (activateNav()) { e.preventDefault(); return; }
        }
      }

      // gg / G jump
      if (view === "editor" && editorRef.current) {
        if (e.key === "g") {
          // wait for second g
          const handler = (e2) => {
            document.removeEventListener("keydown", handler);
            if (e2.key === "g") editorRef.current.scrollTo({ top: 0, behavior: "smooth" });
          };
          document.addEventListener("keydown", handler);
          setTimeout(() => document.removeEventListener("keydown", handler), 500);
          return;
        }
        if (e.key === "G" && e.shiftKey) {
          editorRef.current.scrollTo({ top: editorRef.current.scrollHeight, behavior: "smooth" });
          return;
        }
      }
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mode, view, showAI, showTelescope, showHelp, enterCommand, exitCommand, enterEditor, theme, style, flashMsg, runWelcomeAction, welcomeIdx, moveNav, activateNav, exitCard, setNavSel]);

  /* ── keep the focus ring aligned when the layout reflows ── */
  useEffect(() => {
    const onResize = () => { if (navSelRef.current) positionRing(navSelRef.current); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [positionRing]);

  /* ── AI: execute tool calls returned by the model ── */
  const executeToolCalls = useCallback((calls) => {
    const results = [];
    for (const call of calls) {
      let result = "done";
      if (call.name === "navigate_section") {
        if (view !== "editor") enterEditor(call.args.section_id);
        else scrollTo(call.args.section_id);
        setShowAI(false);
        flashMsg(`-- navigated to ${call.args.section_id} --`, "success");
        result = `Navigated to the ${call.args.section_id} section.`;
      } else if (call.name === "set_theme") {
        setTheme(call.args.theme_id);
        flashMsg(`-- theme: ${call.args.theme_id} --`, "success");
        result = `Theme changed to ${call.args.theme_id}.`;
      } else if (call.name === "set_style") {
        setStyle(call.args.style_id);
        flashMsg(`-- style: ${call.args.style_id} --`, "success");
        result = `Style changed to ${call.args.style_id}.`;
      } else if (call.name === "open_link") {
        openLink(call.args.url);
        flashMsg(`-- opening ${call.args.label ?? call.args.url} --`, "success");
        result = `Opened ${call.args.label ?? call.args.url}.`;
      }
      results.push({ tool_call_id: call.id, content: result });
    }
    return results;
  }, [view, enterEditor, scrollTo, setTheme, setStyle, openLink, flashMsg]);

  /* ── AI: consume an SSE stream and append deltas to the last assistant message ── */
  const consumeStream = useCallback(async (response) => {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let started = false;

    setAiMessages((prev) => {
      if (prev.length > 0 && prev[prev.length - 1].role === "assistant" && prev[prev.length - 1].content === "") {
        return prev;
      }
      return [...prev, { role: "assistant", content: "" }];
    });

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop();

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const raw = line.slice(6).trim();
        if (!raw || raw === "[DONE]") continue;
        try {
          const chunk = JSON.parse(raw);
          if (chunk.type === "delta" && chunk.content) {
            if (!started) { started = true; setAiLoading(false); }
            setAiMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = {
                ...updated[updated.length - 1],
                content: updated[updated.length - 1].content + chunk.content,
              };
              return updated;
            });
          }
          if (chunk.type === "done") setAiLoading(false);
        } catch {
          // skip malformed chunks
        }
      }
    }
    setAiLoading(false);
  }, []);

  /* ── AI: send a message, handle tool call round-trips, stream the response ── */
  const onAISend = useCallback(async (userText) => {
    const history = aiMessages;
    setAiMessages((prev) => [...prev, { role: "user", content: userText }]);
    setAiLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText, history }),
      });

      const contentType = res.headers.get("content-type") ?? "";

      if (contentType.includes("application/json")) {
        const data = await res.json();
        if (data.type === "tool_calls") {
          const toolResults = executeToolCalls(data.calls);
          // Follow-up: stream the final answer with tool results injected
          const followUp = await fetch("/api/ai", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: userText,
              history,
              toolCalls: data.calls,
              toolResults,
            }),
          });
          if (!followUp.ok) {
            const err = await followUp.json().catch(() => ({}));
            setAiMessages((prev) => [...prev, { role: "assistant", content: err.error ?? "Something went wrong." }]);
          } else {
            await consumeStream(followUp);
          }
        } else {
          setAiMessages((prev) => [...prev, { role: "assistant", content: data.error ?? "Something went wrong." }]);
        }
        setAiLoading(false);
        return;
      }

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setAiMessages((prev) => [...prev, { role: "assistant", content: err.error ?? "Something went wrong." }]);
        setAiLoading(false);
        return;
      }

      await consumeStream(res);
    } catch {
      setAiMessages((prev) => [...prev, { role: "assistant", content: "Network error. Please try again." }]);
      setAiLoading(false);
    }
  }, [aiMessages, executeToolCalls, consumeStream]);

  /* ── telescope filtering ── */
  const teleFiltered = TELESCOPE_ITEMS.filter((item) => {
    if (!teleQuery) return true;
    const q = teleQuery.toLowerCase();
    return item.label.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q) || item.id.includes(q);
  });

  const teleSelect = useCallback((item) => {
    setShowTelescope(false);
    setTeleQuery("");
    if (item.type === "section") {
      if (view !== "editor") enterEditor(item.id);
      else scrollTo(item.id);
    } else if (item.type === "link") {
      if (item.href.startsWith("mailto:")) {
        window.location.href = item.href;
      } else {
        openLink(item.href);
      }
    } else if (item.id === "help") {
      setShowHelp(true);
    }
  }, [view, enterEditor, scrollTo, openLink]);

  // Computed after mount only — rendering it during SSR would mismatch the
  // client's clock and trip a hydration error.
  const [timeStr, setTimeStr] = useState("");
  useEffect(() => {
    const tick = () =>
      setTimeStr(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }));
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);

  /* ════════════════════════════════════════
     RENDER
     ════════════════════════════════════════ */

  return (
    <div className="shell">
      {/* ── titlebar ── */}
      <div className="titlebar">
        <span className="titlebarDot r" />
        <span className="titlebarDot y" />
        <span className="titlebarDot g" />
        <span className="titlebarTitle">ayaanhafeez.dev — nvim</span>
      </div>

      {/* ── body ── */}
      <div className="ideBody">
        {/* sidebar */}
        {view === "editor" && (
          <aside className="sidebar">
            <div className="sidebarHeader">explorer</div>
            <div className="sidebarTree">
              <div className="treeFolder">
                <span className="treeFolderIcon">▾</span>
                ~/portfolio
              </div>
              {SECTIONS.map((s) => (
                <div
                  key={s.id}
                  className={`treeItem ${active === s.id ? "active" : ""}`}
                  onClick={() => scrollTo(s.id)}
                >
                  <span className="treeIcon">{s.icon}</span>
                  <span className="treeName">{s.label}</span>
                </div>
              ))}
              <div className="treeFolder" style={{ marginTop: 16 }}>
                <span className="treeFolderIcon">▸</span>
                ~/links
              </div>
              <a href={LINKS.github} target="_blank" rel="noreferrer" className="treeItem" style={{ textDecoration: "none" }}>
                <span className="treeIcon">🔗</span>
                <span className="treeName">github</span>
              </a>
              <a href={LINKS.linkedin} target="_blank" rel="noreferrer" className="treeItem" style={{ textDecoration: "none" }}>
                <span className="treeIcon">🔗</span>
                <span className="treeName">linkedin</span>
              </a>
              <a href={LINKS.resume} className="treeItem" style={{ textDecoration: "none" }}>
                <span className="treeIcon">📎</span>
                <span className="treeName">resume.pdf</span>
              </a>
            </div>
            <button className="sidebarAIBtn" onClick={() => setShowAI(true)}>
              ✦ Ask AI
            </button>
            <div className="sidebarHints">
              <kbd>:</kbd> command&ensp;
              <kbd>Ctrl+P</kbd> find<br />
              <kbd>h</kbd><kbd>j</kbd><kbd>k</kbd><kbd>l</kbd> cards&ensp;
              <kbd>gg</kbd> top&ensp;
              <kbd>G</kbd> bottom
            </div>
          </aside>
        )}

        {/* main content */}
        {view === "welcome" ? (
          <div className="editorPane">
            <div className="welcome">
              <pre className="welcomeAscii" ref={asciiRef}>{`
 █████╗ ██╗   ██╗ █████╗  █████╗ ███╗   ██╗   ██╗  ██╗ █████╗ ███████╗███████╗███████╗███████╗
██╔══██╗╚██╗ ██╔╝██╔══██╗██╔══██╗████╗  ██║   ██║  ██║██╔══██╗██╔════╝██╔════╝██╔════╝╚══███╔╝
███████║ ╚████╔╝ ███████║███████║██╔██╗ ██║   ███████║███████║█████╗  █████╗  █████╗    ███╔╝
██╔══██║  ╚██╔╝  ██╔══██║██╔══██║██║╚██╗██║   ██╔══██║██╔══██║██╔══╝  ██╔══╝  ██╔══╝   ███╔╝
██║  ██║   ██║   ██║  ██║██║  ██║██║ ╚████║   ██║  ██║██║  ██║██║     ███████╗███████╗███████╗
╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚══════╝╚══════╝╚══════╝
`}</pre>
              <div className="welcomeSub">
                AI Developer @ Elev8AI — LLM pipelines, backends, Android apps, bare-metal systems.
              </div>
              <div className="welcomeActions">
                {WELCOME_ACTIONS.map((action, i) => (
                  <div
                    key={action.key}
                    className={`welcomeAction${action.className ? ` ${action.className}` : ""}${i === welcomeIdx ? " selected" : ""}`}
                    onClick={() => runWelcomeAction(i)}
                    onMouseEnter={() => setWelcomeIdx(i)}
                  >
                    <span className="welcomeActionKey">{action.key}</span>
                    <span className="welcomeActionLabel">{action.label}</span>
                  </div>
                ))}
              </div>
              <div className="welcomeVersion">
                ayaanhafeez.dev v1.0 — nvim-inspired portfolio &ensp;·&ensp; type <span style={{ color: "var(--cyan)" }}>:</span> for commands
              </div>
            </div>
          </div>
        ) : (
          <div className="editorPane" ref={editorRef} style={{ position: "relative" }}>
            <div className="editorContent" ref={editorContentRef}>
              <div className="focusRing" ref={focusRingRef} aria-hidden="true" />
              {/* ── about ── */}
              <div className="sectionBlock" id="about" ref={(el) => { sectionRefs.current.about = el; }}>
                <div className="heroBlock">
                  <h1 className="heroName">
                    Ayaan Hafeez<span className="heroDot">.</span><span className="heroCursor" />
                  </h1>
                  <p className="heroSub">
                    Computer Engineering student at the University of Alberta with production experience across
                    full-stack development, AI/LLM pipelines, and low-level systems programming —
                    AI Developer @ Elev8AI, shipping NL2SQL chatbots, REST APIs, API scrapers, and Android ML apps;
                    personal projects span a bare-metal OS kernel, an EMG input device, and open-source developer tooling.
                  </p>
                  <div className="ctaRow">
                    <a className="btn" href={LINKS.github} target="_blank" rel="noreferrer">~/github</a>
                    <a className="btn" href={LINKS.linkedin} target="_blank" rel="noreferrer">~/linkedin</a>
                    <a className="btn ghost" href={`mailto:${LINKS.email}`}>~/email</a>
                    <a className="btn ghost" href={LINKS.resume}>~/resume.pdf</a>
                  </div>
                  <div className="pillRow">
                    <Pill>AI / RAG / NL2SQL</Pill>
                    <Pill>FastAPI + PostgreSQL</Pill>
                    <Pill>Kotlin + Compose</Pill>
                    <Pill>React + Node</Pill>
                    <Pill>Bare Metal OS / ARM</Pill>
                    <Pill>Embedded + FPGA</Pill>
                  </div>
                </div>
              </div>

              {/* ── projects ── */}
              <div className="sectionBlock" id="projects" ref={(el) => { sectionRefs.current.projects = el; }}>
                <h2 className="sectionHeading">projects</h2>
                <p className="sectionSub">-- professional and personal work</p>
                <div className="projectGrid">
                  {PROJECTS.map((p) => (
                    <ProjectCard key={p.title} p={p} onAskAI={openAIForProject} />
                  ))}
                </div>
              </div>

              {/* ── experience ── */}
              <div className="sectionBlock" id="experience" ref={(el) => { sectionRefs.current.experience = el; }}>
                <h2 className="sectionHeading">experience</h2>
                <p className="sectionSub">-- what i&apos;ve been doing recently</p>
                {EXPERIENCE.map((e) => (
                  <div className="expCard" data-nav data-card-id={`exp-${e.role}-${e.org}`} key={e.role + e.org}>
                    <div className="expHead">
                      <div>
                        <div className="expRole">{e.role} <span className="expAt">@</span> {e.org}</div>
                        <div className="expMeta">{e.location}</div>
                      </div>
                      <div className="expMeta">{e.time}</div>
                    </div>
                    <ul className="expList">
                      {e.bullets.map((b, i) => <li key={i}>{b}</li>)}
                    </ul>
                  </div>
                ))}
              </div>

              {/* ── skills ── */}
              <div className="sectionBlock" id="skills" ref={(el) => { sectionRefs.current.skills = el; }}>
                <h2 className="sectionHeading">skills</h2>
                <p className="sectionSub">-- quick scan list</p>
                <div className="skillsGrid">
                  {Object.entries(SKILLS).map(([group, items]) => (
                    <div className="skillCard" data-nav data-card-id={`skill-${group}`} key={group}>
                      <div className="skillGroup">{group}</div>
                      <div className="pillRow">
                        {items.map((it) => <Pill key={it}>{it}</Pill>)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── contact ── */}
              <div className="sectionBlock" id="contact" ref={(el) => { sectionRefs.current.contact = el; }}>
                <h2 className="sectionHeading">contact</h2>
                <p className="sectionSub">-- best way to reach me</p>
                <div className="contactTerm">
                  <div className="contactTermBar">
                    <span className="contactTermDot r" />
                    <span className="contactTermDot y" />
                    <span className="contactTermDot g" />
                    <span style={{ marginLeft: 8 }}>~/contact.sh</span>
                  </div>
                  <div className="contactTermBody">
                    <span className="termLine"><span className="prompt">$</span> <span style={{ color: "var(--fg-dark)" }}>echo $EMAIL</span></span>
                    <span className="termLine"><a href={`mailto:${LINKS.email}`}>{LINKS.email}</a></span>
                    <span className="termLine"><a href={`mailto:${LINKS.personalEmail}`}>{LINKS.personalEmail}</a></span>
                    <span className="termLine" style={{ marginTop: 8 }}><span className="prompt">$</span> <span style={{ color: "var(--fg-dark)" }}>cat links.txt</span></span>
                    <span className="termLine"><a href={LINKS.github} target="_blank" rel="noreferrer">github.com/mayaanhafeez</a></span>
                    <span className="termLine"><a href={LINKS.linkedin} target="_blank" rel="noreferrer">linkedin.com/in/ayaanhafeez</a></span>
                  </div>
                </div>
                <div style={{ marginTop: 12 }}>
                  <div className="ctaRow">
                    <a className="btn" href={`mailto:${LINKS.email}`}>~/email</a>
                    <a className="btn ghost" href={LINKS.github} target="_blank" rel="noreferrer">~/github</a>
                    <a className="btn ghost" href={LINKS.linkedin} target="_blank" rel="noreferrer">~/linkedin</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── statusline ── */}
      <div className="statusline">
        <div className={`statusSeg statusMode ${mode}`}>{mode}</div>
        <div className="statusSeg statusBranch hideMobile">⎇ main</div>
        <div className="statusSeg statusFile">
          {view === "welcome" ? "dashboard" : (SECTIONS.find((s) => s.id === active)?.label ?? "about.md")}
        </div>
        <div className="statusSpacer" />
        <div className="statusSeg statusRight hideMobile">ayaanhafeez.dev</div>
        <div className="statusSeg statusTheme hideMobile">{theme}</div>
        <div className="statusSeg statusStyle hideMobile">{style}</div>
        <div className="statusSeg statusEncoding hideMobile">utf-8</div>
        <div className="statusSeg statusPos">
          {view === "welcome" ? "~" : `Ln ${SECTIONS.findIndex((s) => s.id === active) + 1}`}
        </div>
        <div className="statusSeg statusTime hideMobile">{timeStr}</div>
      </div>

      {/* ── command bar ── */}
      {mode === "command" ? (
        <div className="cmdbar">
          <span className="cmdbarPrefix">:</span>
          <input
            ref={cmdInputRef}
            className="cmdbarInput"
            value={cmdText}
            placeholder="type a command... (try help, open projects, github, ls)"
            onChange={(e) => { setCmdText(e.target.value); setHistoryIdx(-1); }}
            onKeyDown={(e) => {
              if (e.key === "Enter") { execCmd(cmdText); }
              if (e.key === "Escape") { exitCommand(); }
              if (e.key === "ArrowUp") {
                e.preventDefault();
                const next = Math.min(historyIdx + 1, cmdHistory.length - 1);
                setHistoryIdx(next);
                if (cmdHistory[next]) setCmdText(cmdHistory[next]);
              }
              if (e.key === "ArrowDown") {
                e.preventDefault();
                const next = Math.max(historyIdx - 1, -1);
                setHistoryIdx(next);
                setCmdText(next === -1 ? "" : cmdHistory[next] || "");
              }
              // tab completion
              if (e.key === "Tab") {
                e.preventDefault();
                const partial = cmdText.toLowerCase();
                const allCmds = ["open", "edit", "ls", "help", "github", "linkedin", "email", "resume", "whoami", "date", "find", "home", "clear", "quit", "theme", "colorscheme", "style", "ai", "chat"];
                const match = allCmds.find((c) => c.startsWith(partial));
                if (match) setCmdText(match);
              }
            }}
          />
        </div>
      ) : (
        <div className="cmdbarMsg" onClick={enterCommand}>
          {cmdMsg ? (
            <span className={cmdMsg.type}>{cmdMsg.text}</span>
          ) : (
            <span className="hint">Press <span style={{ color: "var(--cyan)" }}>:</span> to enter a command or <span style={{ color: "var(--cyan)" }}>Ctrl+P</span> to search</span>
          )}
        </div>
      )}

      {/* ── telescope overlay ── */}
      {showTelescope && (
        <div className="overlay" onClick={() => { setShowTelescope(false); setTeleQuery(""); }}>
          <div className="telescope" onClick={(e) => e.stopPropagation()}>
            <div className="telescopeHeader">
              <span className="telescopeIcon">🔭</span>
              <input
                ref={teleInputRef}
                className="telescopeInput"
                value={teleQuery}
                placeholder="Search files, sections, links..."
                autoFocus
                onChange={(e) => { setTeleQuery(e.target.value); setTeleIdx(0); }}
                onKeyDown={(e) => {
                  if (e.key === "Escape") { setShowTelescope(false); setTeleQuery(""); }
                  if (e.key === "ArrowDown") { e.preventDefault(); setTeleIdx((i) => Math.min(i + 1, teleFiltered.length - 1)); }
                  if (e.key === "ArrowUp") { e.preventDefault(); setTeleIdx((i) => Math.max(i - 1, 0)); }
                  if (e.key === "Enter" && teleFiltered[teleIdx]) { teleSelect(teleFiltered[teleIdx]); }
                }}
              />
            </div>
            <div className="telescopeHint">
              <span style={{ color: "var(--comment)" }}>↑↓</span> navigate&ensp;
              <span style={{ color: "var(--comment)" }}>Enter</span> select&ensp;
              <span style={{ color: "var(--comment)" }}>Esc</span> close
            </div>
            <div className="telescopeResults">
              {teleFiltered.length === 0 ? (
                <div className="telescopeEmpty">No results for &quot;{teleQuery}&quot;</div>
              ) : (
                teleFiltered.map((item, i) => (
                  <div
                    key={item.id}
                    className={`telescopeItem ${i === teleIdx ? "selected" : ""}`}
                    onClick={() => teleSelect(item)}
                    onMouseEnter={() => setTeleIdx(i)}
                  >
                    <span className="telescopeItemIcon">{item.icon}</span>
                    <span className="telescopeItemLabel">{item.label}</span>
                    <span className="telescopeItemDesc">{item.desc}</span>
                    {item.type === "section" && (
                      <span className="telescopeItemKey">:open {item.id}</span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── ai chat overlay ── */}
      {showAI && (
        <AIChat
          messages={aiMessages}
          loading={aiLoading}
          onSend={onAISend}
          initialPrompt={aiInitialPrompt}
          onClose={() => { setShowAI(false); setAiInitialPrompt(null); }}
          inputRef={aiInputRef}
        />
      )}

      {/* ── help overlay ── */}
      {showHelp && (
        <div className="overlay" onClick={() => setShowHelp(false)}>
          <div className="helpPopup" onClick={(e) => e.stopPropagation()}>
            <div className="helpHeader">
              <span>:help — keybindings & commands</span>
              <span className="helpClose" onClick={() => setShowHelp(false)}>✕</span>
            </div>
            <div className="helpBody">
              {HELP_DATA.map((section) => (
                <div className="helpSection" key={section.title}>
                  <div className="helpSectionTitle">{section.title}</div>
                  {section.cmds.map((row) => (
                    <div className="helpRow" key={row.cmd}>
                      <span className="helpCmd">{row.cmd}</span>
                      <span className="helpDesc">{row.desc}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
