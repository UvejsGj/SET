document.addEventListener("DOMContentLoaded", () => {
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const language = {
    en: {
      navHome: "Home",
      navAbout: "About",
      navServices: "Services",
      navTeam: "Team",
      navPortfolio: "Portfolio",
      navContact: "Contact Us",
      navFaq: "FAQ",
      heroTitle: "Build Smarter Products with <br />Smart Engineering",
      heroTagline: "From concept to launch-ready delivery.",
      partners: "Partners",
      about: "About Us",
      servicesTitle: "Services",
      servicesIntro: "Engineering, design, and product storytelling services tailored to move work from idea to execution.",
      lifeTitle: "Life at Smart Engineering",
      techTitle: "Our Technologies",
      techIntro: "We combine proven tools and modern frameworks to ship reliable digital and visual product experiences.",
      teamTitle: "Meet Our Team",
      portfolioTitle: "Portfolio",
      contactTitle: "Contact Us",
      contactIntro: "Share your goals, timeline, and constraints. We usually respond within one business day.",
      contactEmail: "Email",
      contactPhone: "Phone",
      contactLocation: "Location",
      contactSubmit: "Send message",
      faqTitle: "Frequently Asked Questions",
      faqQ1: "Can you handle large-scale projects?",
      faqQ2: "How do you approach a design project?",
      faqQ3: "Can you customize your services?",
      faqQ4: "What kind of support do you provide after project delivery?",
      footerBrand: "© Copyright Smart Engineering. All Rights Reserved",
      footerPolicy: "Privacy Policy",
      phName: "Your name",
      phEmail: "you@company.com",
      phSubject: "Project scope or support request",
      phMessage: "Share your goals, timeline, budget range, and what success looks like...",
      aboutCards: [
        "Happy clients who trust us to deliver practical, measurable outcomes.",
        "Years of cross-disciplinary delivery experience across engineering and digital products.",
        "Projects completed from early concept through production-ready delivery."
      ],
      serviceTitles: ["3D Cad", "Web Development", "UI/UX Design", "Animation", "Support"],
      serviceDescs: [
        "Precision 3D CAD from detailed part modeling to presentation-ready product visuals.",
        "Responsive web products engineered for performance, clarity, and growth.",
        "UI/UX systems designed for fast adoption and real-world usability.",
        "2D and 3D animation that explains products, processes, and ideas clearly.",
        "Ongoing technical support with predictable response times and long-term reliability."
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
        "3D Printing",
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
      navPortfolio: "Portofoli",
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
      techIntro: "Ne përdorim mjete të avancuara-si animacioni 3D, motion graphics dhe framework modern-për të ndërtuar përvoja vizuale tërheqëse dhe interaktive.",
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
      footerBrand: "© Copyright Smart Engineering. Të gjitha të drejtat e rezervuara",
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
        "Printim 3D",
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
    const dict = language[lang] || language.en;
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
    setText(".tech-intro", dict.techIntro);
    setText("#team .section-title", dict.teamTitle);
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
    setText(".footer-link-policy", dict.footerPolicy);

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
});
