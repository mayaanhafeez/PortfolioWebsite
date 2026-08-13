"use client";

/* Toast notifications — a small stack in the top-right corner that reports
   state changes (theme, style, navigation, opened links, command errors).

   Each toast is a rectangle whose corner rounding comes from --radius-md, so
   it follows the active style (square-ish on legacy/rice, rounded on acrylic),
   and carries an accent border in the same color as the nav focus ring
   (--cyan) — errors and warnings override that accent. Icons are inline SVG
   (no icon dependency), stroked in the accent color. */

const ICONS = {
  // palette — theme changes
  theme: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="8.5" cy="9.5" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="9.5" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="9.5" cy="15" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="14.5" cy="15" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),
  // stacked layers — style changes
  style: (
    <>
      <path d="M12 3 3 7.5l9 4.5 9-4.5L12 3Z" />
      <path d="m3 12.5 9 4.5 9-4.5" />
      <path d="m3 17 9 4.5L21 17" />
    </>
  ),
  // arrow leaving a box — external links
  link: (
    <>
      <path d="M14 4h6v6" />
      <path d="M20 4 11 13" />
      <path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
    </>
  ),
  // document — section navigation
  section: (
    <>
      <path d="M14 3H7a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7l-4-4Z" />
      <path d="M14 3v4h4" />
      <path d="M9 13h6M9 17h4" />
    </>
  ),
  // window — view changes (dashboard / editor)
  view: (
    <>
      <rect x="3" y="4" width="18" height="14" rx="1.5" />
      <path d="M3 8.5h18" />
      <path d="M8 21h8" />
    </>
  ),
  // sparkle — AI assistant actions
  ai: (
    <>
      <path d="M12 3.5 13.7 9l5.5 1.7-5.5 1.7L12 18l-1.7-5.6L4.8 10.7 10.3 9 12 3.5Z" />
      <path d="M18.5 16.5 19.2 18.6 21.3 19.3 19.2 20 18.5 22.1 17.8 20 15.7 19.3 17.8 18.6 18.5 16.5Z" />
    </>
  ),
  // clipboard — copied to clipboard
  copy: (
    <>
      <rect x="8" y="8" width="12" height="12" rx="1.5" />
      <path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3" />
    </>
  ),
  // check — generic success
  success: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12.2 2.8 2.8L16 9.8" />
    </>
  ),
  // triangle bang — errors
  error: (
    <>
      <path d="M12 4 2.8 20h18.4L12 4Z" />
      <path d="M12 10v4.5" />
      <circle cx="12" cy="17.4" r=".9" fill="currentColor" stroke="none" />
    </>
  ),
  // i in a circle — neutral info
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5.5" />
      <circle cx="12" cy="7.9" r=".9" fill="currentColor" stroke="none" />
    </>
  ),
};

function ToastIcon({ type }) {
  return (
    <svg
      className="toastIcon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICONS[type] ?? ICONS.info}
    </svg>
  );
}

export default function ToastStack({ toasts, onDismiss }) {
  if (toasts.length === 0) return null;

  return (
    <div className="toastStack" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`toast ${t.type}${t.leaving ? " leaving" : ""}`}
          onClick={() => onDismiss(t.id)}
          title="dismiss"
        >
          <ToastIcon type={t.type} />
          <div className="toastText">
            <span className="toastTitle">{t.title}</span>
            {t.detail && <span className="toastDetail">{t.detail}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}
