/* ==========================================================================
   NNF Global — Hash Router
   Maps #/route -> pages/<fragment>.html, fetches and injects into #main.
   GitHub-Pages safe (no server rewrites needed). Handles loading / error /
   not-found states and emits "route:rendered" so i18n + reveals re-run.
   ========================================================================== */
(function () {
  "use strict";

  var ROUTES = {
    "/":         { file: "pages/home.html",     title: "NNF Global — Malaysian Project Consultancy & Venture Builder" },
    "/about":    { file: "pages/about.html",    title: "About — NNF Global" },
    "/projects": { file: "pages/projects.html", title: "Projects — NNF Global" },
    "/contact":  { file: "pages/contact.html",  title: "Contact — NNF Global" }
  };

  var cache = {};
  var outlet;
  var token = 0; // guards against out-of-order async renders

  function path() {
    var h = location.hash.replace(/^#/, "");
    if (!h || h === "/") return "/";
    return h.replace(/\/+$/, "") || "/";
  }

  function skeleton() {
    return '' +
      '<div class="route-skeleton" aria-hidden="true">' +
        '<div class="container">' +
          '<div class="sk sk--eyebrow"></div>' +
          '<div class="sk sk--title"></div>' +
          '<div class="sk sk--title sk--short"></div>' +
          '<div class="sk-grid">' +
            '<div class="sk sk--card"></div><div class="sk sk--card"></div><div class="sk sk--card"></div>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  function errorView(route) {
    return '' +
      '<section class="route-error container">' +
        '<p class="eyebrow eyebrow--steel">Something went wrong</p>' +
        '<h1 class="route-error__title">We couldn’t load this page.</h1>' +
        '<p class="route-error__body">Check your connection and try again.</p>' +
        '<button class="btn btn--gold" type="button" data-retry="' + route + '">Retry</button>' +
      '</section>';
  }

  function notFound() {
    return '' +
      '<section class="route-error container">' +
        '<p class="eyebrow eyebrow--steel">404</p>' +
        '<h1 class="route-error__title">This page took a wrong turn.</h1>' +
        '<p class="route-error__body">The page you’re after doesn’t exist.</p>' +
        '<a class="btn btn--gold" href="#/">Back to home</a>' +
      '</section>';
  }

  function fetchFragment(file) {
    if (cache[file]) return Promise.resolve(cache[file]);
    return fetch(file, { cache: "no-cache" }).then(function (r) {
      if (!r.ok) throw new Error(file + " " + r.status);
      return r.text();
    }).then(function (html) { cache[file] = html; return html; });
  }

  function setActiveNav(p) {
    document.querySelectorAll("[data-route]").forEach(function (a) {
      var on = a.getAttribute("data-route") === p;
      a.classList.toggle("is-active", on);
      if (on) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  }

  function finish(p) {
    setActiveNav(ROUTES[p] ? p : null);
    document.title = (ROUTES[p] && ROUTES[p].title) || "NNF Global";
    if (window.I18n) window.I18n.apply(outlet);
    // notify the app (reveal animations, focus, etc.)
    document.dispatchEvent(new CustomEvent("route:rendered", { detail: { path: p } }));
    // move focus to main for screen-reader users (skip on first paint)
    if (finish._ready) {
      try { document.getElementById("main").focus({ preventScroll: true }); } catch (e) {}
    }
    finish._ready = true;
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function render() {
    var p = path();
    var route = ROUTES[p];
    var my = ++token;

    if (!route) { outlet.innerHTML = notFound(); finish(p); return; }

    outlet.innerHTML = skeleton();
    fetchFragment(route.file)
      .then(function (html) {
        if (my !== token) return;            // a newer navigation won
        outlet.innerHTML = html;
        finish(p);
      })
      .catch(function (err) {
        if (my !== token) return;
        console.warn("[router]", err);
        outlet.innerHTML = errorView(p);
      });
  }

  function init() {
    outlet = document.getElementById("main");
    window.addEventListener("hashchange", render);
    outlet.addEventListener("click", function (e) {
      var retry = e.target.closest("[data-retry]");
      if (retry) { e.preventDefault(); render(); }
    });
    // Render exactly once on load. If there's no hash, set it — the resulting
    // (async) hashchange drives the single render; otherwise render directly.
    if (!location.hash || location.hash === "#") {
      location.hash = "#/";       // fires hashchange -> render()
    } else {
      render();
    }
  }

  window.Router = { init: init, navigate: function (p) { location.hash = "#" + p; } };
})();
