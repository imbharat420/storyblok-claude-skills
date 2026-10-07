# Restore safety rules
| Mistake | Consequence | Check that prevents it |
| --- | --- | --- |
| Overwrite entire story object | localized content, dimensions, relations lost | merge only `content`; PRESERVE_TOP never sent |
| Regenerate `_uid` | relations, visual editor, references break | merge by `_uid`; keep current `_uid` on match |
| Remove `translated_slugs` | localized URLs 404 | never in PUT body unless explicitly restoring them |
| Remove `dimensions` | language trees disconnect | same |
| Restore default over localized | translations overwritten | `lang` param required when snapshot `lang` is not default |
| Replace `body` arrays blindly | manual edits lost | array merge by `_uid`, not position |
| Flatten rich text | render failures | rich text stays JSON |
| Overwrite folders | hierarchy loss | folders are create-or-reuse, never PUT from snapshot |
| Recreate stories | duplicate slugs, lost ids | find by id then full_slug; create only with explicit flag |
| Publish on write | draft edits go live | no `publish` flag; humans publish |
Always: backup before restore, dry-run, diff, chunk, retry, audit log, rate limit, verify after write.
