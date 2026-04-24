document.addEventListener("DOMContentLoaded", () => {
  if (!document.documentElement.classList.contains("js-motion")) return;

  const nodes = Array.from(document.querySelectorAll(".reveal-on-scroll"));
  if (!nodes.length) return;

  /** Reveal blocks only after the user has started scrolling (keeps first paint to hero + chrome). */
  const MIN_SCROLL_PX = 28;
  let observer;

  const startObserving = () => {
    if (observer) return;
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      },
      { root: null, rootMargin: "0px 0px -12% 0px", threshold: 0.06 },
    );
    nodes.forEach((el) => observer.observe(el));
  };

  const armIfScrolled = () => {
    if (window.scrollY >= MIN_SCROLL_PX) {
      startObserving();
      return true;
    }
    return false;
  };

  const onScrollIntent = () => {
    if (armIfScrolled()) {
      window.removeEventListener("scroll", onScrollIntent);
      window.removeEventListener("wheel", onScrollIntent);
      window.removeEventListener("touchmove", onScrollIntent);
    }
  };

  if (!armIfScrolled()) {
    window.addEventListener("scroll", onScrollIntent, { passive: true });
    window.addEventListener("wheel", onScrollIntent, { passive: true });
    window.addEventListener("touchmove", onScrollIntent, { passive: true });
  }

  // Hash / restore / late layout can jump scroll without firing wheel first
  window.addEventListener("load", () => {
    armIfScrolled();
  });
});
