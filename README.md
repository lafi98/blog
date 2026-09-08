# SignalLab — Global IPTV Technology Publication

A multi-page static editorial site in **English** for a **global audience**: independent
reviews of IPTV player apps, rankings and comparisons, setup guides, verified streaming
industry news, and support content. **Publication only — no subscriptions sold, no
playlists supplied, no channel-access claims.**

## Structure (16 pages)

```
index.html                 Home
apps.html                  Directory of 12 apps (platform filters + search)
app.html?id=<slug>         Full review template for each app
reviews.html               All reviews ordered by score
best-iptv-players.html     2026 ranking + methodology + top-8 table + FAQ
comparison.html            Full 12-app feature matrix (M3U/Xtream/EPG/platforms)
blog.html                  Blog (category filters + search) — 13 articles
news.html                  News — 8 sourced reports (verified 2025–2026 events)
article.html?id=<slug>     Article/news template
guides.html                Guide hub organised by task (setup/fix/learn/legal)
channels.html              Channel-category info + where to watch each genre legally
reseller.html              Educational reseller-model explainer + legitimacy checklist
support.html               Symptom-based help hub
faq.html                   FAQ (14 accordions, FAQPage schema)
contact.html               Contact form (front-end only, labelled demo)
about.html                 About + editorial policy

css/style.css              Design system (Bricolage Grotesque/Figtree/JetBrains Mono,
                           dark, mint #5ef2b4 → cyan #43d9e6)
js/data.js                 12 apps + 13 blog articles (all original English content)
js/news.js                 8 sourced news reports
js/main.js                 Render engine (body[data-page]), filters, search, SVG art
partials/ + src-pages/     Page sources; build.py injects the shared header/footer
docs/research-global.md    Global SERP/keyword research + verified news facts + app
                           fact-checks (with source URLs)
sitemap.xml, robots.txt    Technical SEO
```

## Build & preview

Edit pages in `src-pages/` (or `partials/`), then:

```bash
python3 build.py
```

All root `*.html` files are generated — edit sources, not outputs. Preview: rsync the
folder to the session scratchpad and use the `signallab-site` server (port 8934) in
`.claude/launch.json` — macOS TCC blocks preview servers from reading ~/Downloads
directly.

## Deployment notes

- The domain `https://www.signallab.tv/` is a **placeholder** — replace it in every
  `<link rel="canonical">`, `og:url`, JSON-LD block, `sitemap.xml` and `robots.txt`
  before publishing for real.
- The contact form is front-end only (labelled as a demo on the page).
- Review scores are editorial judgements with an open methodology at
  `best-iptv-players.html#methodology` — no fabricated lab results, user numbers
  or awards anywhere on the site.
- App store availability is volatile in this niche (see docs/research-global.md §4);
  reviews carry per-app caveats (Smarters removals, GSE Apple-only, Vega OS limits).
  Re-verify before major republishing.

## Editorial position (do not change casually)

Every page holds the same line: player technology and software = legal; selling
unlicensed access = not; only licensed services are endorsed. The reseller page is
educational, not recruitment. News is sourced; unverifiable claims are labelled
opinion.
