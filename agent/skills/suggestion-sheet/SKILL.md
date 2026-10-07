---
name: suggestion-sheet
description: Produce the improvement suggestion workbook (SUGGESTIONS.xlsx) for
  a site or project with tabs for UI, Functionality, Storyblok, SEO, Performance
  and Accessibility, one row per suggestion carrying observation with evidence
  path, recommendation, effort band, impact, dependency, falsification test,
  decision dropdown and owner. Use this skill whenever improvements,
  recommendations, audit findings, "what should we change", quick wins, a review
  of the current site, or a client-facing list of issues is requested, and at
  the end of every discovery run. Do not record suggestions without a measured
  observation and a falsification test; preferences are not suggestions.
---
# suggestion-sheet

Every row is falsifiable: it states what was measured, what to change, and how we would know the change was wrong.

## Do not use when
- No discovery artefacts exist (there is nothing to observe).

## Columns (fixed order)
`ID | Area | Observation (measured, with artefact path) | Recommendation | Effort (S <4h, M 4-16h, L 16-40h, XL >40h) | Impact (1-5) | Dependency | Falsification test | Decision (Accept/Defer/Reject) | Owner | Notes`

## Areas and typical sources
| Area | Source artefacts |
| --- | --- |
| UI | specs, tokens (inconsistent spacing, more than N greys, contrast) |
| Functionality | BEHAVIORS.md (broken states, missing keyboard access, dead links) |
| Storyblok | schema and space audit (colour fields, missing allowlists, tags as taxonomy, orphan components) |
| SEO | seo-baseline output |
| Performance | image strategy, srcset share, font loading, script count |
| Accessibility | contrast, focus order, landmarks, alt text, reduced motion |

## Procedure
1. Read the research set; for each finding write the observation with the artefact path.
2. Write the recommendation as an action, and the falsification test ("if LCP does not improve by 300 ms on the hero page at 390 px, the recommendation was wrong").
3. Assign effort using estimate bands; impact 1-5 with one clause of reasoning in Notes.
4. Generate with `assets/suggestions_template.py` in house style; Decision column is a data-validation dropdown.
5. Sort each tab by Impact desc then Effort asc. Quick wins = Impact >= 4 and Effort S/M, listed first on a Summary tab.
