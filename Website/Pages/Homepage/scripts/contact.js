/* Pairs with homepage.html #contact-form (action="#", data-fallback-action) and contact-form-endpoint.js. */
document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contact-form");
  const contactStatus = document.getElementById("contact-form-status");
  if (!contactForm || !contactStatus) return;

  if (typeof __SET_resolveFormSubmitAjax !== "function") {
    contactStatus.hidden = false;
    contactStatus.className = "contact-form-status contact-form-status--err";
    contactStatus.textContent =
      "Contact form could not load completely. Refresh the page or email us directly.";
    return;
  }

  const defaultAction =
    typeof __SET_defaultFormSubmitAction === "string"
      ? __SET_defaultFormSubmitAction
      : "https://formsubmit.co/519cb8ceae47e5cedcee15486890ce6d";

  const buildMailtoFallback = () => {
    const name = String(contactForm.querySelector('[name="name"]')?.value || "").trim();
    const email = String(contactForm.querySelector('[name="email"]')?.value || "").trim();
    const subject = String(contactForm.querySelector('[name="subject"]')?.value || "").trim();
    const message = String(contactForm.querySelector('[name="message"]')?.value || "").trim();
    const finalSubject = subject || "Website contact";
    const body =
      `Name: ${name || "-"}` + `\nEmail: ${email || "-"}` + `\n\nMessage:\n${message || "-"}`;
    return (
      `mailto:besart@smart-engineering.tech?subject=${encodeURIComponent(finalSubject)}` +
      `&body=${encodeURIComponent(body)}`
    );
  };

  const showErrorWithFallback = (message) => {
    const mailtoUrl = buildMailtoFallback();
    contactStatus.className = "contact-form-status contact-form-status--err";
    contactStatus.innerHTML = `${message} <a class="contact-status-link" href="${mailtoUrl}">Send via email app instead</a>.`;
  };

  const submitToFormSubmit = async () => {
    const resolved = __SET_resolveFormSubmitAjax(
      contactForm.getAttribute("data-fallback-action"),
      defaultAction,
    );
    if (!resolved.ok) {
      throw new Error("disallowed_endpoint");
    }
    const res = await fetch(resolved.ajaxUrl, {
      method: "POST",
      body: new FormData(contactForm),
      headers: { Accept: "application/json" },
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || data.error || "Fallback request failed");
  };

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const submitBtn = contactForm.querySelector(".contact-submit");
    contactStatus.hidden = false;
    contactStatus.className = "contact-form-status contact-form-status--busy";
    contactStatus.textContent = "Sending…";
    if (submitBtn) submitBtn.disabled = true;
    try {
      await submitToFormSubmit();
      contactStatus.className = "contact-form-status contact-form-status--ok";
      contactStatus.textContent =
        "Thanks, your message is in. Our team usually replies within one business day.";
      contactForm.reset();
      if (window.SETAnalytics && typeof window.SETAnalytics.postEvent === "function") {
        window.SETAnalytics.postEvent("contact_submit", { section: "contact_form" });
      }
    } catch {
      showErrorWithFallback("Could not send right now.");
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
});
