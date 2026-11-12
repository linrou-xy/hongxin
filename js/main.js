/* ==========================================================================
   沃野红心 · 公共脚本
   负责：导航、滚动进度、进入视口动效与轻量视差
   ========================================================================== */

(function () {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const header = document.querySelector("[data-header]");
  const progress = document.querySelector("[data-progress]");
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector("#site-nav");

  /* ---------- 顶栏 ---------- */

  function setHeaderState() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 20);
  }

  function closeNav() {
    if (!nav || !navToggle) return;
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "打开导航");
    document.body.classList.remove("is-locked");
  }

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      const isOpen = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute("aria-label", isOpen ? "关闭导航" : "打开导航");
      document.body.classList.toggle("is-locked", isOpen);
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeNav);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeNav();
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 980) closeNav();
    });
  }

  /* ---------- 阅读进度 ---------- */

  function setProgress() {
    if (!progress) return;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0;
    progress.style.transform = "scaleX(" + ratio + ")";
  }

  let ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      setHeaderState();
      setProgress();
      updateParallax();
      ticking = false;
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  setHeaderState();
  setProgress();

  /* ---------- 进入视口 ---------- */

  const revealItems = document.querySelectorAll("[data-reveal]");

  if ("IntersectionObserver" in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -5% 0px" }
    );

    revealItems.forEach(function (item) {
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
  }

  /* ---------- 轻量视差 ---------- */

  const parallaxItems = Array.from(document.querySelectorAll("[data-parallax]"));

  function updateParallax() {
    if (reducedMotion || parallaxItems.length === 0) return;
    const viewportH = window.innerHeight;
    parallaxItems.forEach(function (item) {
      const rect = item.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > viewportH) return;
      const strength = parseFloat(item.dataset.parallax) || 0.04;
      const offset = (rect.top - viewportH / 2) * strength;
      item.style.transform = "translate3d(0," + offset.toFixed(1) + "px,0)";
    });
  }

  updateParallax();
})();
