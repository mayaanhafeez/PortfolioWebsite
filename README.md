# portfolio v2

The next version of [ayaanhafeez.dev](https://www.ayaanhafeez.dev): a CRT terminal design
after the Terminal Mystery launch site (Rosé Pine on JetBrains Mono, block-letter banner,
boot-log hero, the game's status bar). Aimed at software internships: backend, AI tooling,
and apps, with systems as an interest.

Right now it is a static site in `public/`: `index.html`, `styles.css`, and `script.js` (only the optional
`:` command line). `CONTENT.md` is the fact-checked source for every claim on the page.

```bash
python3 -m http.server 4100 -d public   # then open http://127.0.0.1:4100/
```

## Deploying

v1 (the Neovim Next.js site) is tagged `v1`. The Vercel project is set up as Next.js, so
`vercel.json` switches it to a static site: no install or build step, serve `public/`. It also
redirects `/opengraph-image` (v1's generated preview image) to `public/og.png`, so links shared
under v1 keep a preview. `vercel build` passes locally with it and fails without it.

`/resume.pdf` and `/Ayaan_Hafeez_Resume.pdf` must keep working; past applications link to them.

Plan: push `v2` for a Vercel preview URL, check it, then merge into `main`.
