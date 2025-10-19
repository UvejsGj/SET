// homepage.js
document.addEventListener("DOMContentLoaded", () => {
  // Track both the container AND the visible heading
  const selectors = [
    "#homesection",
    "#aboutsection", // the image container with real height
    ".about-title", // the visible h1 "About Us"
    "#servicesection",
    "#portfoliosection",
    "#teamsection",
    "#contactsection",
  ];

  const targets = selectors
    .map((s) => document.querySelector(s))
    .filter(Boolean);

  const links = Array.from(document.querySelectorAll(".navbar a")).filter(
    (a) => a.hash && document.querySelector(a.hash)
  );

  if (!targets.length || !links.length) return;

  const setActive = (hash) => {
    links.forEach((a) => a.classList.toggle("active", a.hash === hash));
  };

  // Choose the element closest to the viewport center as "current"
  const pickCurrent = () => {
    let best = null;
    let bestDist = Infinity;
    const center = window.innerHeight / 2;

    targets.forEach((el) => {
      const r = el.getBoundingClientRect();
      const mid = r.top + r.height / 2;
      const dist = Math.abs(mid - center);
      if (dist < bestDist) {
        bestDist = dist;
        best = el;
      }
    });

    if (best) setActive("#" + (best.id || best.getAttribute("id")));
  };

  // IntersectionObserver to update as sections enter/leave
  const io = new IntersectionObserver(() => pickCurrent(), {
    root: null,
    rootMargin: "-40% 0px -40% 0px",
    threshold: 0,
  });

  targets.forEach((t) => io.observe(t));

  window.addEventListener("scroll", pickCurrent, { passive: true });
  window.addEventListener("load", pickCurrent);
  pickCurrent();
});

document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector(".navbar");
  const hero = document.querySelector("#homesection");

  if (!nav || !hero) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      // When hero is NOT visible (you're scrolling past it), darken navbar
      nav.classList.toggle("on-light", !entry.isIntersecting);
    },
    { threshold: 0.1 }
  );

  observer.observe(hero);
});
