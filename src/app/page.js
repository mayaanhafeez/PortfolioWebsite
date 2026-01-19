const LINKS = {
  email: "mhafeez1@ualberta.ca",
  github: "https://github.com/mayaanhafeez",
  linkedin: "https://linkedin.com/in/ayaanhafeez",
  // If you add your resume PDF later: put it at /public/resume.pdf
  resume: "/resume.pdf",
};

const FEATURED_PROJECTS = [
  {
    title: "FocusNode — Productivity Chrome Extension",
    subtitle: "Blocks distracting sites during focus sessions",
    tech: ["React", "Vite", "Chrome Extensions API", "JavaScript"],
    bullets: [
      "Blocks user-defined domains in real time and redirects tabs quickly.",
      "Stores settings persistently with Chrome Storage for reliable state across restarts.",
    ],
    links: [
      { label: "GitHub", href: "https://github.com/mayaanhafeez/FocusNode" },
    ],
  },
  {
    title: "Tuesday.com — Hackathon Project Management App",
    subtitle: "Built at HackED 2025 (forked repo on GitHub)",
    tech: ["Node.js", "Express", "MongoDB", "JavaScript"],
    bullets: [
      "Hackathon team app with AI-driven task automation concept.",
      "Shipped an end-to-end demo within a 48-hour window.",
    ],
    links: [
      { label: "GitHub", href: "https://github.com/mayaanhafeez/tuesday.com" },
    ],
  },
  {
    title: "ASCII — Image to ASCII Converter",
    subtitle: "Convert images into terminal-friendly ASCII art",
    tech: ["Python"],
    bullets: [
      "CLI-style utility for turning images into printable ASCII output.",
      "Good for terminal demos and quick visuals.",
    ],
    links: [
      { label: "GitHub", href: "https://github.com/mayaanhafeez/ASCII" },
    ],
  },
];

const MORE_REPOS = [
  {
    title: "PlayMG",
    subtitle: "C++ repo (forked)",
    href: "https://github.com/mayaanhafeez/PlayMG",
  },
  // You can add your NL2SQL / scraper repo here when public
];

const EXPERIENCE = [
  {
    role: "AI Developer",
    org: "Elev8AI",
    time: "May 2025 – Present",
    location: "Remote",
    bullets: [
      "Production chatbot platform using open-source LLMs, RAG, LangChain + NL2SQL; ~85% internal benchmark accuracy.",
      "Improved retrieval quality with context selection + entity recognition + relevance scoring; ~70% precision gain and ~4s faster responses.",
      "Optimized pipeline with tokenization tuning, caching, and query restructuring; ~6s latency under production workloads.",
      "Automated API documentation extraction from JS-rendered sites using Selenium + Playwright; normalized 100+ endpoints into OpenAPI-style schemas.",
    ],
  },
];

const SKILLS = {
  Languages: ["Python", "Java", "C/C++", "JavaScript", "SQL", "NoSQL", "Bash", "ARM/MIPS", "VHDL"],
  Frameworks: ["Node.js", "React", "Vite", "Express", "Flask", "LangChain", "NumPy", "pandas"],
  Tools: ["Git", "Docker", "VS Code", "Chrome DevTools"],
  Hardware: ["FPGA (Zybo)", "Arduino", "ARM Cortex-M4", "BioAMP EXG"],
};

function Pill({ children }) {
  return <span className="pill">{children}</span>;
}

function Card({ children }) {
  return <div className="card">{children}</div>;
}

function Section({ id, title, subtitle, children }) {
  return (
    <section id={id} className="section">
      <div className="sectionHead">
        <h2>{title}</h2>
        {subtitle ? <p className="muted">{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
}

export default function Page() {
  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="heroLeft">
          <h1>
            Ayaan Hafeez
            <span className="dot">.</span>
          </h1>
          <p className="lead">
            3rd-year Computer Engineering (Software) co-op student at the University of Alberta —
            AI Developer @ Elev8AI.
          </p>
          <div className="ctaRow">
            <a className="btn" href={LINKS.github} target="_blank" rel="noreferrer">GitHub</a>
            <a className="btn" href={LINKS.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
            <a className="btn ghost" href={`mailto:${LINKS.email}`}>Email</a>
            <a className="btn ghost" href={LINKS.resume}>Resume PDF</a>
          </div>

          <div className="quickFacts">
            <Pill>AI / RAG / NL2SQL</Pill>
            <Pill>React + Node</Pill>
            <Pill>Embedded + FPGA</Pill>
          </div>
        </div>

        <div className="heroRight">
          <Card>
            <h3>Now</h3>
            <ul className="list">
              <li>Building LLM-powered automation + retrieval systems</li>
              <li>Shipping web tools (extensions, apps)</li>
              <li>Looking for co-op opportunities</li>
            </ul>
          </Card>

          <Card>
            <h3>Links</h3>
            <ul className="list">
              <li><a href={LINKS.github} target="_blank" rel="noreferrer">github.com/mayaanhafeez</a></li>
              <li><a href={LINKS.linkedin} target="_blank" rel="noreferrer">linkedin.com/in/ayaanhafeez</a></li>
              <li><a href={`mailto:${LINKS.email}`}>{LINKS.email}</a></li>
            </ul>
          </Card>
        </div>
      </section>

      {/* PROJECTS */}
      <Section id="projects" title="Featured Projects" subtitle="A few things you can click right now.">
        <div className="grid">
          {FEATURED_PROJECTS.map((p) => (
            <Card key={p.title}>
              <div className="cardTop">
                <div>
                  <h3 className="cardTitle">{p.title}</h3>
                  <p className="muted">{p.subtitle}</p>
                </div>
              </div>

              <div className="pillRow">
                {p.tech.map((t) => <Pill key={t}>{t}</Pill>)}
              </div>

              <ul className="list">
                {p.bullets.map((b, i) => <li key={i}>{b}</li>)}
              </ul>

              <div className="linkRow">
                {p.links.map((l) => (
                  <a key={l.href} className="linkBtn" href={l.href} target="_blank" rel="noreferrer">
                    {l.label} →
                  </a>
                ))}
              </div>
            </Card>
          ))}
        </div>

        <div className="spacer" />

        <Card>
          <h3>More repos</h3>
          <div className="miniGrid">
            {MORE_REPOS.map((r) => (
              <a key={r.href} className="miniCard" href={r.href} target="_blank" rel="noreferrer">
                <div className="miniTitle">{r.title}</div>
                <div className="muted">{r.subtitle}</div>
              </a>
            ))}
          </div>
        </Card>
      </Section>

      {/* EXPERIENCE */}
      <Section id="experience" title="Experience" subtitle="What I’ve been doing recently.">
        {EXPERIENCE.map((e) => (
          <Card key={e.role + e.org}>
            <div className="expHead">
              <div>
                <h3 className="cardTitle">{e.role} — {e.org}</h3>
                <p className="muted">{e.location}</p>
              </div>
              <div className="muted">{e.time}</div>
            </div>
            <ul className="list">
              {e.bullets.map((b, i) => <li key={i}>{b}</li>)}
            </ul>
          </Card>
        ))}
      </Section>

      {/* SKILLS */}
      <Section id="skills" title="Skills" subtitle="Quick scan list.">
        <div className="grid2">
          {Object.entries(SKILLS).map(([group, items]) => (
            <Card key={group}>
              <h3>{group}</h3>
              <div className="pillRow">
                {items.map((it) => <Pill key={it}>{it}</Pill>)}
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* CONTACT */}
      <Section id="contact" title="Contact" subtitle="Best way to reach me.">
        <Card>
          <p className="lead" style={{ marginTop: 0 }}>
            Email me at <a href={`mailto:${LINKS.email}`}>{LINKS.email}</a>
          </p>
          <div className="ctaRow">
            <a className="btn" href={`mailto:${LINKS.email}`}>Email</a>
            <a className="btn ghost" href={LINKS.github} target="_blank" rel="noreferrer">GitHub</a>
            <a className="btn ghost" href={LINKS.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
          </div>
        </Card>
      </Section>
    </>
  );
}

