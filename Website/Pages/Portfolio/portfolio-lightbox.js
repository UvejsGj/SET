document.addEventListener("DOMContentLoaded", () => {
  const lightbox = document.querySelector(".lightbox");
  const lightboxImage = document.querySelector(".lightbox-image");
  const closeBtn = document.querySelector(".lightbox-close");
  const prevBtn = document.querySelector(".lightbox-prev");
  const nextBtn = document.querySelector(".lightbox-next");
  const counter = document.querySelector(".lightbox-counter");
  const title = document.querySelector(".lightbox-title");
  if (!lightbox || !lightboxImage || !closeBtn || !prevBtn || !nextBtn || !counter || !title) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let currentIndex = 0;
  const getOpenButtons = () => Array.from(document.querySelectorAll(".portfolio-open"));

  const close = () => {
    lightbox.hidden = true;
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    lightboxImage.removeAttribute("src");
    title.textContent = "";
  };

  const renderAt = (index) => {
    const openButtons = getOpenButtons();
    if (!openButtons.length) return;
    const i = (index + openButtons.length) % openButtons.length;
    const button = openButtons[i];
    const src = button.getAttribute("data-full");
    const image = button.querySelector("img");
    const alt = image ? image.alt : "Portfolio project image";
    const heading = button.closest(".portfolio-card")?.querySelector("h2");
    if (!src) return;
    currentIndex = i;
    counter.textContent = `${i + 1} / ${openButtons.length}`;
    title.textContent = heading ? heading.textContent.trim() : "Project";
    lightboxImage.src = src;
    lightboxImage.alt = alt;
  };

  const openAt = (index) => {
    renderAt(index);
    if (!lightboxImage.getAttribute("src")) return;
    lightbox.hidden = false;
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const animateTo = (index) => {
    if (lightbox.hidden) {
      openAt(index);
      return;
    }
    if (reduceMotion) {
      renderAt(index);
      return;
    }
    lightboxImage.classList.add("is-transitioning");
    window.setTimeout(() => {
      renderAt(index);
      lightboxImage.classList.remove("is-transitioning");
    }, 180);
  };

  // Prevent stale state if page was restored from bfcache.
  close();

  document.addEventListener("click", (e) => {
    const button = e.target.closest(".portfolio-open");
    if (!button) return;
    const openButtons = getOpenButtons();
    const index = openButtons.indexOf(button);
    if (index < 0) return;
    openAt(index);
    if (window.SETAnalytics && typeof window.SETAnalytics.postEvent === "function") {
      window.SETAnalytics.postEvent("portfolio_open", { section: "portfolio_grid" });
    }
  });

  closeBtn.addEventListener("click", close);
  prevBtn.addEventListener("click", () => animateTo(currentIndex - 1));
  nextBtn.addEventListener("click", () => animateTo(currentIndex + 1));
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) close();
  });

  window.addEventListener("keydown", (e) => {
    if (lightbox.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") animateTo(currentIndex - 1);
    if (e.key === "ArrowRight") animateTo(currentIndex + 1);
  });
});
