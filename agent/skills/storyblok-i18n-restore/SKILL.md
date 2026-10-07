---
name: storyblok-i18n-restore
description: Safe restore, merge and migration of Storyblok stories, datasources
  and dimensions across languages (default plus field-level __i18n__ and
  language-tree variants) from snapshots or backups, preserving _uid,
  translated_slugs, dimensions, alternates, parent_id and manual edits, with
  dry-run and diff before any write. Use this skill whenever restoring from
  backup, rolling back content, copying stories between spaces, fixing a
  datasource or dimension that was deleted, or writing any code that PUTs story
  content, especially when the words restore, snapshot, backup, rollback,
  localized, Danish, Norwegian, dimension, translated slug or deep merge appear.
  Do not use for schema changes (storyblok-schema) or plain reads
  (storyblok-core).
---
# storyblok-i18n-restore

The one rule: never PUT a whole snapshot story over a live story. Fetch current, fetch the language variant, deep-merge, PUT only the target language, verify.

## Do not use when
- The write target is production and Gate C is not recorded.
- No current backup of the target exists (take one first).

## Restore flow
```
load snapshot -> detect story type and language -> find existing story (id, then full_slug)
-> fetch current story -> fetch current language variant (GET ?language=xx)
-> deep merge (snapshot over current, preserving _uid, i18n fields, relations)
-> validate components against schema -> validate relations, assets, datasources
-> restore translated_slugs and dimensions -> PUT with lang (or without for default)
-> re-fetch and verify -> log
```
Folders before stories, ordered by depth. Datasources (and their dimensions) before stories that reference them. Assets before stories that reference them.

## Never overwrite
`uuid group_id created_at published_at position sort_by_date tag_list favorites permissions workflow_stage release_id`
## Always preserve
`translated_slugs dimensions alternates parent_id full_slug is_folder default_root _uid` and every `<field>__i18n__<lang>` field; rich text stays JSON.

## Language-specific PUT
```js
// default language
await mapi(`/stories/${id}`, { method: "PUT", body: JSON.stringify({ story: { content: merged } }) });
// localized
await mapi(`/stories/${id}`, { method: "PUT", body: JSON.stringify({ story: { content: merged }, lang: "da" }) });
```
No `publish` flag anywhere.

## Datasource restore (missing-datasource case)
1. `GET /datasources?search=<slug>`; if absent `POST /datasources { name, slug }`.
2. Restore default entries: `POST /datasource_entries { name, value, datasource_id }`; update existing by id.
3. For each dimension in backup: `POST /datasources/{id}` with `dimensions_attributes` if missing; then `PUT /datasource_entries/{id}?dimension_id=` with `dimension_value`.
4. Report per dimension: created, updated, failed, skipped; retry failed with backoff; never delete entries absent from backup without explicit flag.

## Procedure
1. Run `scripts/deep-merge-story.js --dry-run` on the snapshot against the live space; read the diff.
2. Fix validation failures (unknown component, missing relation target) before any write.
3. Run without `--dry-run` against dev; verify; then Gate C for prod.

## References
- `references/restore-safety-rules.md`: the dangerous mistakes list and the checks that prevent each.
- `references/known-defects.md`: defects in the existing control plane (cron sync reverting live data, every write publishing, folders not backed up, language collapse, positional diffs, quadratic API use) and the rule that prevents each.
