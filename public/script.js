// Optional easter egg: ":" opens a vim-style command line in the status bar.
// ":projects", ":oss", ":3" jump to a section, ":q" goes back to the top.
// The page is complete without this file.
(() => {
  const form = document.querySelector(".cmdline");
  const input = document.getElementById("cmd");
  const bar = document.querySelector(".status-bar");
  if (!form || !input) return;

  const order = ["experience", "open-source", "projects", "more", "skills", "education", "contact"];
  const alias = { exp: "experience", oss: "open-source", os: "open-source", proj: "projects", edu: "education", mail: "contact" };

  const close = () => { form.hidden = true; bar.hidden = false; input.value = ""; };
  const flash = (msg) => { bar.firstElementChild.textContent = msg; setTimeout(() => (bar.firstElementChild.textContent = "user: guest"), 2500); };

  document.addEventListener("keydown", (e) => {
    const t = e.target;
    if (e.key !== ":" || e.metaKey || e.ctrlKey || e.altKey) return;
    if (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
    e.preventDefault();
    form.hidden = false;
    bar.hidden = true;
    input.focus();
  });

  input.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
  input.addEventListener("blur", close);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const raw = input.value.trim().toLowerCase().replace(/^:/, "");
    close();
    if (raw === "q" || raw === "top" || raw === "") {
      window.scrollTo({ top: 0 });
      return document.dispatchEvent(new CustomEvent("section:jump", { detail: "top" }));
    }
    const id = alias[raw] || (order[Number(raw) - 1]) || (order.includes(raw) ? raw : null);
    const el = id && document.getElementById(id);
    if (el) {
      el.scrollIntoView();
      document.dispatchEvent(new CustomEvent("section:jump", { detail: id }));
    }
    else flash(`E492: Not an editor command: ${raw}`);
  });

  bar.querySelector(".hint").textContent = "type : for commands";
})();

// Mark the section in view on the tab bar, the way tmux marks the active window.
// A clicked tab (or a ":" jump) stays marked until the reader scrolls themselves:
// the last few sections are short, so the page often bottoms out before the
// target reaches the top, and a position-based guess would pick a neighbour.
(() => {
  const bar = document.querySelector(".tabs");
  const list = document.querySelector(".tab-list");
  if (!bar || !list) return;
  const links = new Map([...list.querySelectorAll("a")].map((a) => [a.hash.slice(1), a]));
  const sections = [...links.keys()].map((id) => document.getElementById(id)).filter(Boolean);
  let pinned = null;

  const mark = (id) => {
    links.forEach((a, key) => (key === id ? a.setAttribute("aria-current", "true") : a.removeAttribute("aria-current")));
    const a = links.get(id);
    // keep the active tab visible when the bar is scrolled sideways on a phone
    if (a && (a.offsetLeft < list.scrollLeft || a.offsetLeft + a.offsetWidth > list.scrollLeft + list.clientWidth)) {
      list.scrollLeft = a.offsetLeft - 16;
    }
  };

  // the last section whose top has passed a line a little below the bar; at the very
  // bottom of the page, the last section
  const inView = () => {
    const doc = document.documentElement;
    if (window.scrollY + window.innerHeight >= doc.scrollHeight - 2) return sections[sections.length - 1].id;
    const line = bar.offsetHeight + window.innerHeight * 0.25;
    let id = sections[0].id;
    for (const el of sections) if (el.getBoundingClientRect().top <= line) id = el.id;
    return id;
  };

  let queued = false;
  const update = () => {
    queued = false;
    mark(pinned || inView());
  };
  window.addEventListener("scroll", () => { if (!queued) { queued = true; requestAnimationFrame(update); } }, { passive: true });

  const pin = (id) => { if (links.has(id)) { pinned = id; mark(id); } };
  const unpin = () => { if (pinned) { pinned = null; update(); } };
  list.addEventListener("click", (e) => { const a = e.target.closest("a"); if (a) pin(a.hash.slice(1)); });
  document.addEventListener("section:jump", (e) => pin(e.detail));
  // only the reader's own scrolling releases a pinned tab, not the smooth scroll a click starts
  ["wheel", "touchmove"].forEach((t) => window.addEventListener(t, unpin, { passive: true }));
  window.addEventListener("keydown", (e) => {
    if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(e.key)) unpin();
  });

  if (location.hash) pin(location.hash.slice(1));
  update();
})();
