import { ImageResponse } from "next/og";

// Link preview card for LinkedIn, Slack, iMessage, etc. — Tokyo Night palette
// to match the default theme.
export const alt = "Ayaan Hafeez — Computer Engineering student and software developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 96px",
          background: "#1a1b26",
          color: "#c0caf5",
          fontFamily: "monospace",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, color: "#565f89", marginBottom: 24 }}>
          ~/ayaanhafeez.dev
        </div>
        <div style={{ display: "flex", fontSize: 88, fontWeight: 800 }}>
          Ayaan Hafeez<span style={{ color: "#9ece6a" }}>.</span>
        </div>
        <div style={{ display: "flex", fontSize: 32, color: "#7aa2f7", marginTop: 20 }}>
          Computer Engineering (Software Option) · University of Alberta
        </div>
        <div style={{ display: "flex", fontSize: 26, color: "#a9b1d6", marginTop: 28 }}>
          AI Developer co-op @ Elev8AI · open source: Omarchy, Vorssaint, Hyprspace
        </div>
      </div>
    ),
    size,
  );
}
