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

const track = document.querySelector(".portfolio-track");
const cards = document.querySelectorAll(".project-card");
const dotsContainer = document.querySelector(".portfolio-dots");

/* ===== SLIDER STATE ===== */
let index = 0;
let startX = 0;
let currentTranslate = 0;
let isDragging = false;
let autoSlideInterval;

/* ===== CREATE DOTS ===== */
cards.forEach((_, i) => {
  const dot = document.createElement("button");
  if (i === 0) dot.classList.add("active");
  dot.addEventListener("click", () => {
    stopAutoSlide();
    goToSlide(i);
    startAutoSlide();
  });
  dotsContainer.appendChild(dot);
});

function updateDots() {
  document.querySelectorAll(".portfolio-dots button").forEach((d, i) => {
    d.classList.toggle("active", i === index);
  });
}

function goToSlide(i) {
  index = Math.max(0, Math.min(i, cards.length - 1));
  currentTranslate = -index * track.offsetWidth;
  track.style.transform = `translateX(${currentTranslate}px)`;
  updateDots();
}

/* ===== AUTO SLIDE (every 6s) ===== */
function startAutoSlide() {
  autoSlideInterval = setInterval(() => {
    index = (index + 1) % cards.length;
    goToSlide(index);
  }, 6000);
}

function stopAutoSlide() {
  clearInterval(autoSlideInterval);
}

startAutoSlide();

/* ===== DRAG SUPPORT ===== */
track.addEventListener("mousedown", e => {
  stopAutoSlide();
  isDragging = true;
  startX = e.pageX;
  track.style.transition = "none";
});

window.addEventListener("mouseup", () => {
  if (!isDragging) return;
  isDragging = false;
  track.style.transition = "";
  const moved = currentTranslate % track.offsetWidth;
  if (moved < -120) index++;
  if (moved > 120) index--;
  goToSlide(index);
  startAutoSlide();
});

window.addEventListener("mousemove", e => {
  if (!isDragging) return;
  const diff = e.pageX - startX;
  track.style.transform = `translateX(${currentTranslate + diff}px)`;
});

/* ===== FULLSCREEN MODAL ===== */
const modal = document.createElement("div");
modal.className = "portfolio-modal";
modal.innerHTML = `
  <div class="modal-inner">
    <span class="modal-close">&times;</span>
    <img src="" alt="">
  </div>
`;
document.body.appendChild(modal);

const modalImg = modal.querySelector("img");
const closeBtn = modal.querySelector(".modal-close");

cards.forEach(card => {
  card.addEventListener("click", () => {
    stopAutoSlide();
    modalImg.src = card.querySelector("img").src;
    modal.classList.add("open");
  });
});

closeBtn.addEventListener("click", closeModal);
modal.addEventListener("click", e => {
  if (e.target === modal) closeModal();
});
window.addEventListener("keydown", e => {
  if (e.key === "Escape") closeModal();
});

function closeModal() {
  modal.classList.remove("open");
  startAutoSlide();
}
