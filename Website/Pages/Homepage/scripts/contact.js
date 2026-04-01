document.addEventListener("DOMContentLoaded", () => {
const contactForm = document.getElementById("contact-form");
  const contactStatus = document.getElementById("contact-form-status");
  if (contactForm && contactStatus) {
    const buildMailtoFallback = () => {
      const name = String(contactForm.querySelector('[name="name"]')?.value || "").trim();
      const email = String(contactForm.querySelector('[name="email"]')?.value || "").trim();
      const subject = String(contactForm.querySelector('[name="subject"]')?.value || "").trim();
      const message = String(contactForm.querySelector('[name="message"]')?.value || "").trim();
      const finalSubject = subject || "Website contact";
      const body =
        `Name: ${name || "-"}` +
        `\nEmail: ${email || "-"}` +
        `\n\nMessage:\n${message || "-"}`;
      return (
        `mailto:uvejsgjelaj03@gmail.com?subject=${encodeURIComponent(finalSubject)}` +
        `&body=${encodeURIComponent(body)}`
      );
    };

    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector(".contact-submit");
      const rawAction = contactForm.getAttribute("action") || "";
      let ajaxUrl = rawAction;
      if (rawAction.includes("formsubmit.co") && !rawAction.includes("/ajax/")) {
        ajaxUrl = rawAction.replace(
          /^https:\/\/formsubmit\.co\//i,
          "https://formsubmit.co/ajax/"
        );
      }
      if (!rawAction.includes("formsubmit.co")) {
        contactStatus.hidden = false;
        contactStatus.className = "contact-form-status contact-form-status--err";
        contactStatus.textContent =
          "Form address missing. Set the form action in the HTML to your FormSubmit link.";
        return;
      }
      contactStatus.hidden = false;
      contactStatus.className = "contact-form-status contact-form-status--busy";
      contactStatus.textContent = "Sending…";
      if (submitBtn) submitBtn.disabled = true;
      try {
        const res = await fetch(ajaxUrl, {
          method: "POST",
          body: new FormData(contactForm),
          headers: { Accept: "application/json" },
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data.message || data.error || "Request failed");
        }
        contactStatus.className = "contact-form-status contact-form-status--ok";
        contactStatus.textContent =
          "Thanks — your message was sent. We will get back to you soon.";
        contactForm.reset();
      } catch (err) {
        contactStatus.className = "contact-form-status contact-form-status--err";
        const msg = String((err && err.message) || "");
        const providerDown = /\b521\b/.test(msg);
        const mailtoUrl = buildMailtoFallback();
        contactStatus.innerHTML = providerDown
          ? `Form provider is temporarily down (521). <a class="contact-status-link" href="${mailtoUrl}">Send via email app instead</a>.`
          : `Could not send right now. <a class="contact-status-link" href="${mailtoUrl}">Send via email app instead</a>.`;
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }
});
