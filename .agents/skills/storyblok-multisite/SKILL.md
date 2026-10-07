---
name: "storyblok-multisite"
description: "Run several brand sites from one Storyblok space and one Next.js app: host-and-path to site registry, per-site folders and _config, shared _global stories, per-site themes, the environment-variable contract (bare hostnames, required-in-production list, monorepo .env loading), Netlify deployment and secrets-scan settings, site override for the primary URL, debugging \"Not found\" and server crashes on a deployed site, and a checklist for adding a site, language, market or theme. Use this skill whenever sites.config, PANACHE_SITE_HOST, PANACHE_SITES_ENABLED, PANACHE_SITE_OVERRIDE, Netlify, env vars, \"Not found\" on a deployed URL, adding a brand or site, theme per site, or \"which site opens on the main URL\" come up. Do not use for block design (storyblok-schema) or fetch internals (storyblok-core)."
---

# storyblok-multisite

One space, many sites. Every failure in the sessions that fed this skill was an environment or routing mistake, not a code bug: a URL where a hostname belongs, a file in the wrong folder, a variable missing in production.

## Do not use when
- The project serves one site only.

## Model (record it in `STORYBLOK_SCHEMA.md` and `SITE_MAP.md`)
- Site folder per site (`panache-uk/`, `expeditions-uk/`, `bsl-uk/`), each with `_config` (site settings, navigation, theme reference) and `home`.
- `_global/` for shared reference stories (destinations, ports, cruise lines, categories, shared sections, themes, people). Referenced by story reference, not by datasource, and not copied per site.
- Registry in code (`packages/sites/sites.config.ts`): site key, Storyblok root folder, host(s), default language, market. Proxy or middleware resolves `host + path` to a site and rewrites to an internal `/site/{key}/...` tree that is not reachable directly (one site must never be served under another's URL).
- Themes: a theme is a story (`_global/themes/...`) of semantic options (font family, radius, tone, colours as token roles) selected in the site `_config`. Components read tokens; editors never type hex or px in a block.
- Localhost: every enabled site is reachable by its path prefix. Production: by host.

## Environment contract
1. One file, `.env.example`, lists every variable with: purpose, secret or not, format, required in production or not. Keep it in sync with the code that reads them. The README repeats the table; never the values.
2. Host variables are bare hostnames: `PANACHE_SITE_HOST=app.example.com`. Not `https://...`, no trailing slash. Reason: the proxy compares the request `Host` header, and canonical and sitemap URLs are built as `https://${host}`. The value `https://host/` gave "Not found", and would have produced `https://https://host/`.
3. Validate at startup and fail loudly with the variable name and the expected format. Never fall through to a bare "Not found".
4. Monorepo: decide where `.env.local` lives (repo root) and load it explicitly in `next.config` (`process.loadEnvFile`), or Next.js reads only `apps/web/.env.local` and `PANACHE_SITES_ENABLED` is silently empty.
5. In production `NODE_ENV=production` turns sample-data fallbacks off. Any upstream used by a page (cruise API base and key, leads queue) must be set or the page must render its empty state; otherwise the first page with a cruise block crashes with "Cruise API is not configured".
6. Changing an env var on Netlify needs a new deploy.
7. Tokens: public and preview token are server-side; PAT only in CI secrets, seeder and ops scripts. A PAT in a committed `.mcp.json` or any repo file is a leak: move it to an environment variable, rotate it.

## Netlify
- `netlify.toml` lives next to the app; build command and publish settings are written there, not only in the UI.
- **Secrets scan**: Netlify fails the build when the value of any env var named like a secret appears in the repo or build output. Non-secret config values (`PANACHE_ENV`, region, host, enabled sites, override, space ids) appear in README, `.env.example` and docs, so set `SECRETS_SCAN_OMIT_KEYS=<comma list of those keys>`. Omit only keys whose values are safe to publish. Never omit a token, PAT, webhook secret or API key; those must not appear in any repo file at all. Use `SECRETS_SCAN_OMIT_PATHS` only for generated paths.
- Read function logs before theorising: Netlify, Logs, Functions (or Observability), open the Next.js handler, reload the page, copy the error line. Give the user a `curl -i` for the failing route (for example `/api/cruises`) with the status and body to paste back.
- `502 {"error":"Search unavailable"}` on live but fine locally: compare the production env list with the local one first.
- Do not start or restart background dev servers on your own. If the harness stopped one for memory, report it and wait to be asked.

## Scenarios
| Scenario | Do |
| --- | --- |
| Add a site | Folder, `_config`, `home`, theme, registry entry, add key to `PANACHE_SITES_ENABLED`, host, sitemap and robots, 404 and 500 pages, webhook revalidation tags, seed, showcase page, then gate checks |
| Make one site open on the main URL | Registry host or an explicit override variable, documented in the env table; test bare host, `/`, `/en-gb`, site-prefixed path and `/preview/...` |
| New language or market | Folder per market, `translated_slugs`, hreflang; language only for genuine translation |
| New theme for existing site | New theme story, switch in site `_config`, nothing else changes; test on the showcase page |
| Local dev needs data | Sample data only when `NODE_ENV!=production`; state clearly it is sample data |
| Staging versus production | Separate spaces or at least separate tokens; `PANACHE_ENV` visible in the footer of non-production builds |
| Visual Editor preview base URL | Points to the HTTPS dev origin (`https://localhost:3010`) for local, to the deployed `/preview` tree otherwise |
| A page "not found" on one site only | Check registry host, story slug and published state before code |

## Procedure for any deployment problem
1. Reproduce with `curl -i` (status, `Host`, body) before reading code.
2. List the variables the failing render needs; compare production to `.env.example`.
3. Read the function log line; do not guess among causes. If a log is unavailable, say which causes are likely and mark them unconfirmed.
4. Change one thing, redeploy, retest with the same curl.

## References
- `storyblok-core/references/incident-log.md` section F: the failures behind these rules.
- `nextjs-storyblok` for the route trees and the preview rules.
