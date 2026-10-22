import "./globals.css";

const DESCRIPTION =
  "4th-year Computer Engineering (Software Option) student at the University of Alberta. " +
  "AI Developer co-op at Elev8AI; merged open-source PRs to Omarchy and Vorssaint; projects in Rust, C, and Python.";

export const metadata = {
  // resolves the opengraph-image URL to an absolute one for link previews
  metadataBase: new URL("https://www.ayaanhafeez.dev"),
  title: "Ayaan Hafeez — Software Developer, Computer Engineering @ UAlberta",
  description: DESCRIPTION,
  openGraph: {
    title: "Ayaan Hafeez",
    description: DESCRIPTION,
    url: "/",
    siteName: "Ayaan Hafeez",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ayaan Hafeez",
    description: DESCRIPTION,
  },
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
