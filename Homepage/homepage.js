// homepage.js — safe + organized

document.addEventListener("DOMContentLoaded", () => {
  /* =========================
     NAV: active link highlight
     ========================= */
  const navLinks = Array.from(document.querySelectorAll(".navbar a")).filter(
    (a) => a.hash && document.querySelector(a.hash)
  );
  const sections = navLinks.map((a) => document.querySelector(a.hash)).filter(Boolean);

  const setActive = (id) => {
    navLinks.forEach((a) => a.classList.toggle("active", a.hash === `#${id}`));
  };

  if (sections.length) {
    const io = new IntersectionObserver(
      (entries) => {
        let best = null;
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          if (!best || e.intersectionRatio > best.intersectionRatio) best = e;
        }
        if (best) setActive(best.target.id);
      },
      {
        root: null,
        rootMargin: "-25% 0px -50% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    sections.forEach((sec) => io.observe(sec));

    // initial active
    setActive(sections[0].id);
  }

  /* =========================
     NAV: smooth scroll (all # links)
     ========================= */
  const headerOffset = 140; // tune if needed

  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    const hash = a.getAttribute("href");
    if (!hash || hash === "#") return;

    const target = document.querySelector(hash);
    if (!target) return;

    a.addEventListener("click", (e) => {
      e.preventDefault();

      const y = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
      window.scrollTo({ top: y, behavior: "smooth" });

      history.pushState(null, "", hash);
    });
  });

  /* =========================
     MEDIA: graceful fallback for missing images
     ========================= */
  document.querySelectorAll("img").forEach((img) => {
    img.addEventListener("load", () => {
      img.classList.remove("img-missing");
      const portfolioSlide = img.closest(".portfolio-slide");
      if (portfolioSlide) portfolioSlide.classList.remove("media-missing");
    });

    img.addEventListener("error", () => {
      const portfolioSlide = img.closest(".portfolio-slide");
      if (portfolioSlide) {
        portfolioSlide.classList.add("media-missing");
        img.classList.add("img-missing");
      }
    });
  });

  /* =========================
     CULTURE: reveal on scroll
     (removed duplicate observer)
     ========================= */
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

  /* =========================
   PORTFOLIO (New Slider)
   ========================= */
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
  let pointerId = null;
  let startX = 0;
  let startTranslate = 0;
  let autoTimer = null;
  const AUTO_MS = 5200;
  const SLIDE_EASING = "transform 620ms cubic-bezier(0.22, 1, 0.36, 1)";
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  shell.setAttribute("role", "region");
  shell.setAttribute("aria-label", "Portfolio slider");
  viewport.setAttribute("tabindex", "0");
  viewport.style.touchAction = "pan-y";

  if (slides.length < 2) {
    prevBtn.hidden = true;
    nextBtn.hidden = true;
    dotsWrap.hidden = true;
    slides[0].setAttribute("aria-hidden", "false");
    return;
  }

  // Build dots
  dotsWrap.innerHTML = "";
  const dots = slides.map((_, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.setAttribute("aria-label", `Go to slide ${i + 1}`);
    b.setAttribute("aria-controls", "portfolio-track");
    b.addEventListener("click", () => goTo(i));
    dotsWrap.appendChild(b);
    return b;
  });
  track.id = "portfolio-track";

  const slideWidth = () => viewport.getBoundingClientRect().width || viewport.clientWidth || 1;
  const inViewport = () => {
    const rect = viewport.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  };

  function update() {
    track.style.transform = `translateX(${-index * slideWidth()}px)`;
    dots.forEach((d, i) => {
      const active = i === index;
      d.classList.toggle("active", active);
      d.setAttribute("aria-current", active ? "true" : "false");
    });
    slides.forEach((s, i) => {
      const active = i === index;
      s.setAttribute("aria-hidden", active ? "false" : "true");
      s.tabIndex = active ? 0 : -1;
    });
  }

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    track.style.transition = prefersReducedMotion ? "none" : SLIDE_EASING;
    update();
  }

  function next() { goTo(index + 1); }
  function prev() { goTo(index - 1); }
  function stopAuto() {
    if (autoTimer) {
      window.clearInterval(autoTimer);
      autoTimer = null;
    }
  }
  function startAuto() {
    if (prefersReducedMotion || autoTimer) return;
    autoTimer = window.setInterval(() => {
      if (!document.hidden && !isDragging && inViewport()) next();
    }, AUTO_MS);
  }

  prevBtn.addEventListener("click", prev);
  nextBtn.addEventListener("click", next);

  // Keyboard support
  viewport.addEventListener("keydown", (e) => {
    if (!inViewport()) return;

    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  });

  // Drag / swipe (pointer events: mouse + touch + pen)
  const pointerDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    isDragging = true;
    pointerId = e.pointerId ?? null;
    startX = e.clientX;
    startTranslate = -index * slideWidth();
    track.style.transition = "none";
    viewport.setPointerCapture?.(pointerId);
    shell.classList.add("is-dragging");
  };

  const pointerMove = (e) => {
    if (!isDragging) return;
    if (pointerId !== null && e.pointerId !== pointerId) return;
    const dx = e.clientX - startX;
    track.style.transform = `translateX(${startTranslate + dx}px)`;
  };

  const pointerUp = (e) => {
    if (!isDragging) return;
    if (pointerId !== null && e.pointerId !== pointerId) return;
    isDragging = false;
    shell.classList.remove("is-dragging");

    const dx = e.clientX - startX;
    const threshold = slideWidth() * 0.18; // swipe sensitivity

    if (dx > threshold) prev();
    else if (dx < -threshold) next();
    else goTo(index);

    pointerId = null;
  };

  viewport.addEventListener("pointerdown", pointerDown);
  window.addEventListener("pointermove", pointerMove);
  window.addEventListener("pointerup", pointerUp);
  window.addEventListener("pointercancel", pointerUp);

  // Keep correct position on resize
  window.addEventListener("resize", () => goTo(index));
  shell.addEventListener("mouseenter", stopAuto);
  shell.addEventListener("mouseleave", startAuto);
  shell.addEventListener("focusin", stopAuto);
  shell.addEventListener("focusout", startAuto);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopAuto();
    else startAuto();
  });

  // Init
  update();
  startAuto();
})();


  /* =========================
     MOBILE NAV: burger menu
     ========================= */
  const btn = document.querySelector(".nav-toggle");
  const nav = document.getElementById("main-nav");
  const overlay = document.querySelector(".nav-overlay");

  if (btn && nav && overlay) {
    const openMenu = () => {
      document.body.classList.add("nav-open");
      overlay.hidden = false;
      btn.setAttribute("aria-expanded", "true");
      const icon = btn.querySelector(".material-symbols-outlined");
      if (icon) icon.textContent = "close";
    };

    const closeMenu = () => {
      document.body.classList.remove("nav-open");
      overlay.hidden = true;
      btn.setAttribute("aria-expanded", "false");
      const icon = btn.querySelector(".material-symbols-outlined");
      if (icon) icon.textContent = "menu";
    };

    const isOpen = () => document.body.classList.contains("nav-open");

    btn.addEventListener("click", () => (isOpen() ? closeMenu() : openMenu()));
    overlay.addEventListener("click", closeMenu);

    nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isOpen()) closeMenu();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 600 && isOpen()) closeMenu();
    });
  }
});

