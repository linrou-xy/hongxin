/* ==========================================================================
   沃野红心 · 校史页脚本
   负责：时间轴与章节联动
   ========================================================================== */

(function () {
  "use strict";

  const chapters = Array.from(document.querySelectorAll(".story-chapter[id]"));
  const yearLinks = Array.from(document.querySelectorAll(".year-rail a[href^='#']"));

  if (chapters.length === 0 || yearLinks.length === 0) return;

  function setActive(id) {
    yearLinks.forEach(function (link) {
      const isActive = link.getAttribute("href") === "#" + id;
      link.classList.toggle("is-active", isActive);
      if (isActive) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  }

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          setActive(entry.target.id);
        });
      },
      { rootMargin: "-25% 0px -58% 0px", threshold: 0.01 }
    );

    chapters.forEach(function (chapter) {
      observer.observe(chapter);
    });
  }

  yearLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      setActive(link.getAttribute("href").replace("#", ""));
    });
  });
})();
