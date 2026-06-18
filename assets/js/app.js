/* ==========================================================================
   NNF Global — App bootstrap
   Loads icon sprite, inits i18n + router, wires header behaviours, and runs
   scroll-reveal + stat counters after each route render.
   ========================================================================== */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Inline the SVG sprite so <use href="#icon-*"> resolves ---- */
  function loadSprite() {
    return fetch("assets/icons/sprite.svg", { cache: "force-cache" })
      .then(function (r) { return r.ok ? r.text() : ""; })
      .then(function (svg) {
        if (svg) {
          var host = document.getElementById("svg-sprite-host");
          if (host) host.innerHTML = svg;
        }
      })
      .catch(function () { /* icons degrade gracefully */ });
  }

  /* ---- Header: transparent only over the home hero, solid otherwise ---- */
  var headerEl;
  function updateHeader() {
    if (!headerEl) return;
    var overHero = document.body.classList.contains("route-home");
    var atTop = window.scrollY <= 12;
    headerEl.classList.toggle("is-scrolled", !(overHero && atTop));
  }
  function initHeader() {
    headerEl = document.getElementById("site-header");
    window.addEventListener("scroll", updateHeader, { passive: true });
    updateHeader();
  }

  /* ---- Mobile nav ---- */
  function initNavToggle() {
    var btn = document.getElementById("nav-toggle");
    var nav = document.getElementById("primary-nav");
    if (!btn || !nav) return;

    var setOpen = function (open) {
      document.body.classList.toggle("nav-open", open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    };
    btn.addEventListener("click", function () {
      setOpen(!document.body.classList.contains("nav-open"));
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });
  }

  /* ---- Language toggle ---- */
  function initLangToggle() {
    document.querySelectorAll(".lang-toggle__btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        window.I18n.setLang(btn.getAttribute("data-lang"));
      });
    });
  }

  /* ---- Scroll reveal ---- */
  var io;
  function revealIn(scope) {
    var items = (scope || document).querySelectorAll("[data-reveal]");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }
    if (!io) {
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    }
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---- Animated stat counters ---- */
  function countUp(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var suffix = el.getAttribute("data-suffix") || "";
    var decimals = (el.getAttribute("data-count").split(".")[1] || "").length;
    if (reduceMotion) { el.textContent = target.toFixed(decimals) + suffix; return; }
    var start = performance.now(), dur = 1400;
    function frame(now) {
      var p = Math.min((now - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function initCounters(scope) {
    var nums = (scope || document).querySelectorAll("[data-count]");
    if (!("IntersectionObserver" in window)) { nums.forEach(countUp); return; }
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { countUp(e.target); co.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    nums.forEach(function (n) { co.observe(n); });
  }

  /* ---- After each route render ---- */
  document.addEventListener("route:rendered", function (e) {
    var main = document.getElementById("main");
    document.body.classList.toggle("route-home", !!(e.detail && e.detail.path === "/"));
    updateHeader();
    main.classList.remove("route-enter");
    void main.offsetWidth; // force reflow so the animation re-triggers
    main.classList.add("route-enter");
    revealIn(main);
    initCounters(main);
  });

  /* ---- Boot ---- */
  function boot() {
    initHeader();
    initNavToggle();
    initLangToggle();
    loadSprite();
    window.I18n.init().then(function () {
      window.Router.init();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
