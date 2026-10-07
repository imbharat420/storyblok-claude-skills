---
name: "storyblok-core"
description: "Storyblok API mechanics that fail silently when wrong: Content Delivery API (CDA) versus Management API (MAPI) hosts, tokens and rate limits; header-based pagination totals; filter_query encoding; resolve_relations limits; cv cache versions; language and fallback_lang; MAPI throttling and 429 handling; never-auto-publish; three-step asset upload; the list filters MAPI ignores. Use this skill whenever code, scripts, curl or Postman calls touch api.storyblok.com or mapi.storyblok.com, whenever stories, datasources, components, assets, releases or spaces are read or written programmatically, or when someone asks how Storyblok fetching, tokens, pagination or publishing works. Do not use for content modelling decisions (storyblok-schema) or restore logic (storyblok-i18n-restore)."
---

# storyblok-core

Two APIs, two hosts, two auth schemes, two rate limits. Mixing them or trusting the JSON body for totals costs a build.

## Do not use when
- Deciding what a block should contain (storyblok-schema).
- Restoring or merging localized content (storyblok-i18n-restore).

## Non-negotiables
1. CDA reads: `https://api.storyblok.com/v2/cdn/...` with `token=` (preview token for draft, public token for published). Region hosts: `api-us.storyblok.com`, `api-ap.storyblok.com`, `api-ca.storyblok.com`; EU is the default host.
2. MAPI writes: `https://mapi.storyblok.com/v1/spaces/{space_id}/...` with header `Authorization: <PAT>` (no Bearer prefix). PAT only in CI secrets, seeder and ops; never in browser, never in `memory.md`, never on argv.
3. Pagination totals live in response headers `total` and `per-page`, not in the body. Loop `page` until `page * per_page >= total`. `per_page` max 100 (CDA) and 100 (MAPI stories).
4. Throttle MAPI to about 3 req/s by default; the real limit depends on plan and endpoint, so make it configurable and trust `Retry-After` over any constant. On 429 back off and retry with jitter. Log 422 bodies in full, including `responseData.error`: the CLI hides the reason (a missing field plugin looked like a generic failure).
5. Never publish from scripts. MAPI `PUT /stories/{id}` without `publish=1`; humans publish in the UI or an approved release.
6. `cv` (cache version) from the first CDA response is passed to every subsequent CDA call in that request cycle for coherence.
7. `resolve_relations` accepts `component.field` pairs; there is a resolution depth and count limit; unresolved relations come back as UUID strings, so code must handle both shapes.
8. Assets: `POST /assets` (filename, size as "WxH" pixel dimensions, asset_folder_id) returns signed S3 fields; `POST` the binary to S3; `GET /assets/{id}/finish_upload`. Three steps or the asset never appears.
9. `filter_query[field][op]=value` works only on root-level content fields; nested fields need `resolve_relations` and client filtering, or a datasource.
10. Draft mode auth in preview: `_storyblok_tk[token]` is SHA-1 of `space_id:preview_token:timestamp`; webhooks use HMAC-SHA1 over the raw body.

## Lessons from real sessions (see `references/incident-log.md` for the evidence)
11. Draft reads (`version=draft`) bypass the Next.js and CDN cache. One preview refresh can fan out to 10 to 15 calls, and every keystroke in the Visual Editor refreshes the preview. In the shared fetch function: cache draft responses about 10 s, share identical in-flight requests, retry 429 with `Retry-After`, and debounce preview refresh (600 ms worked). Reported in session: uncached reads limited to roughly 6 req/s at `per_page=100`; not verified against current docs, read the headers.
12. Never fan out per folder per page from client code. Fetch lists once, index in memory, and prefer build-time data or a schema option over a runtime call. Before adding any runtime fetch, state the number of calls per page view and what the user sees on a 429.
13. Normalise every value from the CMS at the boundary. A multi-select or reference field can arrive as `undefined`, `""`, a single string, an array of UUIDs, an array of slugs or an array of resolved stories (`v.join is not a function` reached a live page). One `toArray` and one `toRefs` helper, used everywhere, with a test for each shape.
14. A custom field type (field plugin) must exist in the space before a component that uses it is pushed. A 422 on component create with "field-type plugin(s) are not available" means deploy the plugin first (storyblok-field-plugins).
15. Before assuming a Storyblok feature (conditional fields, workflows, releases, branches), check that the user's plan has it and say how it was checked (docs URL and date) or say "not verified". Do not leave a plan-gating question unanswered.
16. Preview-token or session-token values pasted by the user (JWTs, cookies in a copied `curl`) are never used in code or commands; tell the user to rotate them.

## Parameter inventory (from the uploaded Postman collections)
- CDA stories: `starts_with by_slugs by_uuids by_uuids_ordered excluding_slugs excluding_ids excluding_fields content_type filter_query[...] sort_by search_term with_tag is_startpage level language fallback_lang resolve_links(url|story|link) resolve_relations resolve_assets from_release in_workflow_stages version(draft|published) cv page per_page published_at_gt/lt first_published_at_gt/lt`.
- CDA other: `/links`, `/tags`, `/datasources`, `/datasource_entries?datasource=&dimension=`, `/spaces/me`.
- MAPI stories: `with_slug starts_with by_ids by_uuids by_content_type contain_component text_search search in_folder is_root folder_only story_only in_trash in_release in_workflow is_published by_status by_lang sort_by page per_page`; story `versions` and `compare`; `bulk_undelete`.
- MAPI entities: `components component_groups presets datasources datasource_entries asset_folders assets releases branches approvals workflows workflow_stages workflow_stage_changes space_roles collaborators activities tasks field_types`.

## References
- `references/delivery-api.md`: read patterns, pagination loop, defensive parsing.
- `references/management-api.md`: throttled client, idempotent component push, idempotent story import, asset upload.
- `references/token-hygiene.md`: where each token may live; rotation steps.
- `references/incident-log.md`: every real mistake from the multisite sessions, its root cause and the rule that prevents it. Read it before changing fetch, cache or filter code; append a row when the user has to repeat an instruction.

## Related skills added from the multisite project
storyblok-field-plugins (custom field types), storyblok-multisite (host-to-site, env, Netlify, scenarios), storyblok-editor-ux (block ergonomics, filters that never empty a list).
