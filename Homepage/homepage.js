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


  // Drag-to-scroll for testimonials
  (function () {
    const viewport = document.querySelector('.t-viewport');
    const track = document.querySelector('.t-track');
    if (!viewport || !track) return;

    let isDown = false;
    let startX, scrollStart;

    // we use the viewport's scrollLeft so native snapping works
    const el = viewport;

    const onDown = (e) => {
      isDown = true;
      viewport.classList.add('dragging');
      startX = (e.touches ? e.touches[0].pageX : e.pageX);
      scrollStart = el.scrollLeft;
    };
    const onMove = (e) => {
      if (!isDown) return;
      const x = (e.touches ? e.touches[0].pageX : e.pageX);
      const walk = (startX - x); // drag left -> positive walk
      el.scrollLeft = scrollStart + walk;
      e.preventDefault();
    };
    const onUp = () => {
      isDown = false;
      viewport.classList.remove('dragging');
    };

    // Mouse
    viewport.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);

    // Touch
    viewport.addEventListener('touchstart', onDown, { passive: true });
    viewport.addEventListener('touchmove', onMove, { passive: false });
    viewport.addEventListener('touchend', onUp);

    // Optional: snap helper so it lands near the start of a card
    viewport.addEventListener('scroll', () => {
      // subtle inertia feel; native scroll-snap will do most work
    }, { passive: true });
  })();

  
  (function () {
    const viewport = document.querySelector('.t-viewport');
    const track = document.querySelector('.t-track');
    const cards = Array.from(document.querySelectorAll('.t-card'));
    const dotsWrap = document.querySelector('.t-dots');
    if (!viewport || !track || !cards.length || !dotsWrap) return;

    // ----- sizing helpers -----
    const trackStyles = getComputedStyle(track);
    const padL = parseFloat(trackStyles.paddingLeft) || 0;
    const gap = parseFloat(trackStyles.columnGap || trackStyles.gap) || 24;

    // two cards per "page" on desktop, one on mobile
    const isSingle = () => window.matchMedia('(max-width: 960px)').matches;
    const pageSize = () => (isSingle() ? 1 : 2);

    // build dots
    let pages = [];
    function buildDots() {
      dotsWrap.innerHTML = '';
      pages = [];
      const pSize = pageSize();
      const total = Math.ceil(cards.length / pSize);

      for (let i = 0; i < total; i++) {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 't-dot';
        dot.setAttribute('aria-label', `Go to testimonials ${i * pSize + 1}–${Math.min((i+1)*pSize, cards.length)}`);
        dot.addEventListener('click', () => scrollToPage(i));
        dotsWrap.appendChild(dot);
        pages.push(dot);
      }
      setActiveDot(currentPage());
    }

    function cardStartLeft(idx) {
      // Amount to scroll so that card idx aligns left inside viewport
      return cards[idx].offsetLeft - padL;
    }

    function scrollToPage(i) {
      const idx = i * pageSize();
      const left = cardStartLeft(idx);
      viewport.scrollTo({ left, behavior: 'smooth' });
      setActiveDot(i);
    }

    function currentPage() {
      const pSize = pageSize();
      // Find nearest card index based on scrollLeft
      let nearestIdx = 0;
      let minDist = Infinity;
      cards.forEach((card, idx) => {
        const dist = Math.abs(viewport.scrollLeft - cardStartLeft(idx));
        if (dist < minDist) { minDist = dist; nearestIdx = idx; }
      });
      return Math.min(Math.floor(nearestIdx / pSize), pages.length - 1);
    }

    function setActiveDot(i) {
      pages.forEach((d, k) => d.classList.toggle('is-active', k === i));
    }

    // Sync active dot on scroll end (throttled)
    let rafId = null;
    viewport.addEventListener('scroll', () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => setActiveDot(currentPage()));
    }, { passive: true });

    // Recompute on resize
    window.addEventListener('resize', () => {
      buildDots();
      // Snap to nearest after layout change
      scrollToPage(currentPage());
    });

    // Initialize
    buildDots();
    setActiveDot(currentPage());
  })();

  // Show/hide carousel only when section is in view
  (function(){
    const section = document.querySelector('.testimonials');
    if (!section) return;

    const io = new IntersectionObserver(([entry]) => {
      section.classList.toggle('is-inview', entry.isIntersecting);
    }, { root: null, threshold: 0.35 });

    io.observe(section);
  })();

  
(function () {
  const viewport = document.querySelector('.t-viewport');
  const track    = document.querySelector('.t-track');
  const cards    = Array.from(document.querySelectorAll('.t-card'));
  const dotsWrap = document.querySelector('.t-dots');

  if (!viewport || !track || !cards.length || !dotsWrap) return;

  let perView = 2;           // 2 cards on desktop, 1 on mobile
  let pageW = 0;             // width of one "page" in px (2 cards + gap)
  let pages = 0;             // total pages
  let page  = 0;             // current page index
  let gap   = 24;            // CSS --gap; will update on resize

  // Layout: set card width so exactly perView cards fit viewport (minus gap)
  function layout() {
  const vw = viewport.clientWidth;
  const s = getComputedStyle(track);
  gap = parseFloat(s.gap || s.columnGap || 24) || 24;

  // 2 cards on desktop, 1 on mobile
  const isMobile = window.matchMedia('(max-width: 960px)').matches;
  perView = isMobile ? 1 : 2;

  // 👇 scale cards smaller than half the viewport
  const SCALE = isMobile ? 0.92 : 0.82; // tweak this number to taste (0.75 = smaller, 0.9 = larger)

  let cardW;
  if (perView === 2) {
    // base half width, then shrink by SCALE, and clamp to a reasonable min/max
    const base = (vw - gap) / 2;
    cardW = Math.max(320, Math.min(base * SCALE, 460)); // clamp between 320–460
    pageW = cardW * 2 + gap;
  } else {
    // single card view
    cardW = Math.min(vw * SCALE, 520);
    pageW = cardW; // single card, no inter-card gap on the page width
  }

  track.style.setProperty('--card-w', `${cardW}px`);

  pages = Math.ceil(cards.length / perView);

  // keep current page, but re-apply transform
  const targetX = -page * pageW;
  setTransform(targetX);

  buildDots();
  setActiveDot(page);
}
  // Transform helpers
  let currentX = 0;
  function setTransform(x) {
    // clamp
    const min = - (pages - 1) * pageW;
    const max = 0;
    currentX = Math.min(max, Math.max(min, x));
    track.style.transform = `translate3d(${currentX}px, 0, 0)`;
  }
  function goToPage(i, smooth = true) {
    page = Math.min(Math.max(i, 0), pages - 1);
    const targetX = -page * pageW;
    if (!smooth) { setTransform(targetX); return; }
    // smooth step
    const start = currentX;
    const dist  = targetX - start;
    const dur = 280; // ms
    const t0 = performance.now();
    function step(t) {
      const p = Math.min(1, (t - t0) / dur);
      const e = p < .5 ? 2*p*p : -1 + (4 - 2*p)*p; // easeInOutQuad
      setTransform(start + dist * e);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // Dots
  function buildDots() {
    dotsWrap.innerHTML = '';
    for (let i = 0; i < pages; i++) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 't-dot';
      dot.addEventListener('click', () => goToPage(i));
      dotsWrap.appendChild(dot);
    }
  }
  function setActiveDot(i) {
    const dots = dotsWrap.querySelectorAll('.t-dot');
    dots.forEach((d, k) => d.classList.toggle('is-active', k === i));
  }

  // Dragging
  let isDown = false, startX = 0, startTx = 0;
  function onDown(e) {
    isDown = true;
    viewport.classList.add('dragging');
    startX = (e.touches ? e.touches[0].pageX : e.pageX);
    startTx = currentX;
  }
  function onMove(e) {
    if (!isDown) return;
    const x = (e.touches ? e.touches[0].pageX : e.pageX);
    const dx = x - startX;          // drag right = positive
    setTransform(startTx + dx);     // move track
    e.preventDefault();
  }
  function onUp() {
    if (!isDown) return;
    isDown = false;
    viewport.classList.remove('dragging');
    // snap to nearest page
    const rawPage = -currentX / pageW;
    goToPage(Math.round(rawPage));
  }

  viewport.addEventListener('mousedown', onDown);
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onUp);

  viewport.addEventListener('touchstart', onDown, { passive: true });
  viewport.addEventListener('touchmove', onMove,  { passive: false });
  viewport.addEventListener('touchend', onUp);

  // Init + resize
  window.addEventListener('resize', () => {
    const prevPage = page;
    layout();
    goToPage(prevPage, false);
  });

  layout();
})();
