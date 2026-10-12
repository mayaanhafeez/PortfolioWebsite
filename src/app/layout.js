import "./globals.css";

export const metadata = {
  title: "Ayaan Hafeez | Portfolio",
  description: "AI Developer @ Elev8AI — projects, experience, and contact.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    // browser extensions (e.g. page-zoom ones adding style="zoom: 1") edit
    // <html> before React hydrates; this only silences mismatches on its own attributes
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}
      </body>
    </html>
  );
}
