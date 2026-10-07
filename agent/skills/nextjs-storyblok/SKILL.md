---
name: nextjs-storyblok
description: 'Next.js App Router implementation patterns for a Storyblok-backed
  multi-site: tag-based fetching with next fetch cache, two route trees
  (production without bridge JS, /preview with draft mode), component registry
  by block name, revalidation webhook with HMAC, draft-mode propagation to
  nested fetches, per-breakpoint image loaders, middleware host-to-site routing,
  and the token-only styling gate. Use this skill whenever Next.js code is
  written or reviewed for a Storyblok project, including server/client component
  boundaries, metadata, generateStaticParams, route handlers, draft mode,
  ISR/revalidation, image optimisation, or "how do I render blocks". Do not use
  for Pages Router projects without adapting the route-tree notes, and not for
  non-Storyblok data layers.'
---
# nextjs-storyblok

Production routes ship zero Storyblok bridge JS; `/preview/*` is the only draft tree. Fetch with `next: { tags }`; revalidate by tag from a signed webhook.

## Do not use when
- The project is React Native or a non-Next framework.

## Rules
1. Server components fetch; client components receive props. A block renderer is a server component that maps `blok.component` to a registry entry; interactive blocks wrap a small client child.
2. `fetch(url, { next: { tags: ["story:" + full_slug, "site:" + site] } })`; `revalidateTag` in `/api/revalidate` after HMAC-SHA1 verification of the raw body.
3. Two route trees: `app/(site)/[...slug]/page.tsx` published, no bridge; `app/preview/[...slug]/page.tsx` draft token, `noindex`, `frame-ancestors app.storyblok.com`, bridge loaded. Draft awareness passed down to every nested fetch (relations, datasources).
4. Middleware: host + path -> site registry (`sites.config.ts`) -> rewrite to `/_sites/{site}/...`. Market = folder; locale = formatting; language only for genuine translation.
5. Images: `next/image` with a loader that sets width per breakpoint (`m/{w}x0`); never one transformation URL for all breakpoints; no `dpr_auto` with `next/image`.
6. `generateStaticParams` from CDA `links` per site; `dynamicParams = true` for late additions.
7. Metadata from story SEO fields via `generateMetadata`; canonical and alternates from `translated_slugs`.
8. Env: `PROJECT_*` prefixed; public token in `NEXT_PUBLIC_*`, preview token server-only.
9. Styling: Tailwind v4 theme variables; components consume tokens; `token-only-styling` gate fails on hex/px in components.
10. Client-side navigation is tested; "works on refresh" is not healthy. If using `@storyblok/react`, `storyblokInit` must include `apiPlugin` or `getStoryblokApi()` returns null on client navigation.

## Preview and Visual Editor rules (from real sessions, evidence in storyblok-core/references/incident-log.md section E)
11. Preview and local dev read `draft`. A "not found (published)" error must say which version was requested and what to do ("publish it" or "run the seed"). Never fail the page on a missing optional story; render the empty state.
12. Every block wrapper, including referenced `_global` blocks, spreads `storyblokEditable(blok)`; otherwise clicking it in the Visual Editor selects nothing or the wrong block. Test by clicking a `_global` section in the real editor.
13. Dev-only shared state (live-draft store for unsaved edits) lives on `globalThis`. Next.js bundles route handlers and pages as separate module copies; a module-level `Map` exists twice (symptom: `/api/preview/input` returns 204 but the preview keeps old text).
14. Debounce preview refresh (600 ms) and cache draft fetches about 10 s (storyblok-core rule 11).
15. Editor-only help (counts, "nothing matches", field hints) renders only in draft mode. Visitors never see an error string, a warning or a "preview" note; they see the normal empty state.
16. Local HTTPS dev (`next dev --experimental-https -p 3010`): when the preview is blank after a restart, ask the user to open the origin once and accept the certificate before debugging code.
17. While routes are changing use 302/307, not 301: browsers cache a 301 permanently. Test the bare, locale-prefixed and site-prefixed forms of every route.
18. Ship `not-found.tsx`, `error.tsx` and `global-error.tsx` per site (404 and 500 pages); an error page never prints a stack, a token or an env name.
19. Values from CMS fields go through the normalisers (storyblok-core rule 13) before any `.map` or `.join`.

## Multi-site
Host-to-site mapping, env contract, Netlify and deployment live in `storyblok-multisite`.

## References
- `references/app-router-rules.md`: patterns from eval-tested Next.js skills (server vs client components, cookies, searchParams, metadata, route handlers, parallel routes, server actions).
- `assets/route-tree.template`: file tree for a new site.
