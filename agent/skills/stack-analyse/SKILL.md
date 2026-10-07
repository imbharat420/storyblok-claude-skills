---
name: stack-analyse
description: Identify the technical stack of a live site or a codebase
  (framework, rendering mode, CSS approach, state management, API pattern, CMS,
  font and image strategy, analytics, animation and scroll libraries,
  hosting/CDN) and map each item to the Dotsquares equivalent in a Next.js +
  Storyblok build. Use this skill whenever someone asks "what is this site built
  with", "what stack", "which CMS", "is this Next.js", when
  TECH_STACK_ANALYSIS.md must be written, or when a repository is being read for
  migration. Do not use to assess security posture of a third-party site (out of
  scope) or to probe endpoints.
---
# stack-analyse

Produce `TECH_STACK_ANALYSIS.md`: one row per stack item, the evidence, and the chosen equivalent.

## Do not use when
- The evidence would require authenticated access, fuzzing or endpoint probing.

## Procedure (live site)
1. Run `scripts/detect-stack.js` in the page; record markers.
2. Read response headers from the network panel: `server`, `x-powered-by`, `x-vercel-id`, `cf-ray`, `x-nf-request-id`, `cache-control`, `content-security-policy`.
3. From `RECON.md`: fonts (Google, self-hosted, system), image hosts and formats (`srcset`, WebP/AVIF, Cloudinary/Imgix/Storyblok image service), analytics.
4. Rendering: `__NEXT_DATA__` present = Pages Router; RSC payload in `self.__next_f` = App Router; HTML with hydration markers only = SSG; empty root div = SPA.
5. API: watch XHR/fetch for `/graphql`, `/api/`, `api.storyblok.com`, `cdn.contentful.com`, `*.sanity.io`.

## Procedure (codebase)
1. `package.json` dependencies and scripts; lockfile; framework config files.
2. Routing tree, data layer, environment variable names (names only, never values).
3. Third-party SDKs and their init points.

## Output table
| Item | Evidence | Target equivalent | Migration note |
| --- | --- | --- | --- |
| Framework | | Next.js App Router | |
| CSS | | Tailwind v4 tokens | |
| CMS | | Storyblok | |
| Images | | next/image + Storyblok image service or Cloudinary loader with per-breakpoint width | |
| Fonts | | next/font | |
| Analytics | | GTM via site_config | |
| Animation | | CSS first; library only if BEHAVIORS.md requires | |
| Hosting | | Vercel or equivalent with shared data cache | |

Mark items `not verifiable` when evidence is absent; never infer a CMS from page shape alone.
