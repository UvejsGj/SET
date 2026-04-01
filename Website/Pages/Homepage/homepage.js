// Nav, jump to sections, portfolio slider, hamburger menu

document.addEventListener("DOMContentLoaded", () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const i18n = {
    en: {
      navHome: "Home",
      navAbout: "About",
      navServices: "Services",
      navTeam: "Team",
      navPortfolio: "Portofolio",
      navContact: "Contact Us",
      navFaq: "FAQ",
      heroTitle: "Innovate Your Future with <br />Smart Engineering",
      heroTagline: "IF YOU CAN DREAM IT, WE CAN DESIGN IT.",
      partners: "Partners",
      about: "About Us",
      servicesTitle: "Services",
      servicesIntro: "Smart engineering meets innovation - modern solutions that move your business forward.",
      lifeTitle: "Life at Smart Engineering",
      techTitle: "Our Technologies",
      teamTitle: "Meet our Team",
      portfolioTitle: "Portfolio",
      contactTitle: "Contact Us",
      contactIntro: "Tell us about your project or ask a question. We usually reply within one to two business days.",
      contactEmail: "Email",
      contactPhone: "Phone",
      contactLocation: "Location",
      contactSubmit: "Send message",
      faqTitle: "Frequently Asked Questions",
      faqQ1: "Can you handle large-scale projects?",
      faqQ2: "How do you approach a design project?",
      faqQ3: "Can you customize your services?",
      faqQ4: "What kind of support do you provide after project delivery?",
      footerBrand: "Smart Engineering Tech",
      footerPolicy: "Privacy Policy",
      phName: "Your name",
      phEmail: "you@company.com",
      phSubject: "What is this about?",
      phMessage: "Describe your project, timeline, or question...",
      aboutCards: [
        "Happy Clients Satisfied clients are the foundation of our success.",
        "Years of experience Years of experience delivering client success",
        "Projects Successful projects are a testament to our technology expertise."
      ],
      serviceTitles: ["3D Cad", "Web Development", "UI/UX Design", "Animation", "Support"],
      serviceDescs: [
        "Experience the power of precision with our 3D CAD solutions - from detailed product modeling to architectural visualization, we turn ideas into fully realized designs.",
        "We craft responsive, high-performance websites and apps that combine functionality with aesthetics, driving engagement and business growth.",
        "Our design team blends creativity and usability to build intuitive interfaces that delight users and reflect your brand's identity.",
        "Bring your concepts to life with our stunning 2D and 3D animations - perfect for storytelling, marketing, or product visualization.",
        "Our dedicated support team ensures your systems run smoothly with reliable maintenance, fast response, and long-term technical assistance."
      ],
      cultureTitles: ["Comfort of Workers", "Work Environment", "Tech Stack", "Sociable Culture"],
      cultureDescs: [
        "We prioritize comfort and well-being with ergonomic spaces, balanced schedules, and employee-first programs - fostering productivity through happiness.",
        "Our workspaces encourage innovation and teamwork, blending flexible hours with a culture that values creativity, inclusivity, and personal growth.",
        "Built with cutting-edge frameworks and scalable infrastructure, our tech stack powers reliable, efficient, and future-ready solutions.",
        "Collaboration drives us - we share ideas, celebrate achievements, and grow together in an environment of respect and creativity."
      ],
      techTitles: [
        "3D Modeling",
        "Angular",
        "Optimize Existing UI Designs",
        "3D Animation",
        "2D Drawings",
        "Node JS",
        "Prototypes for New Product Ideas",
        "Motion Graphics",
        "Rendering & Animation",
        "React JS",
        "Test for Intuitivity & Experience",
        "Stop Motion"
      ],
      teamRoles: [
        "Chief Executive Officer",
        "Project Lead Developer",
        "Manager of finance",
        "Senior mechanical engineer",
        "Mechanical Design Engineer",
        "Mechanical Design Engineer",
        "Mechanical Design Engineer",
        "Mechanical Design Engineer",
        "Mechanical Design Engineer",
        "Mechatronics Engineer",
        "Mechanical Engineer",
        "Mechanical Engineer",
        "Web Developer"
      ],
      faqA: [
        "Yes, we have the resources and expertise to deliver large-scale projects end-to-end. We scale teams, coordinate multiple workstreams, and keep quality and timelines predictable as scope grows.",
        "We start by aligning on goals and constraints, then research and ideate, create sketches/wireframes, and iterate with your feedback until the final design is both elegant and practical to build.",
        "Absolutely. We tailor scope, features, and engagement to your use case - whether that is rapid prototyping, full product delivery, or targeted support for an existing stack.",
        "We offer full post-delivery support, including performance monitoring, regular maintenance, updates, and technical assistance. Our team ensures that your system continues to operate smoothly long after the initial launch."
      ],
      contactQuick: "Quick answers?",
      contactQuickLink: "See frequently asked questions"
    },
    sq: {
      navHome: "Ballina",
      navAbout: "Rreth Nesh",
      navServices: "Shërbime",
      navTeam: "Ekipi",
      navPortfolio: "Portofolio",
      navContact: "Na Kontaktoni",
      navFaq: "Pyetje",
      heroTitle: "Inovoni të ardhmen tuaj me <br />Smart Engineering",
      heroTagline: "NËSE MUND TA ËNDRRONI, NE MUND TA DIZAJNOJMË.",
      partners: "Partnerët",
      about: "Rreth Nesh",
      servicesTitle: "Shërbimet",
      servicesIntro: "Inxhinieria e mençur takohet me inovacionin - zgjidhje moderne që e çojnë biznesin tuaj përpara.",
      lifeTitle: "Jeta në Smart Engineering",
      techTitle: "Teknologjitë Tona",
      teamTitle: "Njihuni me Ekipin Tonë",
      portfolioTitle: "Portofolio",
      contactTitle: "Na Kontaktoni",
      contactIntro: "Na tregoni për projektin tuaj ose na bëni një pyetje. Zakonisht përgjigjemi brenda një ose dy ditëve pune.",
      contactEmail: "Email",
      contactPhone: "Telefon",
      contactLocation: "Lokacioni",
      contactSubmit: "Dërgo mesazhin",
      faqTitle: "Pyetjet e Bëra Shpesh",
      faqQ1: "A mund të menaxhoni projekte të mëdha?",
      faqQ2: "Si i qaseni një projekti dizajni?",
      faqQ3: "A mund t'i personalizoni shërbimet tuaja?",
      faqQ4: "Çfarë lloj mbështetje ofroni pas dorëzimit të projektit?",
      footerBrand: "Smart Engineering Tech",
      footerPolicy: "Politika e Privatësisë",
      phName: "Emri juaj",
      phEmail: "ju@kompania.com",
      phSubject: "Për çfarë bëhet fjalë?",
      phMessage: "Përshkruani projektin, afatin apo pyetjen tuaj...",
      aboutCards: [
        "Klientë të kënaqur: klientët e kënaqur janë themeli i suksesit tonë.",
        "Vite përvoje: përvoja shumëvjeçare na ndihmon të sjellim rezultate të qëndrueshme.",
        "Projekte: projektet e suksesshme dëshmojnë ekspertizën tonë teknologjike."
      ],
      serviceTitles: ["3D CAD", "Zhvillim Web", "Dizajn UI/UX", "Animacion", "Mbështetje"],
      serviceDescs: [
        "Përjetoni fuqinë e saktësisë me zgjidhjet tona 3D CAD - nga modelimi i detajuar i produkteve deri te vizualizimi arkitektonik, ne i kthejmë idetë në dizajne të realizuara plotësisht.",
        "Ne ndërtojmë faqe dhe aplikacione të shpejta, responsive dhe me performancë të lartë që kombinojnë funksionalitetin me estetikën.",
        "Ekipi ynë i dizajnit bashkon kreativitetin me përdorshmërinë për të krijuar ndërfaqe intuitive që kënaqin përdoruesit dhe reflektojnë identitetin e markës suaj.",
        "Sillni idetë në jetë me animacionet tona 2D dhe 3D - ideale për tregim, marketing apo vizualizim produkti.",
        "Ekipi ynë i dedikuar i mbështetjes siguron që sistemet tuaja të funksionojnë pa probleme, me mirëmbajtje të besueshme dhe reagim të shpejtë."
      ],
      cultureTitles: ["Komoditeti i Punonjësve", "Mjedisi i Punës", "Stack Teknologjik", "Kulturë Shoqërore"],
      cultureDescs: [
        "Ne i japim përparësi komoditetit dhe mirëqenies me hapësira ergonomike, orare të balancuara dhe programe të fokusuara te punonjësit.",
        "Hapësirat tona të punës nxisin inovacionin dhe bashkëpunimin, me një kulturë që vlerëson kreativitetin dhe përfshirjen.",
        "Stack-u ynë modern teknologjik ofron zgjidhje të besueshme, efikase dhe të gatshme për të ardhmen.",
        "Bashkëpunimi na udhëheq - ndajmë ide, festojmë arritje dhe rritemi së bashku me respekt dhe kreativitet."
      ],
      techTitles: [
        "Modelim 3D",
        "Angular",
        "Optimizim i Dizajneve Ekzistuese UI",
        "Animacion 3D",
        "Vizatime 2D",
        "Node JS",
        "Prototipe për Ide të Reja Produktesh",
        "Motion Graphics",
        "Renderim & Animacion",
        "React JS",
        "Testim për Intuitivitet & Përvojë",
        "Stop Motion"
      ],
      teamRoles: [
        "Drejtor Ekzekutiv",
        "Udhëheqës i Zhvillimit të Projekteve",
        "Menaxher i Financave",
        "Inxhinier Mekanik Senior",
        "Inxhinier i Dizajnit Mekanik",
        "Inxhinier i Dizajnit Mekanik",
        "Inxhinier i Dizajnit Mekanik",
        "Inxhinier i Dizajnit Mekanik",
        "Inxhinier i Dizajnit Mekanik",
        "Inxhinier i Mekatronikës",
        "Inxhinier Mekanik",
        "Inxhinier Mekanik",
        "Zhvillues Web"
      ],
      faqA: [
        "Po, kemi burimet dhe ekspertizën për të realizuar projekte të mëdha nga fillimi në fund, duke ruajtur cilësinë dhe afatet.",
        "Ne fillojmë me objektivat dhe kufizimet, vazhdojmë me hulumtim dhe ideim, krijojmë skica/wireframe dhe i përmirësojmë me feedback-un tuaj.",
        "Absolutisht. Ne e përshtatim fushën e punës, funksionalitetet dhe mënyrën e angazhimit sipas nevojave tuaja.",
        "Ofrojmë mbështetje të plotë pas dorëzimit: monitorim performance, mirëmbajtje, përditësime dhe asistencë teknike."
      ],
      contactQuick: "Përgjigje të shpejta?",
      contactQuickLink: "Shih pyetjet e bëra shpesh"
    }
  };

  const setText = (selector, value) => {
    const el = document.querySelector(selector);
    if (el && value != null) el.textContent = value;
  };
  const setHtml = (selector, value) => {
    const el = document.querySelector(selector);
    if (el && value != null) el.innerHTML = value;
  };

  const applyLanguage = (lang) => {
    const dict = i18n[lang] || i18n.en;
    document.documentElement.lang = lang;
    setText(".homebtn", dict.navHome);
    setText(".aboutbtn", dict.navAbout);
    setText(".servicesbtn", dict.navServices);
    setText(".teambtn", dict.navTeam);
    setText(".portofoliobtn", dict.navPortfolio);
    setText(".contactusbtn", dict.navContact);
    setText(".faqbtn", dict.navFaq);

    setHtml(".title h1", dict.heroTitle);
    setText(".title p", dict.heroTagline);
    setText(".partners-title", dict.partners);
    setText(".about-title", dict.about);
    setText(".servicetitle", dict.servicesTitle);
    setText(".services > p", dict.servicesIntro);
    setText("#lifesection", dict.lifeTitle);
    setText("#techstack .section-title", dict.techTitle);
    setText("#team .section-title", dict.teamTitle);
    setText("#portfolio .section-title", dict.portfolioTitle);
    setText("#contact .section-title", dict.contactTitle);
    setText(".contact-intro", dict.contactIntro);
    setText("#faq .section-title", dict.faqTitle);

    const labels = document.querySelectorAll(".contact-info-label");
    if (labels[0]) labels[0].textContent = dict.contactEmail;
    if (labels[1]) labels[1].textContent = dict.contactPhone;
    if (labels[2]) labels[2].textContent = dict.contactLocation;
    setText(".contact-submit-text", dict.contactSubmit);

    const qs = document.querySelectorAll(".faq-q");
    if (qs[0]) qs[0].textContent = dict.faqQ1;
    if (qs[1]) qs[1].textContent = dict.faqQ2;
    if (qs[2]) qs[2].textContent = dict.faqQ3;
    if (qs[3]) qs[3].textContent = dict.faqQ4;

    const nameInput = document.querySelector('input[name="name"]');
    const emailInput = document.querySelector('input[name="email"]');
    const subjectInput = document.querySelector('input[name="subject"]');
    const messageInput = document.querySelector('textarea[name="message"]');
    if (nameInput) nameInput.placeholder = dict.phName;
    if (emailInput) emailInput.placeholder = dict.phEmail;
    if (subjectInput) subjectInput.placeholder = dict.phSubject;
    if (messageInput) messageInput.placeholder = dict.phMessage;

    setText(".footer-text span", dict.footerBrand);
    setText(".footer-link", dict.footerPolicy);

    const aboutCards = document.querySelectorAll(".cards > div p");
    dict.aboutCards.forEach((txt, i) => {
      if (aboutCards[i]) aboutCards[i].textContent = txt;
    });

    const serviceTitles = document.querySelectorAll(".servicecards > div h1");
    const serviceDescs = document.querySelectorAll(".servicecards > div p");
    dict.serviceTitles.forEach((txt, i) => {
      if (serviceTitles[i]) serviceTitles[i].textContent = txt;
    });
    dict.serviceDescs.forEach((txt, i) => {
      if (serviceDescs[i]) serviceDescs[i].textContent = txt;
    });

    const cultureTitles = document.querySelectorAll(".culture-card h3");
    const cultureDescs = document.querySelectorAll(".culture-card p");
    dict.cultureTitles.forEach((txt, i) => {
      if (cultureTitles[i]) cultureTitles[i].textContent = txt;
    });
    dict.cultureDescs.forEach((txt, i) => {
      if (cultureDescs[i]) cultureDescs[i].textContent = txt;
    });

    const techTitles = document.querySelectorAll(".tech-card h3");
    dict.techTitles.forEach((txt, i) => {
      if (techTitles[i]) techTitles[i].textContent = txt;
    });

    const roles = document.querySelectorAll(".team-card-role");
    dict.teamRoles.forEach((txt, i) => {
      if (roles[i]) roles[i].textContent = txt;
    });

    const faqAnswers = document.querySelectorAll(".faq-a");
    dict.faqA.forEach((txt, i) => {
      if (faqAnswers[i]) faqAnswers[i].textContent = txt;
    });

    const quickNudge = document.querySelector(".contact-faq-nudge");
    const quickLink = document.querySelector(".contact-faq-nudge a");
    if (quickNudge && quickNudge.firstChild) {
      quickNudge.firstChild.textContent = `${dict.contactQuick} `;
    }
    if (quickLink) quickLink.textContent = dict.contactQuickLink;

    document.querySelectorAll(".lang-btn").forEach((b) => {
      b.classList.toggle("active", b.dataset.lang === lang);
    });
  };

  const storedLang = localStorage.getItem("site_lang");
  const browserLang = navigator.language && navigator.language.toLowerCase().startsWith("sq") ? "sq" : "en";
  const initialLang = storedLang || browserLang;
  applyLanguage(initialLang);
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const lang = btn.dataset.lang === "sq" ? "sq" : "en";
      localStorage.setItem("site_lang", lang);
      applyLanguage(lang);
    });
  });

  // Mobile menu
  let closeMobileNav = () => {};
  const navToggle = document.querySelector(".nav-toggle");
  const mainNav = document.getElementById("main-nav");
  const navOverlay = document.querySelector(".nav-overlay");

  if (navToggle && mainNav && navOverlay) {
    const openMobileNav = () => {
      document.body.classList.add("nav-open");
      navOverlay.hidden = false;
      navToggle.setAttribute("aria-expanded", "true");
      const icon = navToggle.querySelector(".material-symbols-outlined");
      if (icon) icon.textContent = "close";
    };

    closeMobileNav = () => {
      document.body.classList.remove("nav-open");
      navOverlay.hidden = true;
      navToggle.setAttribute("aria-expanded", "false");
      const icon = navToggle.querySelector(".material-symbols-outlined");
      if (icon) icon.textContent = "menu";
    };

    const mobileNavOpen = () => document.body.classList.contains("nav-open");

    navToggle.addEventListener("click", () => (mobileNavOpen() ? closeMobileNav() : openMobileNav()));
    navOverlay.addEventListener("click", closeMobileNav);

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && mobileNavOpen()) closeMobileNav();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 760 && mobileNavOpen()) closeMobileNav();
    });
  }

  // # links: line up under the fixed header
  const MOBILE_NAV_MAX = 760;

  // How tall is the sticky header area (logo, bar, menu button). Skip the bar on mobile when it's hidden.
  function getAnchorOffsetPx() {
    const w = window.innerWidth;
    const isMobile = w <= MOBILE_NAV_MAX;
    const drawerOpen = document.body.classList.contains("nav-open");

    let maxBottom = 0;
    const useRect = (el) => {
      if (!el) return;
      const st = getComputedStyle(el);
      if (st.display === "none") return;
      const r = el.getBoundingClientRect();
      if (r.width < 1 && r.height < 1) return;
      maxBottom = Math.max(maxBottom, r.bottom);
    };

    useRect(document.querySelector(".navbarlogo"));
    useRect(document.querySelector(".nav-toggle"));

    if (!isMobile || drawerOpen) {
      useRect(document.querySelector(".navbar"));
    }

    const gap = 20;
    return Math.max(72, Math.ceil(maxBottom + gap));
  }

  const NAV_SCROLL_EXTRA_DOWN = {
    servicesection: 56,
    portfolio: 12,
  };

  function getNavScrollAnchor(id) {
    const root = document.getElementById(id);
    if (!root) return null;
    if (id === "portfolio") {
      const heading = root.querySelector(":scope > h2.section-title");
      if (heading) return heading;
    }
    return root;
  }

  function scrollToTarget(target, { smooth = true, extraDownPx = 0 } = {}) {
    if (!target) return;
    const y =
      target.getBoundingClientRect().top + window.scrollY - getAnchorOffsetPx() + extraDownPx;
    window.scrollTo({
      top: Math.max(0, y),
      behavior: reduceMotion || !smooth ? "auto" : "smooth",
    });
  }

  function scrollToSectionId(id, { smooth = true } = {}) {
    const anchor = getNavScrollAnchor(id);
    if (!anchor) return;
    const extra = NAV_SCROLL_EXTRA_DOWN[id] ?? 0;
    scrollToTarget(anchor, { smooth, extraDownPx: extra });
  }

  function goToHash(hash, { smooth = true, updateHistory = true } = {}) {
    if (!hash || hash === "#") return false;
    const id = normalizeHash(hash);
    if (!document.getElementById(id)) return false;

    closeMobileNav();
    const run = () => {
      scrollToSectionId(id, { smooth });
      updateActiveNavFromScroll();
    };
    requestAnimationFrame(() => {
      requestAnimationFrame(run);
    });
    if (updateHistory) {
      try {
        history.pushState(null, "", `#${id}`);
      } catch {
        location.hash = `#${id}`;
      }
    }
    return true;
  }

  function normalizeHash(hash) {
    return String(hash).replace(/^#/, "").trim();
  }

  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    const raw = a.getAttribute("href");
    if (!raw || raw === "#") return;
    const id = normalizeHash(raw);
    if (!id || !document.getElementById(id)) return;

    a.addEventListener("click", (e) => {
      e.preventDefault();
      goToHash(`#${id}`, { smooth: true, updateHistory: true });
    });
  });

  const navLinks = Array.from(document.querySelectorAll(".navbar a")).filter(
    (a) => a.hash && document.getElementById(normalizeHash(a.hash))
  );
  const sections = navLinks
    .map((a) => document.getElementById(normalizeHash(a.hash)))
    .filter(Boolean)
    .sort((a, b) => {
      const ta = a.getBoundingClientRect().top + window.scrollY;
      const tb = b.getBoundingClientRect().top + window.scrollY;
      return ta - tb;
    });

  const setActive = (id) => {
    navLinks.forEach((a) => a.classList.toggle("active", normalizeHash(a.hash) === id));
  };

  function updateActiveNavFromScroll() {
    if (!sections.length) return;
    const line = window.scrollY + getAnchorOffsetPx() + 12;
    let currentId = sections[0].id;
    for (const sec of sections) {
      const top = sec.getBoundingClientRect().top + window.scrollY;
      if (top <= line) currentId = sec.id;
    }
    setActive(currentId);
  }

  let navScrollTick = false;
  window.addEventListener(
    "scroll",
    () => {
      if (navScrollTick) return;
      navScrollTick = true;
      requestAnimationFrame(() => {
        navScrollTick = false;
        updateActiveNavFromScroll();
      });
    },
    { passive: true }
  );

  let resizeNavTimer = null;
  window.addEventListener("resize", () => {
    window.clearTimeout(resizeNavTimer);
    resizeNavTimer = window.setTimeout(() => updateActiveNavFromScroll(), 100);
  });

  updateActiveNavFromScroll();

  if (location.hash) {
    const id = normalizeHash(location.hash);
    if (id && document.getElementById(id)) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          scrollToSectionId(id, { smooth: false });
          updateActiveNavFromScroll();
        });
      });
    }
  }

  // Culture cards: fade in when they scroll into view
  const cultureCards = document.querySelectorAll(".culture-card");
  if (cultureCards.length) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    cultureCards.forEach((card) => observer.observe(card));
  }

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

  // Touch devices: one-tap hover feedback (without sticky :hover behavior)
  if (window.matchMedia("(hover: none), (pointer: coarse)").matches) {
    const tapCards = document.querySelectorAll(
      ".card1, .card2, .card3, .servicecards > div, .culture-card, .tech-card, .team-card, .faq-card"
    );
    const pulse = (el) => {
      if (!el) return;
      el.classList.remove("is-tapped");
      void el.offsetWidth;
      el.classList.add("is-tapped");
      window.setTimeout(() => el.classList.remove("is-tapped"), 260);
    };
    tapCards.forEach((el) => {
      el.addEventListener(
        "touchstart",
        () => {
          pulse(el);
        },
        { passive: true }
      );
    });
  }

  // Nav link in mobile menu: close the drawer
  if (mainNav) {
    mainNav.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => closeMobileNav());
    });
  }
});
