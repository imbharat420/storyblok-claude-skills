---
name: component-model
description: Turn a research set (specs, behaviours, tokens) into a three-tier component library plan (tokens, developer primitives, editor blocks) with COMPONENT_INVENTORY.md, LAYOUT_ARCHITECTURE.md and INTERACTION_PATTERNS.md, deciding per component whether it is a Storyblok block, an app-level component or skipped, using the MUI decision table and the section catalogue. Use this skill whenever a component inventory, component library, design system structure, "which components do we need", block list, or reusable component plan is requested, and always before storyblok-schema runs. Do not use to write React code (builders do that from specs).
---

# component-model

Produce the inventory that the schema, estimate and builders all consume. Each component gets one decision: block, app-level, or skip.

## Do not use when
- No research set exists yet (run web-inspect, visual-extract, figma-read or code-read first).

## Procedure
1. **Collect** every `components/*.spec.md` and `BEHAVIORS.md` across pages. Merge duplicates by structure, not by name (two "cards" with the same DOM and options are one component with variants).
2. **Classify** each with `references/mui-decision-table.md`:
   - Block: editors place it, it carries content, it sits inside a section container.
   - App-level: shell, navigation, forms controls, feedback, overlays; driven by `site_config` or code.
   - Skip: MUI X, portals, transitions, utilities.
3. **Assign tier and container rule.** Elements (`text`, `image`, `button_group`, `divider`, `badge_list`, `alert`, `stat_list`, `rating`, `table`) only inside `section.items`, `columns`, `tabs`; sections stand in page `body`.
4. **Define editor options per block**, limited to `tone`, `spacing`, `layout`, `variant`, `width` with enumerated values; anything else is a content field or a developer variant.
5. **Write** `COMPONENT_INVENTORY.md` (table: name, tier, decision, variants, states, options, content fields, source specs, pages using it), `LAYOUT_ARCHITECTURE.md` (containers, grid, max-widths, sticky, z-layers per page type), `INTERACTION_PATTERNS.md` (behaviours grouped by mechanism with the implementation pattern).
6. **Count** for the estimator: primitives, static blocks, interactive blocks, page templates.

## References
- `references/mui-decision-table.md`: MUI catalogue and section catalogue with the take/skip decision.
- `references/component-catalogue.md`: the section catalogue (hero, features, pricing, testimonials, team, logo cloud, bento, CTA, stats, FAQ, blog, contact, empty state, sidebar) mapped to blocks and variants.
