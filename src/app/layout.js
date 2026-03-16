import "./globals.css";

export const metadata = {
  title: "Ayaan Hafeez | Portfolio",
  description: "AI Developer @ Elev8AI — projects, experience, and contact.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
