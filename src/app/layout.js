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
            <a className="brand" href="#top">Ayaan</a>
            <nav className="links">
              <a href="#projects">Projects</a>
              <a href="#experience">Experience</a>
              <a href="#skills">Skills</a>
              <a href="#contact">Contact</a>
            </nav>
          </div>
        </header>

        <main id="top" className="container">
          {children}
        </main>

        <footer className="footer">
          <div className="container">
            <p>© {new Date().getFullYear()} Ayaan Hafeez</p>
          </div>
        </footer>
      </body>
    </html>
  );
}

