# Defects found in the existing control plane (STORYBLOK_DATA_ANALYSIS) and the rule that prevents each
| Defect | Rule |
| --- | --- |
| Cron/API "sync" reverts live data to latest snapshot | No scheduled writes. Restore is a human-triggered job with a named snapshot |
| Deleted stories cannot be restored | Snapshot includes `parent_id`, `full_slug`, `is_folder`; create flow behind explicit flag |
| Backups silently partial but reported success | Compare fetched count to header `total`; fail the job on mismatch |
| Two snapshot systems produce no-op restores and 404s | One snapshot format (Section 9 of multilanguage doc); key by space id, not space key |
| Localized restore collapses languages | Per-language files; PUT with `lang` |
| Folders not backed up | Folder snapshots first; restore folders first |
| Every write publishes | No `publish` |
| Positional diffs | Diff by `_uid` |
| Schema-only component hash | Hash schema plus presets, groups, display name |
| Quadratic API usage | Fetch lists once; index in memory; batch |
| Swallowed 422 bodies | Log full body |
| Stored XSS, path traversal, token in logs, permissive CORS, unauthenticated mutating routes | Escape output; validate `backupId` `^\d{8}T\d{6}-[0-9a-f]{6}$` and `lang` `^[a-z-]+$`; never log axios config; allowlist origins; dashboard token on every mutating route |

## Added from the multisite sessions
| Defect | Rule |
| --- | --- |
| Seed files hold a field (`pace`) the live stories lack; the list rendered empty and the renderer was blamed | After seed edits, dry-run the stories push against the target space and report drift before debugging any renderer |
| Partial schema push left the space half changed and nothing recorded what landed | Diff again after any failure; report exactly what landed; keep the changeset path |
| Seed stories referenced by slug (`@ref:_global/...`) while plugins saved slugs and the CMS saved UUIDs | One reference format per field; resolvers accept both; document it |
