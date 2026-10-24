# portfolio v2

The next version of [ayaanhafeez.dev](https://www.ayaanhafeez.dev): a CRT terminal design
after the Terminal Mystery launch site (Rosé Pine on JetBrains Mono, block-letter banner,
boot-log hero, the game's status bar). Aimed at backend, AI systems, and systems
programming internships.

Right now it is a static site in `public/`: `index.html`, `styles.css`, and `script.js` (only the optional
`:` command line). `CONTENT.md` is the fact-checked source for every claim on the page.

```bash
python3 -m http.server 4100 -d public   # then open http://127.0.0.1:4100/
```

## Rules the design keeps

- **No gradients.** Flat colour only. The scanlines are a tiled 4×3 SVG stripe; the power-on
  is two flat panels opening from a glowing centre line. Text glow is `text-shadow`.
- **Parsable.** Every word of content is in the HTML source, and the page works with JS off.
  `curl … | grep -i rust` must find content. One `h1` (the name, as real text; the ASCII
  banner is `aria-hidden` decoration), an `h2` per section, an `article` + `h3` per project.
- **First screen.** Name, pitch, and Resume / GitHub / LinkedIn / Email are visible without
  scrolling at 1280×800, 390×844 and 360×740. No keyboard shortcut is ever required.
- **Section order:** hero → experience → open source → featured projects → more projects →
  skills → education → contact.
- **Honest content.** Only what `CONTENT.md` states: no invented metrics, users, or dates.
- **Mobile and a11y.** No horizontal scroll from 320px up, 44px tap targets, AA contrast,
  visible focus, and `prefers-reduced-motion` turns off the power-on, flicker, glow pulse, and
  cursor blink.
- **Light.** HTML + CSS + JS under 100 KB.

## Dropped from the Terminal Mystery look

The vignette, glass glare and rolling band (each is a gradient), and the barrel warp (it
would distort a long scrolling page).

## Before this replaces `main`

v1 (the Neovim Next.js site) is tagged `v1`. Before merging this branch into `main`:

- Keep `/resume.pdf` and `/Ayaan_Hafeez_Resume.pdf` working; past applications link to them.
- Bring back a link-preview image at `/opengraph-image` (v1 generated it in Next.js), or point
  `og:image` somewhere that exists.
- Vercel's project is set up for Next.js; a static `public/` site needs its framework preset and
  output directory changed (or the site ported back into Next.js).
