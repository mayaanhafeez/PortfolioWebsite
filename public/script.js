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
    if (raw === "q" || raw === "top" || raw === "") return window.scrollTo({ top: 0 });
    const id = alias[raw] || (order[Number(raw) - 1]) || (order.includes(raw) ? raw : null);
    const el = id && document.getElementById(id);
    if (el) el.scrollIntoView();
    else flash(`E492: Not an editor command: ${raw}`);
  });

  bar.querySelector(".hint").textContent = "type : for commands";
})();

// Mark the section in view on the tab bar, the way tmux marks the active window.
(() => {
  const bar = document.querySelector(".tabs");
  if (!bar || !("IntersectionObserver" in window)) return;
  const links = new Map([...bar.querySelectorAll("a")].map((a) => [a.hash.slice(1), a]));
  const mark = (id) => {
    links.forEach((a, key) => (key === id ? a.setAttribute("aria-current", "true") : a.removeAttribute("aria-current")));
    const a = links.get(id);
    // keep the active tab visible when the bar is scrolled sideways on a phone
    if (a && (a.offsetLeft < bar.scrollLeft || a.offsetLeft + a.offsetWidth > bar.scrollLeft + bar.clientWidth)) {
      bar.scrollLeft = a.offsetLeft - 16;
    }
  };
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && mark(e.target.id)),
    { rootMargin: "-45% 0px -50% 0px" } // the section crossing the middle of the screen
  );
  links.forEach((_, id) => { const el = document.getElementById(id); if (el) io.observe(el); });
})();
