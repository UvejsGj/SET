/**
 * Resolves the FormSubmit AJAX POST URL and enforces https + formsubmit.co only.
 * Used by contact.js; tested from repo tests/ via Node (globalThis).
 */
(function (root) {
  const DEFAULT = "https://formsubmit.co/519cb8ceae47e5cedcee15486890ce6d";

  function resolveFormSubmitAjaxUrl(fromAttr, defaultUrl) {
    const raw = (fromAttr && String(fromAttr).trim()) || defaultUrl || DEFAULT;
    let u;
    try {
      u = new URL(raw);
    } catch {
      return { ok: false };
    }
    if (u.protocol !== "https:" || u.hostname !== "formsubmit.co") {
      return { ok: false };
    }
    const href = u.href;
    const ajaxUrl =
      href.indexOf("/ajax/") !== -1
        ? href
        : href.replace(/^https:\/\/formsubmit\.co\//i, "https://formsubmit.co/ajax/");
    return { ok: true, ajaxUrl: ajaxUrl };
  }

  root.__SET_resolveFormSubmitAjax = resolveFormSubmitAjaxUrl;
  root.__SET_defaultFormSubmitAction = DEFAULT;
})(typeof globalThis !== "undefined" ? globalThis : this);
