/* SignalLab — page engine. Content comes from js/data.js (SL.apps / SL.posts). */
(function () {
  "use strict";
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (m) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m];
    });
  };
  var qs = function (k) {
    var m = new RegExp("[?&]" + k + "=([^&]+)").exec(location.search);
    return m ? decodeURIComponent(m[1]) : null;
  };
  var DATE_OPT = { day: "numeric", month: "long", year: "numeric" };
  var fmtDate = function (iso) {
    try { return new Date(iso + "T00:00:00").toLocaleDateString("en-GB", DATE_OPT); }
    catch (e) { return iso; }
  };

  /* ---------- header + mobile menu ---------- */
  var head = $(".site-head");
  var onScroll = function () {
    if (head) head.classList.toggle("scrolled", (window.scrollY || 0) > 12);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  var mb = $(".menu-btn");
  if (mb) mb.addEventListener("click", function () {
    var open = document.body.classList.toggle("menu-open");
    mb.setAttribute("aria-expanded", open ? "true" : "false");
  });
  $$(".drawer a").forEach(function (a) {
    a.addEventListener("click", function () { document.body.classList.remove("menu-open"); });
  });

  /* ---------- reveal (position-checked; immune to preview quirks) ---------- */
  function reveal() {
    var vh = window.innerHeight || document.documentElement.clientHeight || 900;
    $$(".rv:not(.in)").forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < vh * 0.94 || vh < 10) el.classList.add("in");
    });
  }
  window.addEventListener("scroll", reveal, { passive: true });
  window.addEventListener("resize", reveal);
  document.addEventListener("DOMContentLoaded", reveal);
  setTimeout(reveal, 60); setTimeout(reveal, 400); setTimeout(reveal, 1200);

  /* ---------- generated artwork ---------- */
  function tileHTML(app, lg) {
    return '<div class="tile' + (lg ? " lg" : "") + '" style="background:linear-gradient(135deg,hsl(' +
      app.h1 + ',72%,62%),hsl(' + app.h2 + ',78%,50%))" aria-hidden="true">' + esc(app.initials) + "</div>";
  }
  function coverSVG(p) {
    var h = p.hue, id = "g" + p.id.replace(/[^a-z0-9]/gi, "");
    return '<svg viewBox="0 0 640 360" role="img" aria-label="' + esc(p.alt || p.title) + '" preserveAspectRatio="xMidYMid slice">' +
      '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="hsl(' + h + ',45%,14%)"/><stop offset="1" stop-color="hsl(' + (h + 40) + ',50%,9%)"/></linearGradient></defs>' +
      '<rect width="640" height="360" fill="url(#' + id + ')"/>' +
      '<g stroke="hsl(' + h + ',80%,62%)" stroke-opacity=".22" fill="none">' +
      '<path d="M0 300 Q160 ' + (200 + (h % 60)) + ' 320 280 T640 250" stroke-width="2"/>' +
      '<path d="M0 330 Q200 ' + (250 + (h % 40)) + ' 360 310 T640 300" stroke-width="1.4"/></g>' +
      '<g fill="hsl(' + h + ',85%,66%)" fill-opacity=".8">' +
      '<circle cx="' + (80 + (h % 340)) + '" cy="' + (70 + (h % 90)) + '" r="5"/>' +
      '<circle cx="' + (520 - (h % 200)) + '" cy="' + (120 + (h % 60)) + '" r="3"/></g>' +
      '<g font-family="JetBrains Mono,monospace" font-size="15" fill="hsl(' + h + ',70%,72%)" fill-opacity=".55">' +
      '<text x="34" y="52">// ' + esc(p.tag || p.cat) + "</text></g>" +
      '<rect x="34" y="298" width="120" height="4" rx="2" fill="hsl(' + h + ',80%,60%)" fill-opacity=".85"/></svg>';
  }

  /* ---------- card templates ---------- */
  function appCard(a) {
    return '<a class="card app-card rv" href="app.html?id=' + a.id + '">' +
      '<div class="top">' + tileHTML(a) +
      "<div><h3>" + esc(a.name) + '</h3><span class="badge ' + (a.model === "Free" ? "mint" : "") + '">' + esc(a.model) + "</span></div></div>" +
      "<p>" + esc(a.short) + "</p>" +
      '<div class="plats">' + a.platforms.slice(0, 4).map(function (p) { return "<span>" + esc(p) + "</span>"; }).join("") +
      (a.platforms.length > 4 ? "<span>+" + (a.platforms.length - 4) + "</span>" : "") + "</div>" +
      '<div class="foot"><span class="score"><b>' + a.score.toFixed(1) + "</b><i>/10</i></span>" +
      '<span class="more">Read review &rarr;</span></div></a>';
  }
  function postCard(p) {
    return '<a class="card post-card rv" href="article.html?id=' + p.id + '">' +
      '<div class="cover">' + coverSVG(p) + "</div>" +
      '<div class="body"><div class="meta"><span class="cat">' + esc(p.cat) + "</span><span>" + fmtDate(p.date) + "</span><span>" + p.mins + " min</span></div>" +
      "<h3>" + esc(p.title) + "</h3><p>" + esc(p.excerpt) + "</p></div></a>";
  }
  function newsRow(p) {
    return '<a class="news-row" href="article.html?id=' + p.id + '">' +
      "<time datetime=\"" + p.date + "\">" + fmtDate(p.date) + "</time>" +
      "<div><h3>" + esc(p.title) + "</h3><p>" + esc(p.excerpt) + "</p></div>" +
      '<span class="cat">' + esc(p.cat) + "</span></a>";
  }

  var D = window.SL || { apps: [], posts: [] };
  var blogPosts = D.posts.filter(function (p) { return p.type !== "news"; });
  var newsPosts = D.posts.filter(function (p) { return p.type === "news"; });
  var byDate = function (a, b) { return a.date < b.date ? 1 : -1; };
  blogPosts.sort(byDate); newsPosts.sort(byDate);

  var page = document.body.getAttribute("data-page");

  /* ---------- home ---------- */
  if (page === "home") {
    var fa = $("#feat-apps");
    if (fa) fa.innerHTML = D.apps.slice().sort(function (a, b) { return b.score - a.score; }).slice(0, 6).map(appCard).join("");
    var fp = $("#feat-posts");
    if (fp) fp.innerHTML = blogPosts.slice(0, 3).map(postCard).join("");
    var fn = $("#feat-news");
    if (fn) fn.innerHTML = newsPosts.slice(0, 4).map(newsRow).join("");
  }

  /* ---------- apps directory ---------- */
  if (page === "apps") {
    var list = $("#app-list"), searchEl = $("#app-search"), empty = $("#app-empty");
    var plat = "all", q = "";
    function drawApps() {
      var out = D.apps.filter(function (a) {
        var okP = plat === "all" || a.platKeys.indexOf(plat) > -1;
        var okQ = !q || (a.name + " " + a.short).toLowerCase().indexOf(q) > -1;
        return okP && okQ;
      });
      list.innerHTML = out.map(appCard).join("");
      if (empty) empty.classList.toggle("hidden", out.length > 0);
      reveal();
    }
    $$("#app-filters .chip").forEach(function (c) {
      c.addEventListener("click", function () {
        $$("#app-filters .chip").forEach(function (x) { x.classList.remove("on"); });
        c.classList.add("on"); plat = c.getAttribute("data-plat"); drawApps();
      });
    });
    if (searchEl) searchEl.addEventListener("input", function () { q = searchEl.value.trim().toLowerCase(); drawApps(); });
    drawApps();
  }

  /* ---------- app detail ---------- */
  if (page === "app") {
    var app = null, id = qs("id");
    D.apps.forEach(function (a) { if (a.id === id) app = a; });
    if (!app) app = D.apps[0];
    if (app) {
      document.title = app.name + " Review — Features, Pros & Cons, Setup | SignalLab";
      var md = $('meta[name="description"]');
      if (md) md.setAttribute("content", app.name + " review: key features, supported platforms, EPG and playlist support, strengths, limitations, and a quick setup walkthrough.");
      $("#a-tile").innerHTML = tileHTML(app, true);
      $("#a-name").textContent = app.name;
      $("#a-crumb").textContent = app.name;
      $("#a-tag").textContent = app.tagline;
      $("#a-model").textContent = app.model;
      $("#a-score").innerHTML = "<b>" + app.score.toFixed(1) + "</b><i>/10</i>";
      $("#a-best").textContent = app.best;
      $("#a-desc").innerHTML = app.desc.map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("");
      $("#a-plats").innerHTML = app.platforms.map(function (p) { return "<span>" + esc(p) + "</span>"; }).join("");
      $("#a-feats").innerHTML = app.features.map(function (f) { return "<li>" + esc(f) + "</li>"; }).join("");
      $("#a-pros").innerHTML = app.pros.map(function (f) { return "<li>" + esc(f) + "</li>"; }).join("");
      $("#a-cons").innerHTML = app.cons.map(function (f) { return "<li>" + esc(f) + "</li>"; }).join("");
      $("#a-setup").innerHTML = app.setup.map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("");
      $("#a-official").textContent = app.official;
      $("#a-faq").innerHTML = app.faq.map(function (f) {
        return '<details class="faq"><summary>' + esc(f.q) + '</summary><div class="ans">' + esc(f.a) + "</div></details>";
      }).join("");
      var others = D.apps.filter(function (a) { return a.id !== app.id; }).sort(function (a, b) { return b.score - a.score; }).slice(0, 3);
      $("#a-others").innerHTML = others.map(appCard).join("");
      /* Review JSON-LD */
      var ld = {
        "@context": "https://schema.org", "@type": "Review",
        itemReviewed: { "@type": "SoftwareApplication", name: app.name, applicationCategory: "MultimediaApplication", operatingSystem: app.platforms.join(", ") },
        reviewRating: { "@type": "Rating", ratingValue: app.score, bestRating: 10 },
        author: { "@type": "Organization", name: "SignalLab" },
        inLanguage: "en"
      };
      var s = document.createElement("script"); s.type = "application/ld+json";
      s.textContent = JSON.stringify(ld); document.head.appendChild(s);
    }
  }

  /* ---------- blog ---------- */
  if (page === "blog") {
    var bl = $("#blog-list"), bq = "", bcat = "all", bs = $("#blog-search"), bempty = $("#blog-empty");
    function drawBlog() {
      var out = blogPosts.filter(function (p) {
        var okC = bcat === "all" || p.cat === bcat;
        var okQ = !bq || (p.title + " " + p.excerpt).toLowerCase().indexOf(bq) > -1;
        return okC && okQ;
      });
      bl.innerHTML = out.map(postCard).join("");
      if (bempty) bempty.classList.toggle("hidden", out.length > 0);
      reveal();
    }
    var cats = [];
    blogPosts.forEach(function (p) { if (cats.indexOf(p.cat) < 0) cats.push(p.cat); });
    var bf = $("#blog-filters");
    if (bf) {
      bf.innerHTML = '<button class="chip on" data-cat="all">All</button>' +
        cats.map(function (c) { return '<button class="chip" data-cat="' + esc(c) + '">' + esc(c) + "</button>"; }).join("");
      $$(".chip", bf).forEach(function (c) {
        c.addEventListener("click", function () {
          $$(".chip", bf).forEach(function (x) { x.classList.remove("on"); });
          c.classList.add("on"); bcat = c.getAttribute("data-cat"); drawBlog();
        });
      });
    }
    if (bs) bs.addEventListener("input", function () { bq = bs.value.trim().toLowerCase(); drawBlog(); });
    drawBlog();
  }

  /* ---------- news ---------- */
  if (page === "news") {
    var featured = newsPosts[0];
    var nf = $("#news-featured");
    if (nf && featured) nf.innerHTML = postCard(featured);
    var nl = $("#news-list");
    if (nl) nl.innerHTML = newsPosts.slice(1).map(newsRow).join("");
  }

  /* ---------- article ---------- */
  if (page === "article") {
    var post = null, pid = qs("id");
    D.posts.forEach(function (p) { if (p.id === pid) post = p; });
    if (!post) post = blogPosts[0];
    if (post) {
      document.title = post.title + " | SignalLab";
      var md2 = $('meta[name="description"]');
      if (md2) md2.setAttribute("content", post.excerpt);
      $("#p-cat").textContent = post.cat;
      $("#p-crumb").textContent = post.title.length > 46 ? post.title.slice(0, 46) + "…" : post.title;
      $("#p-title").textContent = post.title;
      $("#p-date").textContent = fmtDate(post.date);
      $("#p-date").setAttribute("datetime", post.date);
      $("#p-mins").textContent = post.mins + " min read";
      $("#p-cover").innerHTML = coverSVG(post);
      $("#p-body").innerHTML = post.body;
      var back = $("#p-back");
      if (back && post.type === "news") { back.href = "news.html"; back.textContent = "← Back to News"; }
      var rel = D.posts.filter(function (p) { return p.id !== post.id && p.cat === post.cat; }).slice(0, 3);
      if (rel.length < 3) rel = rel.concat(D.posts.filter(function (p) { return p.id !== post.id && rel.indexOf(p) < 0; }).slice(0, 3 - rel.length));
      $("#p-rel").innerHTML = rel.map(postCard).join("");
      var ld2 = {
        "@context": "https://schema.org",
        "@type": post.type === "news" ? "NewsArticle" : "Article",
        headline: post.title, datePublished: post.date, inLanguage: "en",
        description: post.excerpt,
        author: { "@type": "Organization", name: "SignalLab" },
        publisher: { "@type": "Organization", name: "SignalLab" }
      };
      var s2 = document.createElement("script"); s2.type = "application/ld+json";
      s2.textContent = JSON.stringify(ld2); document.head.appendChild(s2);
    }
  }

  /* ---------- reviews (listing) ---------- */
  if (page === "reviews") {
    var ul = $("#rev-list");
    if (ul) ul.innerHTML = D.apps.slice().sort(function (a, b) { return b.score - a.score; }).map(appCard).join("");
  }

  /* ---------- best players ---------- */
  if (page === "best") {
    var top = D.apps.slice().sort(function (a, b) { return b.score - a.score; });
    var rl = $("#rank-list");
    if (rl) rl.innerHTML = top.slice(0, 8).map(function (a, i) {
      return '<div class="card rank-item rv"><div class="num">' + String(i + 1).padStart(2, "0") + "</div><div>" +
        '<div class="head">' + tileHTML(a) + "<div><h3>" + esc(a.name) + '</h3><span class="badge mint">' + esc(a.best) + "</span></div>" +
        '<span class="score" style="margin-left:auto"><b>' + a.score.toFixed(1) + "</b><i>/10</i></span></div>" +
        "<p>" + esc(a.short) + "</p>" +
        '<div class="rank-cols"><ul class="pro">' + a.pros.slice(0, 2).map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") +
        '</ul><ul class="con">' + a.cons.slice(0, 2).map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></div>" +
        '<div class="mt-1"><a class="btn btn-ghost btn-sm" href="app.html?id=' + a.id + '">Full review</a></div>' +
        "</div></div>";
    }).join("");
    var tb = $("#cmp-body");
    if (tb) tb.innerHTML = top.slice(0, 8).map(function (a) {
      var has = function (k) { return a.platKeys.indexOf(k) > -1 ? '<span class="yes">&#10003;</span>' : '<span class="no">&mdash;</span>'; };
      return "<tr><td><strong>" + esc(a.name) + "</strong></td><td>" + esc(a.model) + "</td>" +
        "<td>" + has("android-tv") + "</td><td>" + has("fire-tv") + "</td><td>" + has("samsung") + "</td><td>" + has("lg") + "</td><td>" + has("ios") + "</td>" +
        "<td><strong>" + a.score.toFixed(1) + "</strong></td></tr>";
    }).join("");
  }

  /* ---------- full comparison matrix ---------- */
  if (page === "compare") {
    var all = D.apps.slice().sort(function (a, b) { return b.score - a.score; });
    var yes = '<span class="yes">&#10003;</span>', no = '<span class="no">&mdash;</span>';
    var mt = $("#matrix-body");
    if (mt) mt.innerHTML = all.map(function (a) {
      var has = function (k) { return a.platKeys.indexOf(k) > -1 ? yes : no; };
      return "<tr><td><strong><a href='app.html?id=" + a.id + "' style='text-decoration:underline;text-underline-offset:3px'>" + esc(a.name) + "</a></strong></td>" +
        "<td>" + esc(a.model) + "</td>" +
        "<td>" + (a.m3u ? yes : no) + "</td><td>" + (a.xtream ? yes : no) + "</td><td>" + esc(a.epg) + "</td>" +
        "<td>" + has("android-tv") + "</td><td>" + has("fire-tv") + "</td><td>" + has("samsung") + "</td><td>" + has("lg") + "</td><td>" + has("ios") + "</td><td>" + has("windows") + "</td>" +
        "<td><strong>" + a.score.toFixed(1) + "</strong></td></tr>";
    }).join("");
  }

  reveal();
})();
