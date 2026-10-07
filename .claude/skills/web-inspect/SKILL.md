---
name: "web-inspect"
description: "Reverse-engineer a live website page into auditable research artefacts (screenshots per viewport, computed CSS per element, DOM structure, verbatim content, asset inventory, page topology, per-component spec files) using a browser tool. Use this skill whenever a URL is the input and the goal is to document, rebuild, migrate, estimate or improve a site, including \"inspect this site\", \"reverse engineer\", \"what does this page use\", \"capture the design\", \"make a spec from this page\", or any request that needs measured CSS values rather than estimates. Do not use for image-only inputs (use visual-extract), for repositories (use code-read), or when the client has not confirmed the right to inspect."
---

# web-inspect

Turn one page into files another agent can build from without guessing. Every value is measured; every state is captured; the output tree is namespaced so a second run updates rather than duplicates.

## Do not use when
- The input is screenshots or a PDF (visual-extract).
- The page requires login or shows a CAPTCHA: stop, report, ask.
- Fidelity is `emulation` and no ownership statement is recorded in memory.

## Inputs
- URL list, fidelity level, viewport set (default 1440 / 768 / 390), theme set (light; dark if present).
- `<app-root>`, `<site-key>`, `<page-key>` from `docs/OUTPUT_PLAN.md` (compute with `scripts/keys.mjs` if absent).

## Output tree (per page)
```
docs/research/<site-key>/<page-key>/
  RECON.md            fonts, colours, meta, global patterns, stack hints
  BEHAVIORS.md        from behaviour-sweep
  PAGE_TOPOLOGY.md    sections in order, sticky/flow, z-layers, interaction model
  ASSETS.json         every img/video/svg/background with dimensions and source URL
  components/<Name>.spec.md
docs/design-references/<site-key>/<page-key>/<viewport>-<theme>-<state>.png
```

## Procedure
1. **Pre-flight.** Confirm browser tool (Claude in Chrome preferred; Playwright fallback). Load `robots.txt`; do not visit disallowed paths. Rate: one page load per 2 s per origin.
2. **Reconnaissance.** Full-page screenshot per viewport and theme. Run `scripts/recon.js` in the page: fonts actually used, colour set, favicons, meta, framework markers, scroll libraries. Write `RECON.md`.
3. **Interaction sweep.** Load skill `behaviour-sweep`; run before any section extraction. Output `BEHAVIORS.md`.
4. **Topology.** List every section top to bottom with a working name, sticky or flow, z-index layer, and interaction model (`static | click | scroll | time | hover`). Write `PAGE_TOPOLOGY.md`.
5. **Section extraction.** For each section: scroll into view, screenshot; run `scripts/extract-styles.js` with the container selector (walks 4 levels, 20 children per level, 60 properties); for each state in `BEHAVIORS.md` trigger it and re-run; record the diff as `property: A → B, trigger, transition`. Extract text with `textContent`. Run `scripts/discover-assets.js` scoped to the container and note layered images (several `<img>` or backgrounds in one container, absolute overlays).
6. **Spec files.** One `components/<Name>.spec.md` per component from `assets/spec.template.md`. Every section filled; "N/A" only after checking hover states. Split any spec over 150 lines.
7. **Assets.** At fidelity `reference` list URLs only. At `rebuild` record dimensions for placeholders. At `emulation` download with `scripts/download-assets.mjs` into `public/sites/<site-key>/<page-key>/`, 4 parallel, retries, manifest with source URL and licence column.
8. **Handoff.** Report counts: sections, components, specs, screenshots, assets, behaviours, and the list of items not verifiable (blocked pages, lazy content that never loaded, fonts not resolvable).

## Pre-dispatch checklist (orchestrator verifies before any builder)
- [ ] Spec file exists per component, all sections filled
- [ ] Every CSS value from `getComputedStyle`, none estimated
- [ ] Interaction model named per section
- [ ] Every state's content and styles captured
- [ ] Scroll-driven: threshold, before/after, transition recorded
- [ ] Hover: before/after and timing recorded
- [ ] All images including overlays enumerated
- [ ] Responsive behaviour for desktop and mobile at minimum
- [ ] Text verbatim (or placeholder length at `rebuild`)
- [ ] Spec under 150 lines

## References
- `references/inspection-guide.md`: what to capture per phase (visual, component, layout, stack).
- `references/mistakes.md`: the expensive errors (click vs scroll, default state only, missed overlays, video mistaken for mockup, approximated classes).
- `assets/spec.template.md`: component spec template.
