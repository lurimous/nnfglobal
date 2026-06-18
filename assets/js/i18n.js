/* ==========================================================================
   NNF Global — i18n
   Tiny dictionary-based translator. Strings live in i18n/<lang>.json.
   Markup opts in via:
     data-i18n="section.key"               -> sets textContent
     data-i18n-attr="attr:section.key,..." -> sets one or more attributes
   ========================================================================== */
(function () {
  "use strict";

  var SUPPORTED = ["en", "ms"];
  var DEFAULT = "en";
  var STORE_KEY = "nnfglobal.lang";

  var dicts = {};            // { en: {...}, ms: {...} }
  var current = DEFAULT;
  var listeners = [];

  function resolve(dict, dotted) {
    return dotted.split(".").reduce(function (o, k) {
      return o && o[k] != null ? o[k] : null;
    }, dict);
  }

  function t(key) {
    var d = dicts[current] || {};
    var val = resolve(d, key);
    if (val == null && current !== DEFAULT) val = resolve(dicts[DEFAULT] || {}, key);
    return val;
  }

  function applyTo(root) {
    root = root || document;

    root.querySelectorAll("[data-i18n]").forEach(function (el) {
      var val = t(el.getAttribute("data-i18n"));
      if (val != null) {
        // allow simple inline markup from the dictionary (e.g. <em>, <br>)
        if (/[<&]/.test(val)) el.innerHTML = val;
        else el.textContent = val;
      }
    });

    root.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      el.getAttribute("data-i18n-attr").split(",").forEach(function (pair) {
        var bits = pair.split(":");
        if (bits.length === 2) {
          var val = t(bits[1].trim());
          if (val != null) el.setAttribute(bits[0].trim(), val);
        }
      });
    });
  }

  function load(lang) {
    if (dicts[lang]) return Promise.resolve(dicts[lang]);
    return fetch("i18n/" + lang + ".json", { cache: "no-cache" })
      .then(function (r) {
        if (!r.ok) throw new Error("dict " + lang + " " + r.status);
        return r.json();
      })
      .then(function (json) {
        dicts[lang] = json;
        return json;
      });
  }

  function setLang(lang, opts) {
    opts = opts || {};
    if (SUPPORTED.indexOf(lang) === -1) lang = DEFAULT;
    return load(lang).then(function () {
      current = lang;
      document.documentElement.setAttribute("lang", lang);
      try { localStorage.setItem(STORE_KEY, lang); } catch (e) {}
      applyTo(document);
      // reflect active toggle button
      document.querySelectorAll(".lang-toggle__btn").forEach(function (b) {
        var on = b.getAttribute("data-lang") === lang;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-pressed", on ? "true" : "false");
      });
      if (!opts.silent) listeners.forEach(function (fn) { fn(lang); });
    }).catch(function (err) {
      console.warn("[i18n]", err);
    });
  }

  function stored() {
    try { return localStorage.getItem(STORE_KEY); } catch (e) { return null; }
  }

  function init() {
    var initial = stored() || (navigator.language || "").slice(0, 2);
    if (SUPPORTED.indexOf(initial) === -1) initial = DEFAULT;
    // preload default too, for fallback
    var pre = initial === DEFAULT ? load(DEFAULT) : Promise.all([load(DEFAULT), load(initial)]);
    return pre.then(function () { return setLang(initial, { silent: true }); });
  }

  window.I18n = {
    init: init,
    setLang: setLang,
    apply: applyTo,
    t: t,
    get lang() { return current; },
    onChange: function (fn) { listeners.push(fn); }
  };
})();
