/**
 * Resolves the FormSubmit AJAX POST URL and enforces https + formsubmit.co only.
 * Used by contact.js; tested from repo tests/ via Node (globalThis).
 */
(function (root) {
  var DEFAULT = "https://formsubmit.co/519cb8ceae47e5cedcee15486890ce6d";

  function resolveFormSubmitAjaxUrl(fromAttr, defaultUrl) {
    var raw = (fromAttr && String(fromAttr).trim()) || defaultUrl || DEFAULT;
    var u;
    try {
      u = new URL(raw);
    } catch {
      return { ok: false };
    }
    if (u.protocol !== "https:" || u.hostname !== "formsubmit.co") {
      return { ok: false };
    }
    var href = u.href;
    var ajaxUrl =
      href.indexOf("/ajax/") !== -1
        ? href
        : href.replace(/^https:\/\/formsubmit\.co\//i, "https://formsubmit.co/ajax/");
    return { ok: true, ajaxUrl: ajaxUrl };
  }

  root.__SET_resolveFormSubmitAjax = resolveFormSubmitAjaxUrl;
  root.__SET_defaultFormSubmitAction = DEFAULT;
})(typeof globalThis !== "undefined" ? globalThis : this);
