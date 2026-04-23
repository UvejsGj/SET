/**
 * Static-site stub: analytics used to POST to the shelved backend.
 * Keeps window.SETAnalytics so other scripts can call postEvent safely.
 */
(function () {
  const postEvent = () => {};

  window.SETAnalytics = { postEvent };

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".navbar a").forEach((link) => {
      link.addEventListener("click", () => postEvent("nav_click", { section: link.getAttribute("href") || "nav" }));
    });

    document.querySelectorAll(".hero-cta").forEach((cta) => {
      cta.addEventListener("click", () =>
        postEvent("cta_click", { section: "hero", metadata: { text: cta.textContent?.trim() || "" } }),
      );
    });
  });
})();
