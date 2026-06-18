# NNF Global — Landing Site Design

**Date:** 2026-06-18
**Status:** Approved
**Source material:** `TR0336679-K_*.pdf` (SSM business registration), `HENTIAN BAS MESRA RAKYAT SDN BHD NEW.pptx`, and the existing `SateRia` site (reference stack).

## Overview

A multi-page marketing site for **NNF Global**, a Malaysian project consultancy and
venture builder that is the parent/promoter of two ventures:
**Hentian Bas Mesra Rakyat** and **Saté Ria**. Built as a **vanilla HTML + CSS + JS**
static site, deployable to **GitHub Pages** with no build step and no backend. Pages
load dynamically via a client-side **hash router** (ported from SateRia). Supports an
**English / Bahasa Malaysia** language toggle.

### Goals
- Position NNF Global as a credible parent brand above its two ventures.
- Showcase the two projects as cards that link out (Saté Ria → sateria.my;
  Hentian Bas → enquiry, no live site yet).
- Be fast, accessible, and self-contained on GitHub Pages.

### Non-Goals (YAGNI)
- No backend, database, or SSR. Contact uses `mailto:`/`tel:` only.
- No on-page deep-dive per project beyond the showcase cards/summaries.
- Only EN + BM authored.

## Company facts (from SSM registration)
- Name: **NNF GLOBAL** — Reg. No **202603031145 (TR0336679-K)**, sole proprietorship.
- Owner: Nadia Nabila Binti Farid. Commenced 26-01-2026, valid to 26-01-2031.
- Address: 5-06 Residensi Sri Tanjung, Jalan Sri Tanjung 17, Taman Sri Tanjung,
  43500 Semenyih, Selangor.
- Contact: nadianabilafarid.nnf@gmail.com, +60 18-661 5067.
- Business scope: Project Consultant; retail over internet; consultancy; event
  organization/promotion/management; sports-event organization & promotion; live event
  production; prepared-meals manufacturing; wholesale foodstuffs; fast-food restaurants;
  mobile food carts; food stalls/hawkers; other food services.
- Leadership (shared across ventures): Chairman **YM Ungku Fadli Ungku Jalil**;
  Group MD & CEO **Dato' Seri Farid Ibrahim**.

## Projects
- **Hentian Bas Mesra Rakyat** — Private-Finance-Initiative "people-friendly" world-class
  3-storey bus stops: air-conditioned waiting halls, ergonomic seating, CCTV/security,
  fast-food + convenience + cyber café, ATM, modern toilets, surau, digital billboards,
  cellular antennas. ~2,400 sq ft, steel structure on concrete foundation. Prototypes at
  Air Keroh (Melaka) and Selayang (Selangor); engaged with PBTs nationwide. Pillars:
  Kukuh, Selesa, Selamat, Mudah, Hebat, Mesra Rakyat. No live site → card CTA = Enquire.
- **Saté Ria** — Malaysia's iconic satay brand, revival 2025–2028. Card links out to
  sateria.my.

## Visual Design System — "parent brand"
Distinct holding-company identity in the same premium family as Saté Ria but clearly
*above* it.

- **Palette:** deep midnight navy + charcoal base, gold accent, light reading sections.
  Per-venture accent tints: Saté Ria gold-amber, Hentian Bas steel-blue.
- **Type:** Playfair Display SC (headings) + Karla (body/UI) — continuity with Saté Ria.
- **Tokens** in `assets/css/tokens.css`; layout/components in `assets/css/main.css`.
- Spacing 4/8 rhythm; container ~1200px; motion gated by `prefers-reduced-motion`;
  inline SVG sprite for icons (no emoji).

## Architecture (ported from SateRia)
```
/
├── index.html              # Shell: header nav + EN/BM toggle, <main id="main">, footer
├── 404.html                # Hash-router safety net for GitHub Pages
├── .nojekyll
├── README.md
├── assets/
│   ├── css/{tokens.css, main.css}
│   ├── js/{router.js, i18n.js, app.js}
│   ├── icons/sprite.svg
│   └── images/             # styled placeholders + generation prompts
├── pages/{home,about,projects,contact}.html
└── i18n/{en.json, ms.json}
```

### Router (`router.js`)
Hash-based (`#/`, `#/about`, `#/projects`, `#/contact`), default `#/` → home. Fetches
`pages/<name>.html` fragment, injects into `#main`, sets `aria-current`, scrolls top,
fires `route:rendered` so i18n + reveal animations re-run. Inline error + 404 states.

### i18n (`i18n.js`)
`data-i18n` keys + `data-i18n-attr`; loads `i18n/en.json` + `ms.json`; persists choice in
`localStorage`; sets `<html lang>`; default EN, EN|BM segmented toggle.

### Pages
- **home.html** — Hero; "what NNF is" intro; two featured project cards; leadership strip;
  credibility/stats band; CTA → Contact.
- **about.html** — NNF story & mandate; business scope; registration facts; leadership.
- **projects.html** — Hentian Bas card (features, prototypes, Enquire CTA) + Saté Ria card
  (links out to sateria.my).
- **contact.html** — `mailto:`/`tel:`/address from registration; no backend.

### Images
No NNF photos exist → every slot is a styled placeholder with an inline generation prompt
and an `onerror` fallback, exactly as in SateRia.

## Accessibility & Deployment
Contrast ≥4.5:1 body; visible focus; skip link; semantic landmarks; ≥44px targets;
`prefers-reduced-motion`. Static, relative paths, hash routing → no Pages config; `.nojekyll`.
