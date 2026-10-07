---
name: "estimate"
description: "Produce a defensible effort estimate for a web or Storyblok project as arithmetic over counted items (tokens, primitives, static and interactive blocks, page templates, schema, seeding, languages, integrations, migrations, QA) with fixed phases and a confidence band that widens with unverified inputs, emitted as ESTIMATE.xlsx and ESTIMATE.md, plus a TCO line-item list without invented SaaS prices. Use this skill whenever hours, effort, timeline, sprint capacity, quote, budget, \"how long will this take\" or \"how much work\" is asked about any build, migration or redesign, and always after component-model completes. Do not use to produce a price without a rate card supplied by the user, and never to reassure: report \"not estimable, discovery required\" when inputs are missing."
---

# estimate

Hours = sum(items per class x band) + fixed phases, with a confidence band. A single number without its inputs is not an estimate.

## Do not use when
- The component inventory does not exist; run component-model first or produce a scoping-only estimate (16-32 h) and stop.

## Procedure
1. Count from `COMPONENT_INVENTORY.md`, `STORYBLOK_SCHEMA.md`, `ROUTES.md`, language matrix, integration map.
2. Apply `references/effort-bands.md` low / typical / high per class.
3. Add fixed phases: pre-flight 4-8; research per page 3-6 (S1), 2-4 (S2, S6), 6-12 per repo (S3, S4); documentation set 8-16; gate reviews 2-4 each; calibration run 8 (first project on a stack).
4. Confidence: start +/-15 %; +5 for each 10 % of components with `estimated` values; +5 per integration without a documented contract; +5 per language without confirmed content; cap +/-50 %. Above the cap: report "not estimable" and list missing inputs.
5. Sprint arithmetic: hours / (team size x 6 productive hours x working days) = sprints; state it as arithmetic, not a plan, and list the assumptions (holidays, review latency, client turnaround).
6. TCO lines: Storyblok plan and seats, hosting, image CDN, ops control plane, third-party APIs; values "client to supply" unless given.
7. Emit `ESTIMATE.xlsx` via `assets/estimate_template.py` (house style) and `ESTIMATE.md` (same numbers, one source).

## Calibration
The Buttress Architects plan (16 weeks, 10 sprints, 21 blocks, 3 gates) is the current calibration point for S1+S3 Medium. Record each delivered project's actuals in `references/effort-bands.md` to tighten the bands.

## References
- `references/effort-bands.md`: bands per item class and scenario reference points.
