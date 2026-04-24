/**
 * Plausible Analytics: pageviews via script tag in homepage.html; custom events
 * through plausible(name, { props }). Keeps window.SETAnalytics for other scripts.
 */
(function () {
  function flattenPayload(payload) {
    if (!payload || typeof payload !== "object") return {};
    const props = {};
    for (const [k, v] of Object.entries(payload)) {
      if (v != null && typeof v === "object" && !Array.isArray(v)) {
        for (const [k2, v2] of Object.entries(v)) {
          props[`${k}_${k2}`] = v2 == null ? "" : String(v2);
        }
      } else {
        props[k] = v == null ? "" : String(v);
      }
    }
    return props;
  }

  const postEvent = (name, payload) => {
    if (typeof window.plausible !== "function") return;
    const props = flattenPayload(payload);
    const opts = Object.keys(props).length ? { props } : {};
    try {
      window.plausible(String(name), opts);
    } catch {
      /* ignore analytics errors */
    }
  };

  window.SETAnalytics = { postEvent };

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".navbar a").forEach((link) => {
      link.addEventListener("click", () =>
        postEvent("nav_click", { section: link.getAttribute("href") || "nav" }),
      );
    });

    document.querySelectorAll(".hero-cta").forEach((cta) => {
      cta.addEventListener("click", () => {
        let section = "cta";
        if (cta.closest("#homesection")) section = "hero";
        else if (cta.closest("#featured-work")) section = "featured_work";
        postEvent("cta_click", { section, metadata: { text: cta.textContent?.trim() || "" } });
      });
    });
  });
})();
