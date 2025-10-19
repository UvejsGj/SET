// homepage.js
document.addEventListener('DOMContentLoaded', () => {
  // Sections you want to track (add the rest when you create them)
  const targets = [
    '#homesection',
    '#aboutsection',
    '#servicesection',
    '#portfoliosection',
    '#teamsection',
    '#contactsection'
  ].map(sel => document.querySelector(sel)).filter(Boolean);

  // Only nav links that actually point to a section
  const links = Array.from(document.querySelectorAll('.navbar a'))
    .filter(a => a.hash && document.querySelector(a.hash));

  if (!targets.length || !links.length) return;

  const setActive = (hash) => {
    links.forEach(a => a.classList.toggle('active', a.hash === hash));
  };

  // Highlight section near the middle of the viewport
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) setActive('#' + entry.target.id);
    });
  }, {
    root: null,
    rootMargin: '-40% 0px -40% 0px', // center bias
    threshold: 0
  });

  targets.forEach(t => io.observe(t));

  // Initial state on load/refresh
  setTimeout(() => {
    let current = targets[0];
    for (const t of targets) {
      const top = t.getBoundingClientRect().top;
      if (top <= window.innerHeight * 0.5) current = t;
    }
    setActive('#' + current.id);
  }, 0);
});
