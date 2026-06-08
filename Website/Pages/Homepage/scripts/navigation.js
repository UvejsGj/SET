document.addEventListener("DOMContentLoaded", () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const MOBILE_BREAKPOINT = 760;
  const NAV_SCROLL_THRESHOLD = 22;
  let lastScrollY = window.scrollY;
  const progressFill = document.querySelector(".nav-progress-fill");

  // ─── Mobile menu ────────────────────────────────────────────────────────────
  let closeMobileNav = () => {};
  const navToggle = document.querySelector(".nav-toggle");
  const mainNav = document.getElementById("main-nav");
  const navOverlay = document.querySelector(".nav-overlay");

  if (navToggle && mainNav && navOverlay) {
    let lastFocused = null;

    const openMobileNav = () => {
      lastFocused = document.activeElement;
      document.body.classList.add("nav-open");
      navOverlay.hidden = false;
      navToggle.setAttribute("aria-expanded", "true");
      const icon = navToggle.querySelector(".material-symbols-outlined");
      if (icon) icon.textContent = "close";
      const firstLink = mainNav.querySelector("a");
      if (firstLink) firstLink.focus();
    };

    closeMobileNav = () => {
      document.body.classList.remove("nav-open");
      navOverlay.hidden = true;
      navToggle.setAttribute("aria-expanded", "false");
      const icon = navToggle.querySelector(".material-symbols-outlined");
      if (icon) icon.textContent = "menu";
      if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
    };

    const mobileNavOpen = () => document.body.classList.contains("nav-open");

    navToggle.addEventListener("click", () => (mobileNavOpen() ? closeMobileNav() : openMobileNav()));
    navOverlay.addEventListener("click", closeMobileNav);
    window.addEventListener("keydown", (e) => { if (e.key === "Escape" && mobileNavOpen()) closeMobileNav(); });
    window.addEventListener("resize", () => { if (window.innerWidth > MOBILE_BREAKPOINT && mobileNavOpen()) closeMobileNav(); });

    mainNav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => closeMobileNav()));
  }

  // ─── Anchor offset (cached, only recalculated on resize) ────────────────────
  // Reads the DOM once; scroll handler uses the cached value (no layout thrashing).
  let cachedAnchorOffset = 120;

  function recalcAnchorOffset() {
    let maxBottom = 0;
    const measure = (el) => {
      if (!el) return;
      if (getComputedStyle(el).display === "none") return;
      const r = el.getBoundingClientRect();
      if (r.width < 1 && r.height < 1) return;
      maxBottom = Math.max(maxBottom, r.bottom);
    };
    measure(document.querySelector(".navbarlogo"));
    measure(document.querySelector(".nav-toggle"));
    if (window.innerWidth > MOBILE_BREAKPOINT || document.body.classList.contains("nav-open")) {
      measure(document.querySelector(".navbar"));
    }
    cachedAnchorOffset = Math.max(72, Math.ceil(maxBottom + 20));
  }

  // ─── Smooth-scroll helpers ──────────────────────────────────────────────────
  function scrollToTarget(target, { smooth = true, extraDownPx = 0 } = {}) {
    if (!target) return;
    const y = target.getBoundingClientRect().top + window.scrollY - cachedAnchorOffset + extraDownPx;
    window.scrollTo({ top: Math.max(0, y), behavior: reduceMotion || !smooth ? "auto" : "smooth" });
  }

  function scrollToSectionId(id, opts) {
    const el = document.getElementById(id);
    if (!el) return;
    scrollToTarget(el, { ...opts, extraDownPx: id === "servicesection" ? 56 : 0 });
  }

  function normalizeHash(hash) {
    return String(hash).replace(/^#/, "").trim();
  }

  function goToHash(hash, { smooth = true, updateHistory = true } = {}) {
    if (!hash || hash === "#") return false;
    const id = normalizeHash(hash);
    if (!document.getElementById(id)) return false;
    closeMobileNav();
    requestAnimationFrame(() => requestAnimationFrame(() => {
      scrollToSectionId(id, { smooth });
      updateActiveNav();
    }));
    if (updateHistory) {
      try { history.pushState(null, "", `#${id}`); } catch { location.hash = `#${id}`; }
    }
    return true;
  }

  // Intercept all same-page anchor clicks
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    const raw = a.getAttribute("href");
    if (!raw || raw === "#") return;
    const id = normalizeHash(raw);
    if (!id || !document.getElementById(id)) return;
    a.addEventListener("click", (e) => { e.preventDefault(); goToHash(`#${id}`); });
  });

  // ─── Active-nav: nav links + ALL section elements for coverage ─────────────
  // Nav links that point to on-page IDs
  const navLinks = Array.from(document.querySelectorAll(".navbar a")).filter(
    (a) => a.hash && document.getElementById(normalizeHash(a.hash))
  );

  // All sections with IDs (including ones with no nav link) sorted by page order.
  // Each entry maps to the nearest preceding nav link, so the active pill is always
  // on the last nav item the user actually scrolled past.
  const ALL_SECTION_IDS = [
    "homesection", "aboutsection", "servicesection",
    "lifesection", "techstack", "team", "how-we-work", "featured-work",
    "contact", "faq",
  ];
  // Map: section id → nav-link id to highlight
  const NAV_MAP = {
    homesection:   "homesection",
    aboutsection:  "aboutsection",
    servicesection:"servicesection",
    lifesection:   "servicesection",
    techstack:     "servicesection",
    team:          "servicesection",
    "how-we-work": "contact",
    "featured-work":"contact",
    contact:       "contact",
    faq:           "faq",
  };

  // ─── Cached section tops (only recalculated on resize / load) ───────────────
  let sectionCache = []; // [{id, top, navId}]

  function cacheSectionTops() {
    sectionCache = ALL_SECTION_IDS
      .map((id) => {
        const el = document.getElementById(id);
        if (!el) return null;
        return { id, el, top: el.getBoundingClientRect().top + window.scrollY, navId: NAV_MAP[id] };
      })
      .filter(Boolean)
      .sort((a, b) => a.top - b.top);
  }

  // ─── Set active pill ────────────────────────────────────────────────────────
  function setActive(navId) {
    navLinks.forEach((a) => {
      const id = normalizeHash(a.hash);
      const isActive = id === navId;
      a.classList.toggle("active", isActive);
      if (isActive) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  }

  function updateActiveNav() {
    if (!sectionCache.length) return;
    const nearBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8;
    if (nearBottom) {
      setActive(sectionCache[sectionCache.length - 1].navId);
      return;
    }
    const line = window.scrollY + cachedAnchorOffset + 12;
    let current = sectionCache[0];
    for (const s of sectionCache) {
      if (s.top <= line) current = s;
    }
    setActive(current.navId);
  }

  // ─── Navbar hide / show on scroll ──────────────────────────────────────────
  function updateNavbarState() {
    const y = window.scrollY;
    const scrollingDown = y > lastScrollY + 4;
    const nearTop = y <= NAV_SCROLL_THRESHOLD;
    const isDesktop = window.innerWidth > MOBILE_BREAKPOINT;
    const drawerOpen = document.body.classList.contains("nav-open");

    document.body.classList.toggle("nav-scrolled", !nearTop);

    if (drawerOpen || !isDesktop || nearTop) {
      document.body.classList.remove("nav-hidden");
    } else if (scrollingDown) {
      document.body.classList.add("nav-hidden");
    } else {
      document.body.classList.remove("nav-hidden");
    }

    lastScrollY = y;
  }

  // ─── Scroll progress bar ───────────────────────────────────────────────────
  function updateScrollProgress() {
    if (!progressFill) return;
    const doc = document.documentElement;
    const maxScrollable = Math.max(1, doc.scrollHeight - window.innerHeight);
    const pct = Math.min(100, Math.max(0, (window.scrollY / maxScrollable) * 100));
    progressFill.style.width = `${pct.toFixed(2)}%`;
  }

  // ─── Scroll handler (reads NO layout properties — zero thrashing) ───────────
  let scrollTick = false;
  window.addEventListener("scroll", () => {
    if (scrollTick) return;
    scrollTick = true;
    requestAnimationFrame(() => {
      scrollTick = false;
      updateNavbarState();
      updateScrollProgress();
      updateActiveNav();
    });
  }, { passive: true });

  // ─── Resize: recalculate cached positions ──────────────────────────────────
  let resizeTimer = null;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      recalcAnchorOffset();
      cacheSectionTops();
      updateNavbarState();
      updateScrollProgress();
      updateActiveNav();
    }, 120);
  });

  // ─── Initial paint ─────────────────────────────────────────────────────────
  recalcAnchorOffset();
  cacheSectionTops();
  updateNavbarState();
  updateScrollProgress();
  updateActiveNav();

  // Handle URL hash on load
  if (location.hash) {
    const id = normalizeHash(location.hash);
    if (id && document.getElementById(id)) {
      requestAnimationFrame(() => requestAnimationFrame(() => {
        scrollToSectionId(id, { smooth: false });
        updateActiveNav();
      }));
    }
  }
});
