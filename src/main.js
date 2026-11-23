/* global St */
// THE EDITORIAL — left-flipping magazine portfolio.
// Pages are PNG exports of the Figma frames, bound into a book with StPageFlip:
// "next" flips the right-hand page to the left, exactly like reading a magazine.

/* ---------- hotspots: rebuild the Figma prototype links over the page images ----------
   Coordinates are percentages of the 900x1200 Figma frame, read from the
   design's own ON_CLICK interactions (contents chapter jumps + work callouts). */
const HOTSPOTS = {
  // Contents (page index 2) — chapter rows jump to sections
  2: [
    { x: 7.11, y: 14.33, w: 85.78, h: 10.0,  label: "Ch. 1 — Cover",         page: 0 },
    { x: 7.11, y: 41.0,   w: 85.78, h: 10.0,  label: "Ch. 3 — Editor’s Note", page: 4 },
    { x: 7.11, y: 54.33,  w: 85.78, h: 10.0,  label: "Ch. 4 — Profile",       page: 6 },
    { x: 7.11, y: 67.67,  w: 85.78, h: 10.0,  label: "Ch. 5 — Portfolio",     page: 8 },
    { x: 7.11, y: 81.0,   w: 85.78, h: 10.0,  label: "Ch. 6 — Contact",       page: 18 },
  ],
  // Profile 05 right (index 8) — work list jumps to each project
  8: [
    { x: 7.11, y: 28.0,  w: 85.78, h: 4.6, label: "Work 01 — Towngas ESG AI Video", page: 10 },
    { x: 7.11, y: 42.6,  w: 85.78, h: 4.6, label: "Work 02 — App demo",           page: 12 },
    { x: 7.11, y: 57.2,  w: 85.78, h: 4.6, label: "Work 03 — SCOM Lab website",   page: 14 },
    { x: 7.11, y: 71.8,  w: 85.78, h: 4.6, label: "Work 04 — Editorial spreads",  page: 16 },
  ],
  // Work 01 (index 10) — WATCH FILM
  10: [{ x: 7.11, y: 87.9, w: 20.0, h: 3.4, label: "Watch the Towngas ESG AI Video film", url: "https://youtu.be/0X62aiu1C1k?feature=shared" }],
  // Work 02 (index 12) — APP DEMO
  12: [{ x: 7.11, y: 88.4, w: 22.0, h: 3.4, label: "Watch the app demo", url: "https://youtube.com/shorts/1kcWfkxg95M?feature=shared" }],
  // Work 03 (index 14) — WEBSITE
  14: [{ x: 7.11, y: 87.9, w: 21.0, h: 3.4, label: "Open the SCOM Lab website", url: "https://scomlab.hsu.edu.hk/~s235077/GROUP2%20CMT3001/login.php" }],
  // Work 04 (index 16) — OPEN SPREADS
  16: [{ x: 7.11, y: 91.1, w: 22.0, h: 3.4, label: "Open the full spreads", url: "https://hsuhk-my.sharepoint.com/:f:/g/personal/s235074_hsu_edu_hk/IgBowLqmFaJGRKpdStzwKrS5AQN1plbPnXIEWFGGrEf9-3I?e=YqD5fU" }],
};

function addHotspots(pageEl, pageIndex) {
  const spots = HOTSPOTS[pageIndex];
  if (!spots) return;
  for (const s of spots) {
    const a = document.createElement("a");
    a.className = "hotspot";
    a.style.left = s.x + "%";
    a.style.top = s.y + "%";
    a.style.width = s.w + "%";
    a.style.height = s.h + "%";
    a.setAttribute("aria-label", s.label);
    if (s.url) {
      a.href = s.url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    } else {
      a.href = "javascript:void(0)"; // real action via click handler (internal jump)
      a.addEventListener("click", (e) => {
        e.preventDefault();
        goTo(s.page);
      });
    }
    // keep the book's own click-to-flip from firing on top of the link
    ["click", "touchend", "mousedown", "touchstart"].forEach((ev) =>
      a.addEventListener(ev, (e) => e.stopPropagation(), { passive: ev !== "click" })
    );
    pageEl.appendChild(a);
  }
}

const PAGES = [
  { src: "page-01-cover.png",                alt: "Cover — THE EDITORIAL, Issue 01" },
  { src: "page-02-blank-verso.png",          alt: "Inside cover (blank verso)" },
  { src: "page-03-contents.png",             alt: "Contents — Issue 01" },
  { src: "page-04-editors-note-portrait.png",alt: "Editor’s Note — portrait page" },
  { src: "page-05-editors-note-story.png",   alt: "Editor’s Note — a story with creativity" },
  { src: "page-06-profile-04-left.png",      alt: "Profile 04 — left page" },
  { src: "page-07-profile-04-right.png",     alt: "Profile 04 — right page" },
  { src: "page-08-profile-05-left.png",      alt: "Profile 05 — left page" },
  { src: "page-09-profile-05-right.png",     alt: "Profile 05 — selected works list" },
  { src: "page-10-work1-left.png",           alt: "Work 01 — left page" },
  { src: "page-11-work1-right.png",          alt: "Work 01 — Towngas ESG AI Video" },
  { src: "page-12-work2-left.png",           alt: "Work 02 — left page" },
  { src: "page-13-work2-right.png",          alt: "Work 02 — right page" },
  { src: "page-14-work3-left.png",           alt: "Work 03 — left page" },
  { src: "page-15-work3-right.png",          alt: "Work 03 — right page" },
  { src: "page-16-work4-left.png",           alt: "Work 04 — left page" },
  { src: "page-17-work4-right.png",          alt: "Work 04 — right page" },
  { src: "page-18-contact-left.png",         alt: "Contact — left page" },
  { src: "page-19-contact-right.png",        alt: "Contact — right page" },
];

const PAGE_W = 900;   // Figma frame width  (3:4 portrait page)
const PAGE_H = 1200;  // Figma frame height

const bookEl    = document.getElementById("book");
const prevBtn   = document.getElementById("prev");
const nextBtn   = document.getElementById("next");
const pageLabel = document.getElementById("pageLabel");
const thumb     = document.getElementById("thumb");
const loaderEl  = document.getElementById("loader");
const loadbar   = document.getElementById("loadbar");

const state = { flip: null, index: 0, flipping: false };

/* ---------- sizing ---------- */

function computeSize() {
  const chrome =
    document.querySelector(".topbar").offsetHeight +
    document.querySelector(".controls").offsetHeight;
  const availW = window.innerWidth - 40;
  const availH = window.innerHeight - chrome - 56;
  // single-page (portrait) when the screen is taller than wide or narrow
  const portrait = window.innerWidth < 760 || availH > availW * 1.1;
  if (portrait) {
    const k = Math.max(0.2, Math.min(availW / PAGE_W, availH / PAGE_H));
    return { pageW: Math.round(PAGE_W * k), pageH: Math.round(PAGE_H * k), portrait };
  }
  const k = Math.max(0.2, Math.min(availW / (PAGE_W * 2), availH / PAGE_H));
  return { pageW: Math.round(PAGE_W * k), pageH: Math.round(PAGE_H * k), portrait };
}

/* ---------- book construction ---------- */

function buildBook() {
  const { pageW, pageH, portrait } = computeSize();
  const parent = bookEl.parentNode;

  if (state.flip) {
    try { state.flip.destroy(); } catch (_) { /* already gone */ }
    // StPageFlip#destroy removes the block element itself — put it back
    if (!bookEl.isConnected) parent.appendChild(bookEl);
    state.flip = null;
    bookEl.innerHTML = "";
  }

  bookEl.style.width  = (portrait ? pageW : pageW * 2) + "px";
  bookEl.style.height = pageH + "px";

  const flip = new St.PageFlip(bookEl, {
    width: pageW,
    height: pageH,
    size: "fixed",
    showCover: true,          // page 1 (and the last) sit alone, like a real issue
    usePortrait: portrait,
    mobileScrollSupport: false,
    drawShadow: true,
    maxShadowOpacity: 0.32,
    flippingTime: 850,
    swipeDistance: 24,
    clickForward: { x: 0.6, y: 0.5 },   // tap the right page → it flips left
  });

  const items = PAGES.map((p, i) => {
    const page = document.createElement("div");
    page.className = "page";
    const img = document.createElement("img");
    img.src = "pages/" + p.src;
    img.alt = p.alt;
    img.draggable = false;
    page.appendChild(img);
    addHotspots(page, i);
    return page;
  });

  flip.loadFromHTML(items);

  flip.on("flip", () => {
    state.index = flip.getCurrentPageIndex();
    state.flipping = false;
    updateUI();
  });
  flip.on("changeState", (e) => {
    state.flipping = e.data === "flipping";
  });

  state.flip = flip;
  // expose for diagnostics / e2e checks
  window.__editorial = { state, flip: () => state.flip, pages: PAGES.length };
  updateUI();
  return flip;
}

function goTo(i) {
  if (!state.flip) return;
  const target = Math.max(0, Math.min(PAGES.length - 1, i));
  if (target === state.index) return;
  if (state.flipping) return;
  state.flip.turnToPage(target);
}

/* ---------- UI ---------- */

function updateUI() {
  const total = PAGES.length;
  const idx = state.index;
  const pad = (n) => String(n).padStart(2, "0");
  thumb.style.width = ((idx + 1) / total) * 100 + "%";
  // with showCover, spreads are [1–2], [3–4], …; show the open spread as a range
  if (idx === 0) {
    pageLabel.textContent = "Cover";
  } else if (idx === total - 1) {
    pageLabel.textContent = pad(total) + " / " + total;
  } else if (idx % 2 === 1 && idx + 1 <= total - 2) {
    pageLabel.textContent = pad(idx + 1) + " – " + pad(idx + 2) + " / " + total;
  } else {
    pageLabel.textContent = pad(idx + 1) + " / " + total;
  }
  prevBtn.disabled = idx <= 0;
  nextBtn.disabled = idx >= total - 1;
}

prevBtn.addEventListener("click", () => {
  if (state.flip && !state.flipping) state.flip.flipPrev("top");
});
nextBtn.addEventListener("click", () => {
  if (state.flip && !state.flipping) state.flip.flipNext("top");
});

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") {
    e.preventDefault();
    if (state.flip && !state.flipping) state.flip.flipNext("top");
  } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
    e.preventDefault();
    if (state.flip && !state.flipping) state.flip.flipPrev("top");
  } else if (e.key === "Home") {
    goTo(0);
  } else if (e.key === "End") {
    goTo(PAGES.length - 1);
  }
});

/* ---------- resize (rebuild, keep the current page) ---------- */

let resizeTimer = null;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    const keep = state.index;
    buildBook();
    if (keep > 0) goTo(keep);
  }, 220);
});

/* ---------- boot: bind the book now, track image loading ---------- */

buildBook();

let loaded = 0;
const preload = PAGES.map(
  (p) =>
    new Promise((resolve) => {
      const im = new Image();
      const done = () => {
        loaded += 1;
        loadbar.style.width = (loaded / PAGES.length) * 100 + "%";
        resolve();
      };
      im.onload = done;
      im.onerror = done;
      im.src = "pages/" + p.src;
    })
);
Promise.all(preload).then(() => loaderEl.classList.add("done"));
