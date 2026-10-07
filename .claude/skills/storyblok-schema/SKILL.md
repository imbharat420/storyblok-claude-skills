---
name: storyblok-schema
description: Derive and manage a Storyblok block schema as TypeScript pushed by the Storyblok CLI: turn a component inventory into content types, nestable blocks and universal blocks with semantic editor options only, allowlists per container, folder plan and language matrix; run CLI pull/push/diff against a dev space first; produce STORYBLOK_SCHEMA.md. Use this skill whenever blocks, components (Storyblok sense), content types, bloks fields, schema, block library, folders, datasources definitions, CLI push/pull, or "how should this be modelled in Storyblok" come up. Do not use for runtime fetching (storyblok-core) or content restore (storyblok-i18n-restore).
---

# storyblok-schema

Schema is code. The Block library is never edited in the UI; the CLI pushes what `packages/schema` declares, dev space first.

## Do not use when
- The component inventory does not exist yet (component-model first).

## Four questions per component (record answers in STORYBLOK_SCHEMA.md)
1. Does an editor place it? No -> app-level, not a block.
2. Content type, nestable block, or universal (`site_config`, `_global`)?
3. Which editor options? Only `tone`, `spacing`, `layout`, `variant`, `width` as `option` fields with fixed values. No colour, no px, no CSS class fields.
4. Where may it sit? Allowlist on the parent `bloks` field (`restrict_components: true`, `component_whitelist`).

## Rules (frozen, from ULTRAPLAN)
- Blocks, datasources, folders, field plugins defined in TypeScript, pushed by CLI. Nobody edits the Block library in the UI.
- Transactional data (inventory, fares, availability, leads, flags) never becomes stories.
- Elements only inside `section.items`, `columns`, `tabs`; never directly in page `body`.
- Taxonomy via story references (`multilink`/`option` with `source: internal_stories`), not tags.
- Heading hierarchy enforced in the schema (`level` option on `text`), not left to editors.
- Content tree is not the URL structure; use `translated_slugs` and folder `default_root`.
- No versioned component names; use field migrations.
- No environment or language folders.

## Pre-push safety (added after a push replaced a live `page` component)
1. Read-only diff first (`schema diff`, or `bash scripts/schema-diff.sh`). Show the user every `update` and every removed field; an existing component with the same name (`page` is the usual one) is replaced, not merged.
2. Ask which space it is and whether it holds a live site. If it does, stop: push to an empty or disposable space.
3. Write down the rollback command before applying: `npx storyblok schema rollback <changeset.json> --space <id> --dry-run`. Removing a field from the schema does not delete values already in stories.
4. Order: field plugins deployed, then datasources, then schema, then stories. A component using a plugin that is not deployed fails with 422 "field-type plugin(s) are not available in this space" and the push stops halfway, leaving a partial schema.
5. After a failure, run the diff again and report exactly what landed. Never say "pushed" for a partial push.
6. Before offering a feature (conditional fields, workflows, branches), verify the user's plan has it; cite the docs URL and date, or say "not verified". To hide sibling fields use groups, tabs or conditional fields (plan permitting); a field plugin can only control its own field.
7. Editor ergonomics decide the schema. Apply `storyblok-editor-ux` before freezing Gate B (laymen test, `bloks` fields instead of single image fields, groups and tabs, descriptions, filters that cannot empty a list).

## Procedure
1. `npx storyblok login` (region), `npx storyblok components pull --space <dev>` to capture current state.
2. Generate `packages/schema/blocks/*.ts` from `assets/block.template.ts` per inventory row; `folders.ts`; `datasources.ts`; `fields.ts` with `SECTION_BLOCKS`, `ELEMENT_BLOCKS`.
3. `bash scripts/schema-diff.sh <dev-space>` -> diff report; review; `npx storyblok components push --space <dev>`.
4. Seed showcase page (one story with every block) so `showcase-coverage` can pass.
5. Write `STORYBLOK_SCHEMA.md`: block table (name, type, group, fields, options, allowlist, pages), folder plan, language matrix (`default`, `da`, `no`, ...), datasource list, migration notes.
6. Gate B: schema frozen; then and only then `push --space <prod>` after Gate C approval.

## CLI commands (from uploaded storyblok-cli.md and CLI source)
```
npx storyblok login
npx storyblok languages|components|assets|stories|datasources pull --space <id>
npx storyblok languages|components|assets|stories|datasources push --space <id> [--from <source_space>]
npx storyblok logout
```
Never pass `--token`; the login stores credentials. Never run push against production without Gate C.

## Related
- `storyblok-field-plugins` for any custom field type; `storyblok-editor-ux` for field design; `storyblok-core/references/incident-log.md` section A for the pushes that went wrong.

## References
- `references/cli-commands.md`: options, file layout produced by pull, manifest handling for assets.
- `references/field-types.md`: Storyblok field types and which to use for each content shape.
