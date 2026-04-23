/**
 * Static portfolio data (no backend). Shelved API lives in /archive/backend.
 */
const STATIC_PORTFOLIO_PROJECTS = [
  ["interactive-3d-web-experience", "Interactive 3D Web Experience", "SE1.png"],
  ["motion-driven-landing-page", "Motion-Driven Landing Page", "SE2.png"],
  ["product-visualization-platform", "Product Visualization Platform", "SE3.png"],
  ["industrial-render-set", "Industrial Render Set", "SE4.png"],
  ["prototype-storyboard", "Prototype Storyboard", "SE5.png"],
  ["process-animation-flow", "Process Animation Flow", "SE6.png"],
  ["configuration-showcase", "Configuration Showcase", "SE7.png"],
  ["assembly-walkthrough", "Assembly Walkthrough", "SE8.png"],
  ["ui-engineering-concept", "UI + Engineering Concept", "SE9.png"],
  ["landing-experience-build", "Landing Experience Build", "SE10.png"],
  ["motion-graphics-sequence", "Motion Graphics Sequence", "SE11.png"],
  ["product-storytelling-set", "Product Storytelling Set", "SE12.png"],
].map(([slug, title, file], sort_order) => ({
  id: sort_order + 1,
  slug,
  title,
  summary: "Curated client project delivery",
  locale: "en",
  is_published: true,
  sort_order,
  media: [
    {
      id: sort_order + 1,
      image_url: `../../Imazhet/Projektet/${file}`,
      alt_text: title,
      title,
      sort_order: 0,
    },
  ],
}));

function initPortfolioGrid() {
  const grid = document.querySelector(".portfolio-grid");
  if (!grid) return;

  const locale = grid.getAttribute("data-locale") || "en";
  const projects = STATIC_PORTFOLIO_PROJECTS.filter((p) => p.locale === locale);

  const renderEmpty = () => {
    grid.innerHTML =
      '<p class="portfolio-empty" role="status">No projects for this language yet.</p>';
    document.dispatchEvent(new CustomEvent("portfolio:ready"));
  };

  const renderProjects = () => {
    if (!projects.length) {
      renderEmpty();
      return;
    }
    grid.innerHTML = "";
    projects.forEach((project) => {
      const media = Array.isArray(project.media) ? [...project.media].sort((a, b) => a.sort_order - b.sort_order) : [];
      const cover = media[0];
      if (!cover) return;
      const card = document.createElement("article");
      card.className = "portfolio-card";
      card.innerHTML = `
        <button type="button" class="portfolio-open" data-full="${cover.image_url}" aria-label="Open ${project.title} image">
          <img src="${cover.image_url}" alt="${cover.alt_text || project.title}" loading="lazy" decoding="async" />
        </button>
        <h2>${project.title}</h2>
      `;
      grid.appendChild(card);
    });
    if (!grid.querySelector(".portfolio-card")) {
      grid.innerHTML =
        '<p class="portfolio-empty" role="status">No cover images configured for these projects.</p>';
    }
    document.dispatchEvent(new CustomEvent("portfolio:ready"));
  };

  try {
    renderProjects();
  } catch {
    grid.innerHTML =
      '<p class="portfolio-empty portfolio-empty--warn" role="alert">Could not render the portfolio. Try refreshing the page.</p>';
    document.dispatchEvent(new CustomEvent("portfolio:ready"));
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPortfolioGrid, { once: true });
} else {
  initPortfolioGrid();
}
