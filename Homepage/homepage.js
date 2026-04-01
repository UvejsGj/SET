// Nav, jump to sections, portfolio slider, hamburger menu

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

  // Some sections need a few extra pixels down after the header gap
  const NAV_SCROLL_EXTRA_DOWN = {
    servicesection: 56,
    portfolio: 12,
  };

  // What we scroll to (portfolio = the big title, not the slider box)
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

  // Nav highlight: uses scroll + section order on the page
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

  // Culture cards: fade in when they scroll into view
  const cultureCards = document.querySelectorAll(".culture-card");
  if (cultureCards.length) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    cultureCards.forEach((card) => observer.observe(card));
  }

  // Portfolio slider
  (() => {
    const shell = document.querySelector(".portfolio-shell");
    const viewport = document.querySelector(".portfolio-viewport");
    const track = document.querySelector(".portfolio-track");
    const slides = Array.from(document.querySelectorAll(".portfolio-slide"));
    const dotsWrap = document.querySelector(".portfolio-dots");
    const prevBtn = document.querySelector(".portfolio-arrow.prev");
    const nextBtn = document.querySelector(".portfolio-arrow.next");

    if (!shell || !viewport || !track || !slides.length || !dotsWrap || !prevBtn || !nextBtn) return;

    let index = 0;
    let isDragging = false;
    let startX = 0;
    let startTranslate = 0;

    dotsWrap.innerHTML = "";
    const dots = slides.map((_, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", `Go to slide ${i + 1}`);
      b.addEventListener("click", () => goTo(i));
      dotsWrap.appendChild(b);
      return b;
    });

    const slideWidth = () => viewport.getBoundingClientRect().width;

    function update() {
      track.style.transform = `translateX(${-index * slideWidth()}px)`;
      dots.forEach((d, i) => d.classList.toggle("active", i === index));
    }

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      track.style.transition = "transform 520ms cubic-bezier(.22,.61,.36,1)";
      update();
    }

    function next() {
      goTo(index + 1);
    }
    function prev() {
      goTo(index - 1);
    }

    prevBtn.addEventListener("click", prev);
    nextBtn.addEventListener("click", next);

    window.addEventListener("keydown", (e) => {
      const inViewport =
        viewport.getBoundingClientRect().top < window.innerHeight &&
        viewport.getBoundingClientRect().bottom > 0;
      if (!inViewport) return;
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    });

    const pointerDown = (clientX) => {
      isDragging = true;
      startX = clientX;
      startTranslate = -index * slideWidth();
      track.style.transition = "none";
    };

    const pointerMove = (clientX) => {
      if (!isDragging) return;
      const dx = clientX - startX;
      track.style.transform = `translateX(${startTranslate + dx}px)`;
    };

    const pointerUp = (clientX) => {
      if (!isDragging) return;
      isDragging = false;
      const dx = clientX - startX;
      const threshold = slideWidth() * 0.18;
      if (dx > threshold) prev();
      else if (dx < -threshold) next();
      else goTo(index);
    };

    viewport.addEventListener("mousedown", (e) => pointerDown(e.clientX));
    window.addEventListener("mousemove", (e) => pointerMove(e.clientX));
    window.addEventListener("mouseup", (e) => pointerUp(e.clientX));

    viewport.addEventListener("touchstart", (e) => pointerDown(e.touches[0].clientX), { passive: true });
    viewport.addEventListener("touchmove", (e) => pointerMove(e.touches[0].clientX), { passive: true });
    viewport.addEventListener(
      "touchend",
      (e) => pointerUp((e.changedTouches[0] || {}).clientX || startX),
      { passive: true }
    );

    window.addEventListener("resize", () => goTo(index));
    update();
  })();

  // Contact form (FormSubmit — first-time setup needs email confirmation from their service)
  const contactForm = document.getElementById("contact-form");
  const contactStatus = document.getElementById("contact-form-status");
  if (contactForm && contactStatus) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector(".contact-submit");
      const rawAction = contactForm.getAttribute("action") || "";
      let ajaxUrl = rawAction;
      if (rawAction.includes("formsubmit.co") && !rawAction.includes("/ajax/")) {
        ajaxUrl = rawAction.replace(
          /^https:\/\/formsubmit\.co\//i,
          "https://formsubmit.co/ajax/"
        );
      }
      if (!rawAction.includes("formsubmit.co")) {
        contactStatus.hidden = false;
        contactStatus.className = "contact-form-status contact-form-status--err";
        contactStatus.textContent =
          "Form address missing. Set the form action in the HTML to your FormSubmit link.";
        return;
      }
      contactStatus.hidden = false;
      contactStatus.className = "contact-form-status contact-form-status--busy";
      contactStatus.textContent = "Sending…";
      if (submitBtn) submitBtn.disabled = true;
      try {
        const res = await fetch(ajaxUrl, {
          method: "POST",
          body: new FormData(contactForm),
          headers: { Accept: "application/json" },
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data.message || data.error || "Request failed");
        }
        contactStatus.className = "contact-form-status contact-form-status--ok";
        contactStatus.textContent =
          "Thanks — your message was sent. We will get back to you soon.";
        contactForm.reset();
      } catch (err) {
        contactStatus.className = "contact-form-status contact-form-status--err";
        const msg = String((err && err.message) || "");
        const providerDown = /\b521\b/.test(msg);
        contactStatus.textContent = providerDown
          ? "Form provider is temporarily down (521). Please try again later or email us at uvejsgjelaj03@gmail.com."
          : "Could not send right now. Email us at uvejsgjelaj03@gmail.com or try again in a moment.";
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  // Nav link in mobile menu: close the drawer
  if (mainNav) {
    mainNav.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => closeMobileNav());
    });
  }
});
