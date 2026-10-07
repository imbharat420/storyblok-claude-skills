---
name: storyblok-editor-ux
description: 'Design block schemas and their renderers so editors can
  understand, find and safely use every field: laymen test, groups and tabs with
  consistent names, bloks fields instead of single image fields, per-device
  layout options, style options as token roles (not hex), filters and lists that
  can never render empty without a visible reason, schema-to-renderer parity
  check, editor-only help in draft mode, and the verification routine before
  saying a block works. Use this skill whenever a block, section, grid, gallery,
  carousel, form, filter, cruise list, article, itinerary, excursion, badge
  list, review block, tab or group is created or changed, and whenever the user
  says a field is not visible, hard to understand, not flexible, "nothing
  renders", "only 3 showing", "weird", or asks for more options on a block. Do
  not use for API or deployment problems (storyblok-core, storyblok-multisite).'
---
# storyblok-editor-ux

The user's first priority for this project, in their words: flexibility with better visibility of fields. Every complaint in the source sessions was one of three things: an editor cannot understand a field, an editor cannot find an option that should exist, or the page renders less than the editor entered.

## Do not use when
- The change is purely server-side or infrastructure.

## Rules for the schema
1. **Laymen test.** A person who has never seen the schema must be able to say what each field does from its label and description. `filter_by` with nested blocks failed this test and was replaced by seven flat fields (heading, four pickers, sort, count). Run the test on every new block; write the result in the spec.
2. **Every field has** a display name in plain words, a one-line description with an example ("For example Featured Caribbean cruises."), a default, and a group. No field is named after its implementation.
3. **Groups and tabs, same names everywhere.** Use one vocabulary across blocks: `Content`, `Media`, `Layout`, `Style`, `Behaviour`, `SEO`, `Advanced`. A block with more than about eight fields uses tabs; a long page type (cruise_page, article) gets tabs per concern (Content, Media, Author and date, Topics, SEO). Same tab name means same kind of field in every block.
4. **Repeatable things are `bloks` fields with an allowlist**, not numbered fields and not a single image field. A single `image` field blocks the editor from adding a carousel; use a `bloks` field that accepts image, image carousel, gallery, video blocks. Applies to itinerary day media, excursion media, hero media, review photos.
5. **No artificial limits.** Columns, grid cells, badges, features, rows are unlimited bloks; per-row count is an option (1 to 6 and `auto`), not a hard-coded three. Grid offers every layout option in one place: columns per breakpoint, gap, alignment, row template, masonry or equal height.
6. **Per-device options** for width, columns, visibility and spacing: `mobile`, `tablet`, `desktop` as separate option fields or one group, with a documented fallback (mobile value inherits upward).
7. **Style options are token roles, not raw values.** The user asks for colour, background, text colour and shape (circle, rounded, square) choices on review, badge, feature and form blocks. Provide them as options whose values are token roles from the theme (`surface`, `surface-alt`, `accent`, `on-accent`, `muted`; shapes `circle`, `rounded`, `square`; spacing `none` to `xl`; border `none`, `thin`, `strong`). Never a free hex or px field. If a client really needs free colour, record it as an exception at the gate, with a contrast check.
8. **Icons** are an option list of named icons, with an `icon position` option; the renderer maps names to a fixed icon set.
9. **Forms** (enquiry form and similar): fields as bloks (text, email, phone, select, checkbox, consent, date), per-field label, help, required and width; style options for layout, spacing, button style, checkbox and consent presentation; success and error messages editable; the checkbox renders inline with its label (a centred box above the label looked broken).
10. **Galleries** offer several formats: grid, masonry, mosaic, carousel, with columns, gap, aspect ratio and caption options.
11. **Spacing and look controls** on composite blocks: gap between media and text, padding, border, background for the block and for each child (excursion photos versus feature list, feature items).
12. **Reference pickers** (destinations, ports, cruise lines, categories) are story-reference fields with `source: internal_stories`, not datasources and not free text. Write in the description what an empty picker means ("Leave all boxes empty to show every cruise").

## Rules for lists and filters (renderer)
13. **A list never silently shows less than the editor chose, and never shows nothing without a visible reason.** Cases that failed: a filter with every option ticked excluded everything because no item had that field; a hidden "match all" mode intersected 14 picked destinations down to 3.
    - Empty or fully ticked filter = no constraint.
    - An item missing a field is never excluded by a filter on that field.
    - Multiple pickers combine as "any" by default; an "all" mode is an explicit, labelled option.
    - When the combination matches nothing, fall back in steps: the block's filters alone, then all items. Visitors never see an error or "no match" text.
14. **Editor-only help in draft mode only**: how many items each pick has, which picks have none, which fallback was used. Cost it (extra requests) and keep it cached. A plugin cannot afford this; the preview can.
15. **Normalise CMS values at the boundary** before any `.map` or `.join` (storyblok-core rule 13). An empty new block in the editor sends `""`, `[]` or a single string.
16. **Empty state, not error**: a block with no content renders nothing or a quiet placeholder in draft mode, never an exception message.

## Rules for the work itself
17. **Parity check before "done".** For each changed block, list schema fields and the props the component reads; every schema field is read somewhere, every prop has a schema field. Cases that failed: article fields editable but not shown; `itinerary_day` image field not visible.
18. **Verify on the real path.** Render the block through the real preview or a test with: empty block, one item, many items (the user's own count, for example 14), legacy saved value, `""` value. State what ran: typecheck, unit tests, preview render, Visual Editor in Chrome. If the browser is signed in to a different Storyblok account, say so and use the API or ask for a screenshot.
19. **"Plan only" means no code.** When the user asks for a Markdown plan (section layouts, left and right inner sections, per-device widths), produce the plan file and stop.
20. **"Keep changes minimal" means** touch only the named blocks, add new blocks beside old ones, migrate stories only where a dependency requires it, and list every file touched.
21. **Do not make the user repeat themselves.** When an instruction arrives for the second time, restate it as a checklist item, find why the first attempt did not satisfy it, and add a row to the incident log.

## Block spec template (one per block, under 150 lines, handed inline to builders)
```
name / type (content type | nestable | universal) / group
laymen sentence: "Use this to ..."
tabs and fields: label | key | type | default | description with example
bloks fields: allowlist, min, max (none unless justified)
style options: token roles only
per-device options
empty and fallback behaviour
editor-only help (draft mode)
renderer parity: schema field -> prop
tests: empty | one | many | legacy | "" value
```

## References
- `storyblok-core/references/incident-log.md` sections B and G.
- `storyblok-schema` for the CLI push and gates; `design-tokens` for the token roles.
