# NNF Global — Landing Site

Static marketing site for **NNF Global**, a Malaysian project consultancy and venture
builder, and the parent/exclusive promoter of two ventures — **Hentian Bas Mesra Rakyat**
and **Saté Ria**. Vanilla HTML/CSS/JS, a hash-based router for dynamic page loading, and
an **EN / BM** language toggle. No build step, no backend — deploys straight to GitHub Pages.

## Run locally

The router fetches HTML fragments, so you must serve over HTTP (opening `index.html` via
`file://` will be blocked by CORS). Any static server works:

```bash
# Python
python -m http.server 8000
# then open http://localhost:8000

# or Node
npx serve .
```

## Deploy to GitHub Pages

1. Push to GitHub.
2. **Settings → Pages → Build and deployment → Source: Deploy from a branch**.
3. Branch: `main`, folder: `/ (root)`. Save.
4. Site goes live at `https://<user>.github.io/<repo>/`.

All asset paths are **relative**, so it works under a project subpath. `404.html` is a copy
of `index.html` so deep links refresh back into the hash router, and `.nojekyll` stops
Jekyll from touching the `assets/` folder.

## Project structure

```
index.html        App shell: header (nav + lang toggle), <main>, footer
404.html          Copy of index.html (GitHub Pages refresh safety net)
.nojekyll         Disable Jekyll processing
assets/
  css/  tokens.css   Design tokens (navy/charcoal + gold corporate palette)
        main.css     Layout, components, responsive, animations
  js/   router.js    Hash router (#/, #/about, #/projects, #/contact)
        i18n.js      EN/BM dictionary loader + DOM application
        app.js       Bootstrap, header, nav, scroll reveal, counters
  icons/sprite.svg   Inline SVG icon symbols
  images/            User-supplied images (see "Images" below)
pages/
  home.html  about.html  projects.html  contact.html
i18n/
  en.json  ms.json
docs/superpowers/specs/   Design spec
```

## Content sources

- **Company facts** — SSM business registration (Reg. No. 202603031145 / TR0336679-K).
- **Hentian Bas Mesra Rakyat** — the project pitch deck (PFI bus terminals).
- **Saté Ria** — the existing brand site at [sateria.my](https://sateria.my).

## Images

No photography ships with the site. Every `<img>` points at its final path under
`assets/images/` and falls back to a styled placeholder if the file is missing. Each slot
has a **generation prompt** in an HTML comment immediately above it — generate the image,
drop it in at the named path, and it appears automatically. Slots:

| File | Used on |
|------|---------|
| `hero.jpg` | Home hero |
| `venture-hentianbas.jpg`, `venture-sateria.jpg` | Home venture cards |
| `about.jpg` | About intro |
| `hentianbas-hero.jpg`, `sateria-hero.jpg` | Projects page |
| `og-cover.jpg` | Social share preview |

## Customising

- **Contact details** live in `index.html` (footer) and `pages/contact.html`. Swap the
  `mailto:`/`tel:` values if a dedicated company inbox replaces the registered contact.
- **Copy** is driven by `i18n/en.json` + `i18n/ms.json`; inline text in the page fragments
  is the English fallback. Keep both in sync when editing.
