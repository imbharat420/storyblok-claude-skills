---
name: corporate-docs
description: Generate the fixed twelve-document project set (DESIGN.md,
  DESIGN_TOKENS.md, COMPONENT_INVENTORY.md, LAYOUT_ARCHITECTURE.md,
  INTERACTION_PATTERNS.md, TECH_STACK_ANALYSIS.md, SITE_MAP.md with Mermaid,
  STORYBLOK_SCHEMA.md, SUGGESTIONS.xlsx, ESTIMATE.xlsx/.md, RISK_REGISTER.md,
  PROJECT_REPORT.docx) from one source so formats never drift, in the house
  style (Arial, D9D9D9 headers, F2F2F2 alternating rows, thin black borders, no
  icons, no emoji, first sentence states the finding). Use this skill whenever a
  document, report, spec, runbook, workbook, deck or client deliverable is
  produced or updated, and whenever numbers appear in more than one file. Do not
  use for chat answers or for code comments.
---
# corporate-docs

One source, many formats. Numbers live in `docs/source/project.json`; every document renders from it; a change is made once.

## Do not use when
- The output is a conversational answer or a code file.

## Style rules
- Arial throughout. Tables: grey `D9D9D9` header row, `F2F2F2` alternating rows, thin black borders, no tab colours, landscape fit-to-width.
- No icons, emoji, decorative fills or colour coding of status (words instead).
- First sentence of every section is the finding or decision. Caveats are one sentence, placed where the reader acts on them.
- Plain corporate prose; no hype, no hedging stacks; sentences under 25 words where possible.
- Mermaid only for branching or ordered flows with more than four participants; validate with the jsdom harness before shipping; on failure use a table.
- Screenshots referenced by path in Markdown; embedded at reduced resolution in Word only.

## Procedure
1. Update `docs/source/project.json` (counts, tokens summary, block list, estimate inputs, risks, suggestions path).
2. `python scripts/build-docs.py docs/source/project.json docs/` renders the Markdown set and calls the estimate and suggestion templates.
3. Word report only when F23 is on: read `/mnt/skills/public/docx/SKILL.md` first, then assemble from the Markdown set (executive summary, scope, findings, plan, gates, appendices).
4. Run `scripts/check-secrets.sh` on `docs/` before presenting.
5. Present files; no long post-ambles.

## Document set (fixed)
DESIGN.md, DESIGN_TOKENS.md, COMPONENT_INVENTORY.md, LAYOUT_ARCHITECTURE.md, INTERACTION_PATTERNS.md, TECH_STACK_ANALYSIS.md, SITE_MAP.md, STORYBLOK_SCHEMA.md, SUGGESTIONS.xlsx, ESTIMATE.xlsx + ESTIMATE.md, RISK_REGISTER.md, PROJECT_REPORT.docx (on request). A document not applicable to the scenario is still produced with a one-line "not applicable in S<n>" body.

## Assets
- `assets/xlsx.style.json`: fonts, fills, borders for openpyxl.
- `assets/DESIGN.template.md`: the inspection guide with placeholders for measured values.
