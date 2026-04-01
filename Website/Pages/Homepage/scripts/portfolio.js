document.addEventListener("DOMContentLoaded", () => {
// Portfolio slider
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

    function next() {
      goTo(index + 1);
    }
    function prev() {
      goTo(index - 1);
    }

    prevBtn.addEventListener("click", prev);
    nextBtn.addEventListener("click", next);

    window.addEventListener("keydown", (e) => {
      const inViewport =
        viewport.getBoundingClientRect().top < window.innerHeight &&
        viewport.getBoundingClientRect().bottom > 0;
      if (!inViewport) return;
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    });

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
      const threshold = slideWidth() * 0.18;
      if (dx > threshold) prev();
      else if (dx < -threshold) next();
      else goTo(index);
    };

    viewport.addEventListener("mousedown", (e) => pointerDown(e.clientX));
    window.addEventListener("mousemove", (e) => pointerMove(e.clientX));
    window.addEventListener("mouseup", (e) => pointerUp(e.clientX));

    viewport.addEventListener("touchstart", (e) => pointerDown(e.touches[0].clientX), { passive: true });
    viewport.addEventListener("touchmove", (e) => pointerMove(e.touches[0].clientX), { passive: true });
    viewport.addEventListener(
      "touchend",
      (e) => pointerUp((e.changedTouches[0] || {}).clientX || startX),
      { passive: true }
    );

    window.addEventListener("resize", () => goTo(index));
    update();
  })();
});
