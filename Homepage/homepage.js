// homepage.js — only handles active link highlight
document.addEventListener('DOMContentLoaded', () => {
  // Only consider nav links that point to real sections on the page
  const links = Array.from(document.querySelectorAll('.navbar a'))
    .filter(a => a.hash && document.querySelector(a.hash));
  const sections = links.map(a => document.querySelector(a.hash));

  if (!links.length || !sections.length) return;

  const setActive = (id) => {
    links.forEach(a => a.classList.toggle('active', a.hash === `#${id}`));
  };

  // IntersectionObserver: choose the section most in view near center
  const io = new IntersectionObserver((entries) => {
    // pick the intersecting entry with the highest ratio
    let best = null;
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      if (!best || e.intersectionRatio > best.intersectionRatio) best = e;
    }
    if (best) setActive(best.target.id);
  }, {
    root: null,
    // bias toward the middle of the viewport
    rootMargin: '-25% 0px -50% 0px',
    threshold: [0, 0.25, 0.5, 0.75, 1],
  });

  sections.forEach(sec => io.observe(sec));

  // Initial highlight on load/refresh
  const center = window.innerHeight / 2;
  let initial = sections[0];
  for (const sec of sections) {
    const r = sec.getBoundingClientRect();
    const mid = r.top + r.height / 2;
    if (Math.abs(mid - center) < Math.abs((initial.getBoundingClientRect().top + initial.getBoundingClientRect().height/2) - center)) {
      initial = sec;
    }
  }
  setActive(initial.id);
});

// in homepage.js (with defer)
document.addEventListener('DOMContentLoaded', () => {
  const homeLink = document.querySelector('.navbar a[href="#homesection"]');
  if (!homeLink) return;

  homeLink.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".culture-card");

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  cards.forEach(card => observer.observe(card));
});

document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".culture-card");

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  cards.forEach((card) => observer.observe(card));
});

