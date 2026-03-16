import "./globals.css";

export const metadata = {
  title: "Ayaan Hafeez | Portfolio",
  description: "AI Developer @ Elev8AI — projects, experience, and contact.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="bg" />
        <header className="nav">
          <div className="navInner">
            <a className="brand" href="#top">ayaan.dev</a>
            <nav className="links">
              <a href="#projects">projects</a>
              <a href="#experience">experience</a>
              <a href="#skills">skills</a>
              <a href="#contact">contact</a>
            </nav>
          </div>
        </header>

        <main id="top" className="container">
          {children}
        </main>

        <footer className="footer">
          <div className="container">
            <p style={{ margin: 0 }}>
              <span style={{ color: 'var(--comment)' }}>--</span> © {new Date().getFullYear()} Ayaan Hafeez <span style={{ color: 'var(--comment)' }}>|</span> built with next.js
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
