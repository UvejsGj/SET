document.addEventListener("DOMContentLoaded", () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
// Mobile menu
  let closeMobileNav = () => {};
  const navToggle = document.querySelector(".nav-toggle");
  const mainNav = document.getElementById("main-nav");
  const navOverlay = document.querySelector(".nav-overlay");

  if (navToggle && mainNav && navOverlay) {
    const openMobileNav = () => {
      document.body.classList.add("nav-open");
      navOverlay.hidden = false;
      navToggle.setAttribute("aria-expanded", "true");
      const icon = navToggle.querySelector(".material-symbols-outlined");
      if (icon) icon.textContent = "close";
    };

    closeMobileNav = () => {
      document.body.classList.remove("nav-open");
      navOverlay.hidden = true;
      navToggle.setAttribute("aria-expanded", "false");
      const icon = navToggle.querySelector(".material-symbols-outlined");
      if (icon) icon.textContent = "menu";
    };

    const mobileNavOpen = () => document.body.classList.contains("nav-open");

    navToggle.addEventListener("click", () => (mobileNavOpen() ? closeMobileNav() : openMobileNav()));
    navOverlay.addEventListener("click", closeMobileNav);

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && mobileNavOpen()) closeMobileNav();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 760 && mobileNavOpen()) closeMobileNav();
    });
  }

  // # links: line up under the fixed header
  const MOBILE_NAV_MAX = 760;

  // How tall is the sticky header area (logo, bar, menu button). Skip the bar on mobile when it's hidden.
  function getAnchorOffsetPx() {
    const w = window.innerWidth;
    const isMobile = w <= MOBILE_NAV_MAX;
    const drawerOpen = document.body.classList.contains("nav-open");

    let maxBottom = 0;
    const useRect = (el) => {
      if (!el) return;
      const st = getComputedStyle(el);
      if (st.display === "none") return;
      const r = el.getBoundingClientRect();
      if (r.width < 1 && r.height < 1) return;
      maxBottom = Math.max(maxBottom, r.bottom);
    };

    useRect(document.querySelector(".navbarlogo"));
    useRect(document.querySelector(".nav-toggle"));

    if (!isMobile || drawerOpen) {
      useRect(document.querySelector(".navbar"));
    }

    const gap = 20;
    return Math.max(72, Math.ceil(maxBottom + gap));
  }

  const NAV_SCROLL_EXTRA_DOWN = {
    servicesection: 56,
    portfolio: 12,
  };

  function getNavScrollAnchor(id) {
    const root = document.getElementById(id);
    if (!root) return null;
    if (id === "portfolio") {
      const heading = root.querySelector(":scope > h2.section-title");
      if (heading) return heading;
    }
    return root;
  }

  function scrollToTarget(target, { smooth = true, extraDownPx = 0 } = {}) {
    if (!target) return;
    const y =
      target.getBoundingClientRect().top + window.scrollY - getAnchorOffsetPx() + extraDownPx;
    window.scrollTo({
      top: Math.max(0, y),
      behavior: reduceMotion || !smooth ? "auto" : "smooth",
    });
  }

  function scrollToSectionId(id, { smooth = true } = {}) {
    const anchor = getNavScrollAnchor(id);
    if (!anchor) return;
    const extra = NAV_SCROLL_EXTRA_DOWN[id] ?? 0;
    scrollToTarget(anchor, { smooth, extraDownPx: extra });
  }

  function goToHash(hash, { smooth = true, updateHistory = true } = {}) {
    if (!hash || hash === "#") return false;
    const id = normalizeHash(hash);
    if (!document.getElementById(id)) return false;

    closeMobileNav();
    const run = () => {
      scrollToSectionId(id, { smooth });
      updateActiveNavFromScroll();
    };
    requestAnimationFrame(() => {
      requestAnimationFrame(run);
    });
    if (updateHistory) {
      try {
        history.pushState(null, "", `#${id}`);
      } catch {
        location.hash = `#${id}`;
      }
    }
    return true;
  }

  function normalizeHash(hash) {
    return String(hash).replace(/^#/, "").trim();
  }

  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    const raw = a.getAttribute("href");
    if (!raw || raw === "#") return;
    const id = normalizeHash(raw);
    if (!id || !document.getElementById(id)) return;

    a.addEventListener("click", (e) => {
      e.preventDefault();
      goToHash(`#${id}`, { smooth: true, updateHistory: true });
    });
  });

  const navLinks = Array.from(document.querySelectorAll(".navbar a")).filter(
    (a) => a.hash && document.getElementById(normalizeHash(a.hash))
  );
  const sections = navLinks
    .map((a) => document.getElementById(normalizeHash(a.hash)))
    .filter(Boolean)
    .sort((a, b) => {
      const ta = a.getBoundingClientRect().top + window.scrollY;
      const tb = b.getBoundingClientRect().top + window.scrollY;
      return ta - tb;
    });

  const setActive = (id) => {
    navLinks.forEach((a) => a.classList.toggle("active", normalizeHash(a.hash) === id));
  };

  function updateActiveNavFromScroll() {
    if (!sections.length) return;
    const line = window.scrollY + getAnchorOffsetPx() + 12;
    let currentId = sections[0].id;
    for (const sec of sections) {
      const top = sec.getBoundingClientRect().top + window.scrollY;
      if (top <= line) currentId = sec.id;
    }
    setActive(currentId);
  }

  let navScrollTick = false;
  window.addEventListener(
    "scroll",
    () => {
      if (navScrollTick) return;
      navScrollTick = true;
      requestAnimationFrame(() => {
        navScrollTick = false;
        updateActiveNavFromScroll();
      });
    },
    { passive: true }
  );

  let resizeNavTimer = null;
  window.addEventListener("resize", () => {
    window.clearTimeout(resizeNavTimer);
    resizeNavTimer = window.setTimeout(() => updateActiveNavFromScroll(), 100);
  });

  updateActiveNavFromScroll();

  if (location.hash) {
    const id = normalizeHash(location.hash);
    if (id && document.getElementById(id)) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          scrollToSectionId(id, { smooth: false });
          updateActiveNavFromScroll();
        });
      });
    }
  }

// Nav link in mobile menu: close the drawer
  if (mainNav) {
    mainNav.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => closeMobileNav());
    });
  }
});
