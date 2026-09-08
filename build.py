#!/usr/bin/env python3
"""Inject the shared header/footer from partials/ into the page sources in
src-pages/ and write the results to the project root. Sets aria-current="page"
on the nav link matching each file name. Every page, including index.html,
lives in src-pages/."""
import pathlib

ROOT = pathlib.Path(__file__).parent
SRC = ROOT / "src-pages"
header = (ROOT / "partials/header.html").read_text(encoding="utf-8")
footer = (ROOT / "partials/footer.html").read_text(encoding="utf-8")

# Template pages map to their parent nav item
ALIAS = {
    "app.html": "apps.html",
    "article.html": "blog.html",
}

changed = 0
for page in sorted(SRC.glob("*.html")):
    html = page.read_text(encoding="utf-8")
    cur = ALIAS.get(page.name, page.name)
    h = header.replace('href="%s"' % cur, 'href="%s" aria-current="page"' % cur, 2)
    out = html.replace("<!--#header-->", h).replace("<!--#footer-->", footer)
    (ROOT / page.name).write_text(out, encoding="utf-8")
    changed += 1
print("built:", changed, "pages")
