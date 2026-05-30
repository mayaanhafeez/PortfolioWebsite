"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/* ════════════════════════════════════════
   DATA
   ════════════════════════════════════════ */

const LINKS = {
  email: "mhafeez1@ualberta.ca",
  personalEmail: "m.ayaan.hafeez@gmail.com",
  github: "https://github.com/mayaanhafeez",
  linkedin: "https://linkedin.com/in/ayaanhafeez",
  resume: "/resume.pdf",
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
];

const SECTIONS = [
  { id: "about", label: "about.md", icon: "📄", desc: "About me" },
  { id: "projects", label: "projects.md", icon: "📂", desc: "Featured projects" },
  { id: "experience", label: "experience.md", icon: "💼", desc: "Work experience" },
  { id: "skills", label: "skills.md", icon: "⚡", desc: "Technical skills" },
  { id: "contact", label: "contact.sh", icon: "📨", desc: "Get in touch" },
];

const PROJECTS = [
  {
    title: "Bare Metal Raspberry Pi OS",
    subtitle: "OS kernel from scratch in C and ARM Assembly",
    type: "personal",
    wip: true,
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
      "The mansion is a virtual filesystem — rooms are directories, evidence is files — solved by walking around, reading clues, and using grep.",
      "Commands unlock progressively as you investigate; grep -r is the core mechanic for correlating evidence across rooms.",
      "Vertical slice: one murder, four suspects, five rooms, solvable in one sitting.",
    ],
    links: [
      { label: "GitHub", href: "https://github.com/mayaanhafeez/TerminalMystery" },
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
      { label: "Live Demo", href: "https://ascii-ayaan.vercel.app/" },
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
    links: [{ label: "GitHub", href: "https://github.com/mayaanhafeez/surgraft" }],
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
    title: "FocusNode — Chrome Extension",
    subtitle: "Blocks distracting sites during focus",
    type: "personal",
    tech: ["React", "Vite", "Chrome Extensions API", "JavaScript"],
    bullets: [
      "Blocks user-defined domains in real time and redirects tabs.",
      "Persistent settings with Chrome Storage across restarts.",
    ],
    links: [{ label: "GitHub", href: "https://github.com/mayaanhafeez/FocusNode" }],
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
  Languages: ["Python", "Kotlin", "Java", "C/C++", "JavaScript", "TypeScript", "Lua", "SQL", "Bash", "ARM/MIPS", "VHDL"],
  Frameworks: ["FastAPI", "Node.js", "React", "Jetpack Compose", "Vite", "Express", "Flask", "LangChain", "SQLAlchemy", "scikit-learn", "NumPy", "pandas", "scipy", "Tailwind CSS"],
  Tools: ["Git", "Docker", "PostgreSQL", "Redis", "MongoDB", "ChromaDB", "Selenium", "Ollama", "OpenAI API", "Anthropic API", "AWS", "Stripe", "VS Code", "Android Studio"],
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
      { cmd: "j / k", desc: "Scroll down / up" },
    ],
  },
  {
    title: "Popups",
    cmds: [
      { cmd: "Ctrl+P", desc: "Open Telescope fuzzy finder" },
      { cmd: ":help", desc: "Show this help popup" },
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
    ],
  },
  {
    title: "Display",
    cmds: [
      { cmd: ":theme <name>", desc: "Switch color scheme (tokyo-night, catppuccin, rose-pine, gruvbox, nord, dracula, one-dark, solarized, everforest, monokai, tomorrow-night-burns)" },
      { cmd: ":theme", desc: "Cycle to next theme" },
      { cmd: "Ctrl+T", desc: "Cycle theme" },
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

/* ════════════════════════════════════════
   MAIN PAGE
   ════════════════════════════════════════ */

export default function Page() {
  const [view, setView] = useState("welcome"); // "welcome" | "editor"
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

  const editorRef = useRef(null);
  const sectionRefs = useRef({});
  const cmdInputRef = useRef(null);
  const teleInputRef = useRef(null);

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

    flashMsg(`E492: Not an editor command: ${cmd}`, "error");
  }, [exitCommand, scrollTo, flashMsg, openLink, enterEditor, view, theme]);

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

  /* ── global keyboard shortcuts ── */
  useEffect(() => {
    const onKey = (e) => {
      // don't intercept if user is in an input that isn't ours
      const tag = e.target.tagName;
      const isOurInput = e.target === cmdInputRef.current || e.target === teleInputRef.current;
      if (!isOurInput && (tag === "INPUT" || tag === "TEXTAREA")) return;

      // Escape — close everything
      if (e.key === "Escape") {
        if (showTelescope) { setShowTelescope(false); setTeleQuery(""); return; }
        if (showHelp) { setShowHelp(false); return; }
        if (mode === "command") { exitCommand(); return; }
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

      // if telescope is open, let it handle keys
      if (showTelescope || showHelp) return;

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

      // welcome screen — Enter to go to editor
      if (view === "welcome" && e.key === "Enter") {
        enterEditor("about");
        return;
      }

      // j/k scrolling
      if (view === "editor" && editorRef.current) {
        if (e.key === "j") { editorRef.current.scrollBy({ top: 60, behavior: "smooth" }); return; }
        if (e.key === "k") { editorRef.current.scrollBy({ top: -60, behavior: "smooth" }); return; }
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
  }, [mode, view, showTelescope, showHelp, enterCommand, exitCommand, enterEditor, theme, flashMsg]);

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

  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });

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
        <span className="titlebarTitle">ayaan.dev — nvim</span>
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
            <div className="sidebarHints">
              <kbd>:</kbd> command&ensp;
              <kbd>Ctrl+P</kbd> find<br />
              <kbd>j</kbd><kbd>k</kbd> scroll&ensp;
              <kbd>gg</kbd> top&ensp;
              <kbd>G</kbd> bottom
            </div>
          </aside>
        )}

        {/* main content */}
        {view === "welcome" ? (
          <div className="editorPane">
            <div className="welcome">
              <pre className="welcomeAscii">{`
   ██████╗ ██╗   ██╗ █████╗  █████╗ ███╗   ██╗
  ██╔══██╗╚██╗ ██╔╝██╔══██╗██╔══██╗████╗  ██║
  ███████║ ╚████╔╝ ███████║███████║██╔██╗ ██║
  ██╔══██║  ╚██╔╝  ██╔══██║██╔══██║██║╚██╗██║
  ██║  ██║   ██║   ██║  ██║██║  ██║██║ ╚████║
  ╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝`}</pre>
              <div className="welcomeName">
                Ayaan Hafeez<span className="welcomeNameDot">.</span>
              </div>
              <div className="welcomeSub">
                AI Developer @ Elev8AI — LLM pipelines, backends, Android apps, bare-metal systems.
                <br />
                Type <span style={{ color: "var(--cyan)" }}>:</span> to enter a command, or pick an action below.
              </div>
              <div className="welcomeActions">
                <div className="welcomeAction" onClick={() => enterEditor("about")}>
                  <span className="welcomeActionKey">Enter</span>
                  <span className="welcomeActionLabel">Open portfolio</span>
                </div>
                <div className="welcomeAction" onClick={() => setShowTelescope(true)}>
                  <span className="welcomeActionKey">Ctrl+P</span>
                  <span className="welcomeActionLabel">Find anything</span>
                </div>
                <div className="welcomeAction" onClick={() => setShowHelp(true)}>
                  <span className="welcomeActionKey">:help</span>
                  <span className="welcomeActionLabel">Show all commands</span>
                </div>
                <div className="welcomeAction" onClick={() => openLink(LINKS.github)}>
                  <span className="welcomeActionKey">:github</span>
                  <span className="welcomeActionLabel">GitHub profile</span>
                </div>
                <div className="welcomeAction" onClick={() => openLink(LINKS.linkedin)}>
                  <span className="welcomeActionKey">:linkedin</span>
                  <span className="welcomeActionLabel">LinkedIn profile</span>
                </div>
                <div className="welcomeAction" onClick={() => openLink(LINKS.resume)}>
                  <span className="welcomeActionKey">:resume</span>
                  <span className="welcomeActionLabel">Download resume</span>
                </div>
              </div>
              <div className="welcomeVersion">ayaan.dev v1.0 — nvim-inspired portfolio</div>
            </div>
          </div>
        ) : (
          <div className="editorPane" ref={editorRef} style={{ position: "relative" }}>
            <div className="editorContent">
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
                    <div className="projectCard" key={p.title}>
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
                      <ul className="projectList">
                        {p.bullets.map((b, i) => <li key={i}>{b}</li>)}
                      </ul>
                      {p.wip && <div className="wipNotice">◌ work in progress</div>}
                      {p.nda && <div className="ndaNotice">⚠ source under NDA</div>}
                      {p.links && p.links.length > 0 && (
                        <div className="linkRow">
                          {p.links.map((l) => (
                            <a key={l.href} className="linkBtn" href={l.href} target="_blank" rel="noreferrer">
                              {l.label} →
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* ── experience ── */}
              <div className="sectionBlock" id="experience" ref={(el) => { sectionRefs.current.experience = el; }}>
                <h2 className="sectionHeading">experience</h2>
                <p className="sectionSub">-- what i&apos;ve been doing recently</p>
                {EXPERIENCE.map((e) => (
                  <div className="expCard" key={e.role + e.org}>
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
                    <div className="skillCard" key={group}>
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
        <div className="statusSeg statusRight hideMobile">ayaan.dev</div>
        <div className="statusSeg statusTheme hideMobile">{theme}</div>
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
                const allCmds = ["open", "edit", "ls", "help", "github", "linkedin", "email", "resume", "whoami", "date", "find", "home", "clear", "quit", "theme", "colorscheme"];
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
