/**
 * Duplicates the partner logo row once so the CSS marquee can translate -50%
 * without maintaining many repeated blocks in HTML.
 */
document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".customerlist-track");
  const set = document.querySelector(".customerlist-set");
  if (!track || !set || track.dataset.marqueeReady === "1") return;
  track.dataset.marqueeReady = "1";
  track.appendChild(set.cloneNode(true));
});
