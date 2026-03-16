"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/* ── data ── */

const LINKS = {
  email: "mhafeez1@ualberta.ca",
  github: "https://github.com/mayaanhafeez",
  linkedin: "https://linkedin.com/in/ayaanhafeez",
  resume: "/resume.pdf",
};

const SECTIONS = [
  { id: "about", label: "about.md", icon: "📄" },
  { id: "projects", label: "projects.md", icon: "📂" },
  { id: "experience", label: "experience.md", icon: "💼" },
  { id: "skills", label: "skills.md", icon: "⚡" },
  { id: "contact", label: "contact.sh", icon: "📨" },
];

const PROJECTS = [
  {
    title: "Social Media Platform — Backend",
    subtitle: "Production REST API for a social media application",
    type: "professional",
    tech: ["Python", "FastAPI", "PostgreSQL", "Redis", "Docker", "SQLAlchemy", "Stripe", "JWT"],
    bullets: [
      "Production REST API with RBAC, JWT auth, and Argon2 hashing.",
      "Stripe subscription management with webhook-driven payment sync.",
      "Pluggable ML identity verification: OCR, face matching, liveness, tamper detection.",
      "Containerized with Docker Compose (FastAPI + PostgreSQL + Redis).",
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
  {
    title: "ASCII — Image Converter",
    subtitle: "CLI utility for terminal art",
    type: "personal",
    tech: ["Python"],
    bullets: [
      "Converts images into printable ASCII output.",
      "Terminal-friendly demos and quick visuals.",
    ],
    links: [{ label: "GitHub", href: "https://github.com/mayaanhafeez/ASCII" }],
  },
];

const EXPERIENCE = [
  {
    role: "AI Developer",
    org: "Elev8AI",
    time: "May 2025 – Present",
    location: "Remote",
    bullets: [
      "Production chatbot platform using LLMs, RAG, LangChain + NL2SQL; ~85% benchmark accuracy.",
      "Context selection + entity recognition + relevance scoring; ~70% precision gain, ~4s faster.",
      "Tokenization tuning, caching, query restructuring; ~6s latency in production.",
      "Selenium + Playwright automation; normalized 100+ endpoints into OpenAPI schemas.",
      "FastAPI backend with PostgreSQL, Redis, Stripe, JWT, and ML identity verification.",
      "Android app in Kotlin + Jetpack Compose with ML Kit and AWS Rekognition.",
    ],
  },
];

const SKILLS = {
  Languages: ["Python", "Kotlin", "Java", "C/C++", "JavaScript", "SQL", "NoSQL", "Bash", "ARM/MIPS", "VHDL"],
  Frameworks: ["FastAPI", "Node.js", "React", "Jetpack Compose", "Vite", "Express", "Flask", "LangChain", "NumPy", "pandas"],
  Tools: ["Git", "Docker", "PostgreSQL", "Redis", "AWS", "Stripe", "VS Code", "Android Studio"],
  "ML / Vision": ["ML Kit", "CameraX", "AWS Rekognition", "docTR", "InsightFace", "OpenCV"],
  Hardware: ["FPGA (Zybo)", "Arduino", "ARM Cortex-M4", "BioAMP EXG"],
};

const MORE_REPOS = [
  { title: "PlayMG", subtitle: "C++ repo (forked)", href: "https://github.com/mayaanhafeez/PlayMG" },
];

/* ── components ── */

function Pill({ children }) {
  return <span className="pill">{children}</span>;
}

export default function Page() {
  const [active, setActive] = useState("about");
  const editorRef = useRef(null);
  const sectionRefs = useRef({});

  const scrollTo = useCallback((id) => {
    const el = sectionRefs.current[id];
    if (el && editorRef.current) {
      editorRef.current.scrollTo({
        top: el.offsetTop - 12,
        behavior: "smooth",
      });
    }
  }, []);

  /* track which section is in view */
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const onScroll = () => {
      const ids = SECTIONS.map((s) => s.id);
      let current = ids[0];
      for (const id of ids) {
        const el = sectionRefs.current[id];
        if (el && el.offsetTop - 20 <= editor.scrollTop) {
          current = id;
        }
      }
      setActive(current);
    };

    editor.addEventListener("scroll", onScroll, { passive: true });
    return () => editor.removeEventListener("scroll", onScroll);
  }, []);

  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });

  return (
    <div className="shell">
      {/* ── titlebar ── */}
      <div className="titlebar">
        <span className="titlebarDot r" />
        <span className="titlebarDot y" />
        <span className="titlebarDot g" />
        <span className="titlebarTitle">ayaan.dev — nvim</span>
      </div>

      {/* ── tabline ── */}
      <div className="tabline">
        {SECTIONS.map((s) => (
          <div
            key={s.id}
            className={`tab ${active === s.id ? "active" : ""}`}
            onClick={() => scrollTo(s.id)}
          >
            <span className="tabIcon">{s.icon}</span>
            {s.label}
            <span className="tabClose">×</span>
          </div>
        ))}
      </div>

      {/* ── body ── */}
      <div className="ideBody">
        {/* sidebar / neo-tree */}
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
        </aside>

        {/* main editor */}
        <div className="editorPane" ref={editorRef} style={{ position: "relative" }}>
          <div className="editorContent">

            {/* ── about ── */}
            <div
              className="sectionBlock"
              id="about"
              ref={(el) => { sectionRefs.current.about = el; }}
            >
              <div className="heroBlock">
                <h1 className="heroName">
                  Ayaan Hafeez
                  <span className="heroDot">.</span>
                  <span className="heroCursor" />
                </h1>
                <p className="heroSub">
                  3rd-year Computer Engineering (Software) co-op student at the University of Alberta —
                  AI Developer @ Elev8AI, building production backends, Android apps, and LLM systems.
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
                  <Pill>Embedded + FPGA</Pill>
                </div>
              </div>
            </div>

            {/* ── projects ── */}
            <div
              className="sectionBlock"
              id="projects"
              ref={(el) => { sectionRefs.current.projects = el; }}
            >
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

              <div className="moreRepos">
                <div className="moreReposTitle">more repos</div>
                <div className="miniGrid">
                  {MORE_REPOS.map((r) => (
                    <a key={r.href} className="miniCard" href={r.href} target="_blank" rel="noreferrer">
                      <div className="miniTitle">{r.title}</div>
                      <div style={{ color: "var(--comment)", fontSize: 11 }}>{r.subtitle}</div>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* ── experience ── */}
            <div
              className="sectionBlock"
              id="experience"
              ref={(el) => { sectionRefs.current.experience = el; }}
            >
              <h2 className="sectionHeading">experience</h2>
              <p className="sectionSub">-- what i&apos;ve been doing recently</p>

              {EXPERIENCE.map((e) => (
                <div className="expCard" key={e.role + e.org}>
                  <div className="expHead">
                    <div>
                      <div className="expRole">
                        {e.role} <span className="expAt">@</span> {e.org}
                      </div>
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
            <div
              className="sectionBlock"
              id="skills"
              ref={(el) => { sectionRefs.current.skills = el; }}
            >
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
            <div
              className="sectionBlock"
              id="contact"
              ref={(el) => { sectionRefs.current.contact = el; }}
            >
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
                  <span className="termLine">
                    <span className="prompt">$</span>{" "}
                    <span style={{ color: "var(--fg-dark)" }}>echo $EMAIL</span>
                  </span>
                  <span className="termLine">
                    <a href={`mailto:${LINKS.email}`}>{LINKS.email}</a>
                  </span>
                  <span className="termLine" style={{ marginTop: 8 }}>
                    <span className="prompt">$</span>{" "}
                    <span style={{ color: "var(--fg-dark)" }}>cat links.txt</span>
                  </span>
                  <span className="termLine">
                    <a href={LINKS.github} target="_blank" rel="noreferrer">github.com/mayaanhafeez</a>
                  </span>
                  <span className="termLine">
                    <a href={LINKS.linkedin} target="_blank" rel="noreferrer">linkedin.com/in/ayaanhafeez</a>
                  </span>
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
      </div>

      {/* ── statusline ── */}
      <div className="statusline">
        <div className="statusSeg statusMode">normal</div>
        <div className="statusSeg statusBranch hideMobile">⎇ main</div>
        <div className="statusSeg statusFile">{SECTIONS.find((s) => s.id === active)?.label ?? "about.md"}</div>
        <div className="statusSpacer" />
        <div className="statusSeg statusRight hideMobile">ayaan.dev</div>
        <div className="statusSeg statusEncoding hideMobile">utf-8</div>
        <div className="statusSeg statusPos">Ln {SECTIONS.findIndex((s) => s.id === active) + 1}</div>
        <div className="statusSeg statusTime hideMobile">{timeStr}</div>
      </div>
    </div>
  );
}
