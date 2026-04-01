document.addEventListener("DOMContentLoaded", () => {
// Touch devices: one-tap hover feedback (without sticky :hover behavior)
  if (window.matchMedia("(hover: none), (pointer: coarse)").matches) {
    const tapCards = document.querySelectorAll(
      ".card1, .card2, .card3, .servicecards > div, .culture-card, .tech-card, .team-card, .faq-card"
    );
    const pulse = (el) => {
      if (!el) return;
      el.classList.remove("is-tapped");
      void el.offsetWidth;
      el.classList.add("is-tapped");
      window.setTimeout(() => el.classList.remove("is-tapped"), 260);
    };
    tapCards.forEach((el) => {
      el.addEventListener(
        "touchstart",
        () => {
          pulse(el);
        },
        { passive: true }
      );
    });
  }
});
