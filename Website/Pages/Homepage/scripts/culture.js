document.addEventListener("DOMContentLoaded", () => {
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
});
