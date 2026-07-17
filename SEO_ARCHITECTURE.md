# AgriCalc Pakistan — SEO Architecture & Implementation Guide

Date: 2026-07-12

Purpose: provide a production-ready, scalable technical SEO architecture for a static site hosted on GitHub Pages. Follow Google's Search Essentials, mobile-first indexing, and modern best practices.

## 1. Information Architecture (recommended)
- Level 1: `/` (Home), `/blog/`, `/tools/` (Calculators), `/category/`, `/about/`, `/contact/`, `/resources/`
- Level 2: category pages for guides: `/guides/crop/`, `/guides/fertilizer/`, `/guides/pesticide/`, `/guides/machinery/`, `/guides/weather/`, `/guides/soil/`, `/guides/water/`, `/guides/modern-farming/`, `/guides/organic/`, `/guides/livestock/`
- Level 3: individual articles: `/blog/wheat-farming-guide/`, calculator pages under `/tools/<slug>/`, `/glossary/<term>/`, `/faq/`

Guidelines: keep URLs short, hyphen-separated, lowercase, and keyword-focused. Avoid dates and query-IDs for canonical content.

## 2. URL Strategy
- Blog: `/blog/<topic-slug>/` (e.g. `/blog/wheat-farming-guide/`)
- Calculators: `/tools/<calculator-slug>/` (e.g. `/tools/crop-profit-calculator/`)
- Categories: `/category/<category-slug>/`
- Guides: `/guides/<subtopic>/<slug>/` (optional)

Examples: `/blog/wheat-farming-guide/`, `/tools/fertilizer-calculator/`, `/category/fertilizers/`

## 3. Head Markup Templates (per page)
Include in `<head>`:
- `<title>` — 50–60 chars, primary keyword near start, brand at end.
- `<meta name="description" content="...">` — 140–160 chars, unique per page.
- `<link rel="canonical" href="https://agricalcpakistan.github.io/..." />` — self-referencing.
- Open Graph & Twitter Card (image, title, description, url)
- `<meta name="theme-color">`, `<link rel="manifest">`, `<link rel="icon">` for PWA + SEO signals.

Example snippet:

<link rel="canonical" href="https://agricalcpakistan.github.io/blog/wheat-farming-guide/">
<title>Wheat Farming Guide — High Yield Tips | AgriCalc Pakistan</title>
<meta name="description" content="Practical wheat farming tips for higher yields in Pakistan. Sowing, fertilizer, irrigation & pest control." />
<meta property="og:title" content="Wheat Farming Guide — AgriCalc Pakistan" />
<meta property="og:description" content="Practical wheat farming tips for higher yields in Pakistan." />
<meta property="og:url" content="https://agricalcpakistan.github.io/blog/wheat-farming-guide/" />
<link rel="manifest" href="/manifest.webmanifest">

## 4. Structured Data (JSON-LD)
- Add `Organization` on the homepage and sitewide in the head.
- Add `BreadcrumbList` to articles and calculators.
- Add `Article` schema for blog posts with `headline`, `description`, `image`, `author`, `datePublished`, `dateModified`.

Example `Organization` (head):

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "AgriCalc Pakistan",
  "url": "https://agricalcpakistan.github.io/",
  "logo": "https://agricalcpakistan.github.io/assets/images/logo/favicon.svg",
  "sameAs": []
}
</script>

Example `BreadcrumbList` (per article):

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://agricalcpakistan.github.io/"},
    {"@type": "ListItem", "position": 2, "name": "Blog", "item": "https://agricalcpakistan.github.io/blog.html"},
    {"@type": "ListItem", "position": 3, "name": "Wheat Farming Guide", "item": "https://agricalcpakistan.github.io/blog/wheat-variety-guide.html"}
  ]
}
</script>

## 5. Canonical & Robots
- Every indexable page must include a self-referencing `<link rel="canonical">`.
- Use `<meta name="robots" content="index, follow">` for public pages. Use `noindex, follow` for staging/low-value pages.

## 6. XML Sitemap
- A `sitemap.xml` at site root listing all public pages (generated). Keep it updated on content changes.
- Include `<lastmod>`, `<changefreq>`, and `<priority>`.

## 7. robots.txt
- Place at root. Example:

```
User-agent: *
Allow: /
Sitemap: https://agricalcpakistan.github.io/sitemap.xml
```

## 8. Headings & Content
- Exactly one `<h1>` per page.
- Use H2/H3 for sections and subsections.
- Include a short TL;DR paragraph at the top of long articles to improve featured-snippet potential.
- Add FAQ sections with `FAQPage` schema when appropriate.

## 9. Breadcrumbs & Internal Linking
- Add visible breadcrumbs (inside article) and JSON-LD breadcrumb list.
- Link to related calculators/articles and category pages from every article.

## 10. Image SEO
- Filenames: `wheat-harvest-method.jpg`
- Include `alt` attributes describing the image.
- Use `width` and `height` attributes to prevent CLS.
- Use `loading="lazy"` for non-LCP images.
- Prefer WebP/AVIF where possible; keep fallbacks for older browsers.

Example responsive markup:

<picture>
  <source srcset="/assets/images/wheat-1200.webp" type="image/webp">
  <img src="/assets/images/wheat-1200.jpg" alt="Wheat harvest in Punjab" width="1200" height="800" loading="lazy">
</picture>

## 11. Mobile-first & Performance
- Ensure critical CSS is inline-minimal and non-critical CSS deferred.
- Use `<link rel="preload" href="/assets/css/style.css" as="style">` and `rel=preconnect` for critical origins (fonts, analytics if used).
- Fonts: `font-display: swap`.
- Defer non-critical JS with `defer` and split large bundles.

## 12. Core Web Vitals
- LCP: ensure hero image or main content has width/height and is optimized; preconnect to CDNs if used.
- CLS: avoid inserting dynamic content above existing content; reserve space for ads/components.
- INP: keep JS lightweight and event handlers fast; use passive listeners for scroll.

## 13. Error pages
- `404.html` should return helpful links and a search box. It should also include link to sitemap and homepage.

## 14. Indexability & Crawl Budget
- Keep important pages linked from nav or category pages.
- Avoid orphan pages: include them in sitemap and linking structures.

## 15. Multi-language & Scale
- Use same URL pattern per language: `/en/...` `/ur/...` and set `hreflang` annotations when multi-language added.
- Keep URL strategy consistent to scale to thousands of articles.

## 16. Checklist before deploy
- Unique `<title>` and `<meta name="description">` per page.
- Self-referencing canonical tags.
- Valid sitemap.xml and robots.txt at root.
- No broken internal links.
- Mobile-friendly layout and accessible navigation.
- Structured data validated via Rich Results Test.

## 17. Implementation notes
- For a static site: regenerate `sitemap.xml` whenever content changes. Add a small script (node or simple manual step) that scans the repo and updates `sitemap.xml` with `<lastmod>` taken from file timestamps.
- Keep `robots.txt` and `sitemap.xml` at repository root to be served from `https://<user>.github.io/`.

## 18. Templates & Examples
- Title template: `{{Primary Keyword}} — {{Secondary}} | AgriCalc Pakistan`
- Meta description template: `{{1-sentence summary}}. Learn actionable tips, calculators, and guides. Visit AgriCalc Pakistan.`

## 19. Next steps I can implement for you
- Generate a full, up-to-date `sitemap.xml` automatically from the repository (I can do this now).
- Add JSON-LD `Article` schema to blog posts and `BreadcrumbList` to posts and calculators.
- Add a small script to regenerate `sitemap.xml` as part of your content update workflow.


---

If you want, I will now generate a finalized `sitemap.xml` (done), add JSON-LD article & breadcrumb examples directly into the HTML for your blog posts, and run a lightweight link-check for broken pages. Which should I do next?
