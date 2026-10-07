---
name: storyblok-field-plugins
description: Create, test, deploy and debug Storyblok field plugins (custom field types): decide whether a plugin is needed at all, build with @storyblok/field-plugin and Vite into one dist/index.js, handshake and options rules that cause the endless "Loading..." state, zero-API-call data patterns (plugin options, build-time bundle), MAPI deploy script when the field-plugin CLI fails with 422, deploy-before-schema-push order, dev sandbox and token handling. Use this skill whenever the words field plugin, custom field, field-type, plugin sandbox, "Loading..." in a field, plugins:dev, plugins:deploy, data-tag, tag picker, dropdown inside Storyblok editor, or "Failed to create component ... field-type plugin" appear. Do not use for blocks without custom UI (storyblok-schema) or for the Visual Editor preview (nextjs-storyblok).
---

# storyblok-field-plugins

A field plugin is an iframe that owns exactly one field. It cannot see or hide other fields, and each instance on a page runs on its own, so any API call it makes is multiplied by the number of fields on screen.

## Do not use when
- A native field type, a datasource, a `bloks` field or a conditional field does the job. Climb the ladder first.
- The goal is to hide other fields: a plugin cannot. Use groups, tabs or conditional fields (plan permitting; verify, do not guess).

## Decide: is a plugin needed? (stop at the first rung that holds)
1. Native field options (`option`, `options`, `multilink`, `bloks`, `multiasset`).
2. Datasource or story references (`source: internal_stories`).
3. Groups, tabs, conditional fields.
4. Field plugin, only for a custom editing UI (searchable multi-select, tag picker, colour pairing with live check).
Record the answer and the reason in `STORYBLOK_SCHEMA.md`.

## Non-negotiables
1. **Zero API calls from the plugin.** In a real session the plugin fetched five folders with several pages each on every instance and got `Storyblok 429 for _global/ports/`, and the user asked why CDN calls were used at all. Data comes from, in this order: (a) plugin options on the field (key = label, value = id), (b) a list bundled at build time from the seed folder, (c) the value already saved in the field. State the staleness of (b): the list changes only after `plugins:deploy`.
2. **Handshake.** The plugin stays on "Loading..." (works in the sandbox, hangs after deploy) when the field's `options` is missing or is not an array of `{name, value}` strings. Always declare `options: []` at minimum. Treat "stuck on Loading" as a handshake problem first, a rendering problem second.
3. **Use the current library.** `@storyblok/field-plugin` (1.7.1 in the multisite project). A reference plugin copied from `docs/` may run on an old beta; check its version before copying and note the differences (the doc copy supported nested tags; options are one flat list, so write paths as text: "Europe > UK").
4. **Stable saved shape.** Define the saved JSON once, write it in the plugin README and keep it backward compatible: stories saved earlier must still render. Project shape: `[{ _uid, tag_name }]`. If `_uid` is a slug rather than the Storyblok UUID (because UUIDs need an API call), say so, and make the website resolver accept both.
5. **Layout inside the iframe.** A dropdown menu is clipped by the iframe; render it in flow (`menuPosition="static"` or equivalent) so the field grows taller instead of opening over the edge.
6. **No secrets in the bundle.** A dev token may be injected from env in dev mode only. After `build`, search `dist/index.js` for the token value and report the result.
7. **Build output** is one file: Vite, `rollupOptions.input: src/main.tsx`, `output.format: "commonjs"`, `entryFileNames: "index.js"`, `vite-plugin-css-injected-by-js`, `printDev()` from `@storyblok/field-plugin/vite`, dev server on 8080. See `assets/vite.config.ts`.
8. **Deploy through MAPI, not the CLI, when the CLI fails.** `field-plugin deploy` failed at "Checking existing field plugins" with 422 because it pages through every public plugin. `assets/deploy-plugins.mjs` lists `?only_mine=1`, creates when missing, then `PUT` with `publish: true`. PAT from env only. Scope: personal ("My plugins") by default; organisation scope needs its own flag, verify before promising it.
9. **Order**: `plugins:deploy`, then `schema:push`, then open Block library and confirm the field shows the plugin and not "missing plugin". Pushing the schema first fails with 422 "field-type plugin(s) are not available in this space".
10. **Test three levels and say which ran.** Unit tests for the data logic, typecheck and build, sandbox (`plugins:dev`, add options in Settings), then the deployed plugin inside a real story. Never write "works" when only the first two ran.
11. **Do not destroy work.** Never delete a plugin folder that is not committed; copy it to scratchpad or commit first. A deleted untracked app was unrecoverable. Removing a plugin from "My plugins" in Storyblok is done only on request, and the schema field and the website code that read it are removed in the same change.
12. **Run from the repo root.** Check `pwd` first; `pnpm plugins:dev` failed from inside an app folder that had no such script.

## Scenarios
| Need | Do |
| --- | --- |
| Pick tags or references from a known list | Plugin options (key/value) or build-time bundle; no API |
| List changes often in Storyblok | Use `source: internal_stories` option field, not a plugin |
| Show counts or validity per choice | Editor-only preview note in the website (draft mode); plugins cannot afford the calls |
| Hide fields depending on a choice | Conditional fields or tabs |
| Group of related fields | `section` group or tab |
| One picker per site | Plugin option `category` or `site`, comma separated; no option shows all |
| Existing stories use the old shape | Keep reading the old shape until the editor re-saves; document it |

## Procedure
1. Ladder decision recorded.
2. Scaffold `apps/<name>-plugin/` from `assets/vite.config.ts` and the library template; `package.json` scripts `dev`, `build`, `typecheck`; root scripts `plugins:dev`, `plugins:deploy`.
3. Write the pure data module and its tests first.
4. Build; check the size of `dist/index.js` and the token search.
5. Sandbox: `pnpm plugins:dev`; add options; test empty options, one option, many options, a saved legacy value.
6. `pnpm plugins:deploy`; then `pnpm schema:push` (diff first, storyblok-schema pre-push rules); then test in a real story and a published story.
7. Record plugin name, saved shape, options contract and deploy date in `STORYBLOK_SCHEMA.md`.

## References
- `assets/deploy-plugins.mjs`: MAPI deploy script.
- `assets/vite.config.ts`: build config.
- `storyblok-core/references/incident-log.md` section D: the failures behind these rules.
