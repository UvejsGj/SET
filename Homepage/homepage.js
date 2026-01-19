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
  let startX = 0;
  let startTranslate = 0;

  // Build dots
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

  function next() { goTo(index + 1); }
  function prev() { goTo(index - 1); }

  prevBtn.addEventListener("click", prev);
  nextBtn.addEventListener("click", next);

  // Keyboard support
  window.addEventListener("keydown", (e) => {
    const inViewport = viewport.getBoundingClientRect().top < window.innerHeight &&
                      viewport.getBoundingClientRect().bottom > 0;
    if (!inViewport) return;

    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  });

  // Drag / swipe (mouse + touch)
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
    const threshold = slideWidth() * 0.18; // swipe sensitivity

    if (dx > threshold) prev();
    else if (dx < -threshold) next();
    else goTo(index);
  };

  // Mouse
  viewport.addEventListener("mousedown", (e) => pointerDown(e.clientX));
  window.addEventListener("mousemove", (e) => pointerMove(e.clientX));
  window.addEventListener("mouseup", (e) => pointerUp(e.clientX));

  // Touch
  viewport.addEventListener("touchstart", (e) => pointerDown(e.touches[0].clientX), { passive: true });
  viewport.addEventListener("touchmove", (e) => pointerMove(e.touches[0].clientX), { passive: true });
  viewport.addEventListener("touchend", (e) => pointerUp((e.changedTouches[0] || {}).clientX || startX), { passive: true });

  // Keep correct position on resize
  window.addEventListener("resize", () => goTo(index));

  // Init
  update();
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

