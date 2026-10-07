# Incident log: what went wrong in real sessions and the rule that prevents it

Source: session transcripts of the storyblok-multisite project (Panache, Next.js 16 + Storyblok, Netlify), 23 to 28 Sep 2026. Each row is a mistake that cost the user at least one re-prompt. Rows whose cause says "unconfirmed" are inferences from the transcript, not verified diagnoses. Add a row whenever the user has to repeat or correct an instruction. Rules live in the skill named in the last column.

## A. Schema and space writes
| # | What happened | Root cause | Rule | Skill |
| --- | --- | --- | --- | --- |
| A1 | First `schema push` ran for real against the user's existing space and replaced the live `page` component (19 fields gone) | Push was run without a read-only diff reviewed by the user, against a space that already held a site | Diff first, read it, push only to an empty or disposable space; record the rollback changeset path before applying | storyblok-schema |
| A2 | `Failed to create component cruise_list` (422): "field-type plugin(s) not available in this space" | Schema referenced a custom field plugin that was not deployed yet; the CLI log hid the reason | Deploy plugins first, then push schema; read `responseData.error` of every 422 | storyblok-field-plugins, storyblok-schema |
| A3 | `cruise_list` showed empty because live stories had no `pace`; seed files had it | Seed edits were never pushed to the space | After editing seed files, run the stories diff against the target space and report drift before debugging the renderer | storyblok-i18n-restore |
| A4 | Datasource tone dropdown empty ("Choose an option") | Datasources probably not pushed (suggested to the user, not confirmed) | Gate list must include "datasources pushed" before any editor test | storyblok-schema |

## B. Rendering and filters
| # | What happened | Root cause | Rule | Skill |
| --- | --- | --- | --- | --- |
| B1 | Cruise list empty although cruises existed | A multi-select with every value ticked (pace) was treated as a filter; no cruise had the field | An empty or fully ticked filter means "no constraint"; a missing field on an item never excludes it | storyblok-editor-ux |
| B2 | 14 destinations picked, 3 shown | A hidden logic condition (match mode "all") intersected the picks | A list block never returns fewer items than its picks without a visible reason; fall back in steps (filter, then block alone, then all) | storyblok-editor-ux |
| B3 | `v.join is not a function` shown on the live page | Picker value arrived as `""` or a single id instead of an array | Normalise every CMS value at the boundary: `[]`, string, array, UUID strings and resolved objects | storyblok-core |
| B4 | Error or "no match" text rendered in the preview and on live | No separation between editor-only help and visitor output | Editor-only notes render only in draft mode; visitors see the normal empty state, never an error string | nextjs-storyblok |
| B5 | Article page and `itinerary_day` image "not visible" | Schema had a field the renderer ignored, or the renderer read a field the schema did not have | Field-to-renderer parity check per block: every schema field is read by the component and every component prop has a schema field | storyblok-editor-ux |
| B6 | `/panache-uk/journal/...` showed 404; browser kept redirecting to `/en-gb/panache-uk/...` | Route form not handled; browser cached a 301 permanently | Prefer 302/307 while routes are changing; test the bare, locale and site-prefixed forms | storyblok-multisite |

## C. API load and rate limits
| # | What happened | Root cause | Rule | Skill |
| --- | --- | --- | --- | --- |
| C1 | 429 while typing in the Visual Editor | Each keystroke refreshed the preview; each refresh made 10 to 15 uncached draft calls | Draft cache 10 s, share in-flight identical requests, honour `Retry-After`, debounce preview refresh | storyblok-core |
| C2 | Field plugin showed `Could not load options: Storyblok 429` | Plugin fetched five folders with several pages each, in parallel, on every plugin instance | A field plugin makes zero API calls (see field-plugins skill) | storyblok-field-plugins |
| C3 | User: "why are you using the CDN endpoints, that will make issue anytime" | Claude chose live fetching in editor code without offering the cheaper option | Prefer build-time data or schema-level options over runtime calls; state the call count and the failure mode before choosing a runtime fetch | storyblok-field-plugins |

## D. Field plugins
| # | What happened | Root cause | Rule | Skill |
| --- | --- | --- | --- | --- |
| D1 | Plugin worked in the sandbox, stayed on "Loading..." inside Storyblok after deploy | Handshake never completed: field `options` must be an array of `{name, value}` strings; an omitted `options` also stalls it | Always declare `options: []` at least; test the deployed plugin inside a real story, not only the sandbox | storyblok-field-plugins |
| D2 | `field-plugin deploy` failed at "Checking existing field plugins" with 422 | The CLI pages through every public plugin and a page returned 422 | Deploy through MAPI `field_types` with `only_mine=1`; script `plugins:deploy` | storyblok-field-plugins |
| D3 | `pnpm plugins:dev` "not recognized" | Shell cwd was `apps/cruise-filter-plugin`, a folder later removed; the script was not defined at that level (likely, unconfirmed) | Run workspace scripts from the repo root; verify `pwd` before running | storyblok-field-plugins |
| D4 | Plugin app deleted, "wasn't in git, so it's gone for good" | Folder removed without a commit or backup | Never delete an untracked folder; copy it to scratchpad or commit first | storyblok-field-plugins |
| D5 | Plugin that hides other fields was promised; a plugin controls only its own field | Capability assumed, not checked | A plugin cannot hide sibling fields; use groups, tabs or conditional fields (plan permitting) | storyblok-field-plugins |

## E. Preview and Visual Editor
| # | What happened | Root cause | Rule | Skill |
| --- | --- | --- | --- | --- |
| E1 | `_config not found (published)` in local preview | Preview asked for published content that was never published | Preview and local dev read `draft`; error text says which version was requested and how to fix | nextjs-storyblok |
| E2 | Typing in the editor side panel returned 204 but the preview kept old text | Next.js bundles route handlers and pages separately; the in-memory live-draft store existed twice | Shared dev state lives on `globalThis` | nextjs-storyblok |
| E3 | Clicking a `_global` sub-section showed no content | Not diagnosed in the session (unconfirmed); likely missing `_editable` data on referenced `_global` blocks | Every block wrapper spreads `storyblokEditable(blok)`, including referenced `_global` blocks | nextjs-storyblok |
| E4 | Local HTTPS preview "not running" after restart | Dev certificate not accepted again | State "open https://localhost:3010 once and accept the certificate" whenever the preview is blank | nextjs-storyblok |

## F. Deployment and environment
| # | What happened | Root cause | Rule | Skill |
| --- | --- | --- | --- | --- |
| F1 | Netlify build failed on "secrets found" for `PANACHE_*` values | Netlify scans for env values in repo files; non-secret config values appear in README, docs and `.env.example` | Set `SECRETS_SCAN_OMIT_KEYS` for non-secret keys; keep real secrets out of repo text | storyblok-multisite |
| F2 | "Not found" on Netlify | `PANACHE_SITE_HOST` held `https://host/`; code compares bare `Host` header | Host variables are bare hostnames; validate and fail loudly at startup | storyblok-multisite |
| F3 | Local app returned "Not found" | Next.js reads `.env.local` from `apps/web`, the file sat at the repo root | Monorepo env loading is decided once, documented, and tested with a missing-variable startup check | storyblok-multisite |
| F4 | Production page crashed: "Cruise API is not configured" | `NODE_ENV=production` disables sample data; API base and key were unset | List every variable a render needs and which are required in production; check them before the first deploy | storyblok-multisite |
| F5 | Search "unavailable" on live, working locally | Not diagnosed to the end in the session (unconfirmed); suspected missing production env | Give the user a one-line way to read function logs and a curl for the route before theorising | storyblok-multisite |

## G. Process and honesty
| # | What happened | Root cause | Rule | Skill |
| --- | --- | --- | --- | --- |
| G1 | User pasted a browser `curl` containing a Storyblok session JWT and cookies; a PAT also sits in plain text in `.mcp.json` | Credentials in prompts and config | Do not reuse pasted session tokens; tell the user to rotate; keep PATs in env, never in committed config | risk-and-compliance |
| G2 | Claude in Chrome was signed in to a different Storyblok account; space showed "Space not found" | Browser profile not the user's | State it, stop browser steps for that space, verify through API or ask the user for a screenshot | risk-and-compliance |
| G3 | Background dev servers killed for low memory | Long-lived servers started in background | Do not restart them automatically; report and ask | storyblok-multisite |
| G4 | Same question ("conditional fields in free plan?") pasted five times | Unconfirmed; the question stayed unanswered while the user retried `/chrome` | Answer plan-gating questions from a fact source (docs URL plus date) or say "not verified"; do not leave a pasted question unanswered | storyblok-schema |
| G5 | User asked three times for the same change ("cruise_list ... nothing render") | Fix declared done without running the real render path | Verify with the real render (preview or test) and state exactly what was and was not checked | storyblok-editor-ux |
