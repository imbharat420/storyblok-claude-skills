# Reverse-Engineering and Storyblok Delivery System

Skills, agents, memory and master prompt for taking any starting point (URL, UI images, code, Figma, Trello board, idea, existing Storyblok space) to a documented Storyblok + Next.js delivery plan with estimate and suggestion sheet. Generated from the specification document "Web Reverse-Engineering and Storyblok Delivery System — Skills, Agents and Memory Specification" (24 Sep 2026).

## Layout
```
CLAUDE.md                     global working rules (load once)
memory.template.md            per-project memory skeleton (orchestrator-only)
.claude/skills/<17 skills>/   SKILL.md + scripts/ references/ assets/
.claude/agents/<15 roles>.md  role, inputs, outputs, handoff contract
prompts/MASTER_PROMPT.md      toggle header F01–F24 + fixed body
prompts/toggles.json          per-project toggle values
scripts/strip-toggles.mjs     produces prompts/ACTIVE_PROMPT.md from toggles.json
scripts/check-secrets.sh      fails on token patterns in docs/, .claude/, memory.md
templates/                    DESIGN.md, OUTPUT_PLAN.md, GATES.md, RISK_REGISTER.md, spec template
```

## Assumptions taken where decisions D1–D7 were open
| Decision | Taken | To flip |
| --- | --- | --- |
| D1 runtime | Claude Code (`.claude/skills`, `.claude/agents`, `CLAUDE.md`) | For claude.ai projects, upload skills folder; agents become sections of the master prompt |
| D2 default fidelity | `reference` | Set `fidelity` in OUTPUT_PLAN; asset download only at `emulation` |
| D3 Storyblok reads | direct `fetch` with `next: { tags }` | `nextjs-storyblok/references/app-router-rules.md` has an SDK note |
| D4 rates | hours only | Add rate column to `estimate/assets/estimate_template.py` |
| D5 SEO | technical subset (about 30 checks) | Replace `seo-baseline` with the claude-seo plugin |
| D6 Trello | JSON export or Trello MCP if connected | `task-triage` agent input contract |
| D7 Word report | on request (F23 off) | Set F23 on in toggles.json |

## First run
1. `bash scripts/check-secrets.sh` — must pass.
2. Copy `memory.template.md` to `memory.md`; fill Project.
3. Edit `prompts/toggles.json`; run `node scripts/strip-toggles.mjs` → `prompts/ACTIVE_PROMPT.md`.
4. Start the session with `CLAUDE.md` + `ACTIVE_PROMPT.md`; the orchestrator classifies the scenario and asks the mandatory questions.
5. Calibrate the effort bands on one Dotsquares-owned page before client use.
