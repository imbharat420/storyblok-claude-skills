---
name: "seo-baseline"
description: "Technical SEO baseline for a page set: titles, meta, canonical, hreflang and translated slugs, heading hierarchy, structured data validity, robots and sitemap, indexability, internal link graph, image alt coverage, Core Web Vitals proxies (LCP element, CLS sources, render-blocking scripts), and AI-search citability signals, each finding carrying a falsification test. Use this skill whenever SEO, search visibility, metadata, schema.org, sitemap, hreflang, ranking, or \"will Google index this\" is raised for a live site or a build, and as part of every S1 and S9 discovery. Do not use for content strategy or keyword research; those need external data."
---

# seo-baseline

About 30 technical checks, each producing a row for the suggestion sheet with evidence and a falsification test. No promotional language; a recommendation without an observation is dropped.

## Do not use when
- The target is a design (S2, S6) with no rendered HTML; record "not applicable".

## Checks
Head: title length and uniqueness; meta description; canonical self-reference; `hreflang` set matches `translated_slugs`; viewport meta; theme-color.
Indexing: `robots.txt`; `X-Robots-Tag`; `meta robots`; sitemap presence and freshness; preview routes `noindex`.
Structure: one `h1`; heading order without skips; landmarks (`header main nav footer`); breadcrumb markup.
Structured data: JSON-LD parses; types valid (`Organization`, `WebSite`, `BreadcrumbList`, `Article`, `Product`, `FAQPage`); no deprecated properties.
Links: internal link count per page; orphan pages from the crawl; broken links; `nofollow` misuse.
Media: alt coverage; image dimensions declared; modern formats; lazy loading below the fold only.
Performance proxies: LCP element identified; CLS sources (images without dimensions, late fonts); render-blocking scripts; third-party script count and weight; font display strategy.
AI citability: question-shaped headings, primary-source links, dated content, author identity, concise definitional paragraphs.

## Procedure
1. Run `scripts/seo-crawl.js` on each page in the page list (page context); collect JSON.
2. Fetch `robots.txt` and `sitemap.xml` with the browser tool.
3. Write rows for suggestion-sheet Area = SEO with falsification tests ("if the page still lacks a self-canonical after deploy, fail").
4. Summarise in `docs/research/SEO_BASELINE.md`: table of checks x pages, pass/fail/not verifiable.

## References
- `references/checks.md`: the full check list with pass criteria.
