# storyblok-claude-skills

**17 Claude Code skills and 16 agent roles that stop the mistakes AI assistants make with Storyblok and Next.js: unsafe schema pushes, 429 rate limits, empty lists, fields editors cannot find, broken multisite deploys, and field plugins stuck on "Loading...".**

Unofficial. Not affiliated with or endorsed by Storyblok.

```bash
npx skills add imbharat420/storyblok-claude-skills
```

---

## Why this exists

These rules come from real working sessions on a multi-brand Storyblok + Next.js 16 platform deployed on Netlify. Every rule traces to a mistake that cost a re-prompt, and each one is logged with its root cause in [`storyblok-core/references/incident-log.md`](.claude/skills/storyblok-core/references/incident-log.md).

| What went wrong | What prevents it | Skill |
| --- | --- | --- |
| A schema push replaced the live `page` component | Read-only diff first, push only to an empty or disposable space, rollback command written down | `storyblok-schema` |
| `Failed to create component` (422) | Deploy the field plugin before pushing the schema; read the full 422 body | `storyblok-field-plugins` |
| 429 while typing in the Visual Editor | Draft cache, request dedupe, `Retry-After`, debounce | `storyblok-core` |
| Field plugin works in the sandbox, stuck on "Loading..." after deploy | Handshake rules; declare `options: []`; zero API calls in plugins | `storyblok-field-plugins` |
| List shows 3 of 14 picked items, or nothing | Empty filter means no constraint; fallback steps; no error text for visitors | `storyblok-editor-ux` |
| `v.join is not a function` on a live page | Normalise every CMS value shape at the boundary | `storyblok-core` |
| Editor can't tell what a field does, or can't add a carousel | Laymen test, `bloks` fields instead of single image fields, consistent tabs | `storyblok-editor-ux` |
| "Not found" on a deployed site | Bare-hostname env rules, startup validation, Netlify secrets-scan settings | `storyblok-multisite` |
| Preview ignores edits typed in the editor | Shared dev state on `globalThis`, draft-mode rules | `nextjs-storyblok` |

## Install

**skills.sh (recommended)**
```bash
npx skills add imbharat420/storyblok-claude-skills                     # all skills
npx skills add imbharat420/storyblok-claude-skills --skill storyblok-core   # one skill
```

**Manual, Claude Code**
```bash
git clone https://github.com/imbharat420/storyblok-claude-skills
cp -r storyblok-claude-skills/.claude/skills/* ~/.claude/skills/          # all projects
# or into one project:
cp -r storyblok-claude-skills/.claude/skills/* your-project/.claude/skills/
cp storyblok-claude-skills/CLAUDE.md your-project/CLAUDE.md               # optional working rules
```

Skills load by name and by their `description` triggers, so you do not call them by hand. Mentioning "field plugin", "schema push", "429", "multisite" or "Netlify" is enough.

## The skills

### Storyblok build and operations
| Skill | Use it when | Key guarantees |
| --- | --- | --- |
| [`storyblok-core`](.claude/skills/storyblok-core/SKILL.md) | Any code, curl or Postman call to the Content Delivery or Management API | CDA vs MAPI hosts and auth, header-based pagination, draft caching, 429 handling, never auto-publish, three-step asset upload, value-shape normalisation |
| [`storyblok-schema`](.claude/skills/storyblok-schema/SKILL.md) | Blocks, content types, folders, CLI push or pull | Schema as TypeScript, pre-push safety, plugin-first order, allowlists, semantic options only |
| [`storyblok-field-plugins`](.claude/skills/storyblok-field-plugins/SKILL.md) | Custom field types, plugin sandbox, `plugins:deploy` | Zero API calls, handshake rules, MAPI deploy script, Vite config template |
| [`storyblok-editor-ux`](.claude/skills/storyblok-editor-ux/SKILL.md) | Creating or changing any block, grid, gallery, form or list | Laymen test, groups and tabs, token-role styling, lists that never silently empty, schema-to-renderer parity |
| [`storyblok-multisite`](.claude/skills/storyblok-multisite/SKILL.md) | Several brand sites in one space, env vars, Netlify | Host-to-site registry, env contract, secrets-scan settings, add-a-site checklist |
| [`nextjs-storyblok`](.claude/skills/nextjs-storyblok/SKILL.md) | Next.js App Router code for a Storyblok project | Tag-based caching, production vs `/preview` trees, HMAC revalidation, Visual Editor rules |
| [`storyblok-i18n-restore`](.claude/skills/storyblok-i18n-restore/SKILL.md) | Restore, rollback, copy between spaces, localized content | Dry-run and diff before any write, per-language PUT, preserve `_uid`, translated slugs, dimensions |

### Discovery and planning
| Skill | Use it when | Output |
| --- | --- | --- |
| [`web-inspect`](.claude/skills/web-inspect/SKILL.md) | A URL is the input and you need measured CSS and structure | Screenshots, computed styles, DOM, assets, per-component specs |
| [`behaviour-sweep`](.claude/skills/behaviour-sweep/SKILL.md) | Finding every scroll, hover, carousel and tab behaviour | Trigger, before and after state, mechanism per behaviour |
| [`stack-analyse`](.claude/skills/stack-analyse/SKILL.md) | "What is this site built with?" | Framework, rendering, CMS, CDN and a Next.js + Storyblok mapping |
| [`seo-baseline`](.claude/skills/seo-baseline/SKILL.md) | SEO, metadata, hreflang, sitemap, indexability | About 30 technical checks, each with a falsification test |
| [`design-tokens`](.claude/skills/design-tokens/SKILL.md) | Colours, type scale, spacing, brand variables | Tailwind v4 theme variables and a token map; image-derived values labelled `estimated` |
| [`component-model`](.claude/skills/component-model/SKILL.md) | "Which components do we need?" | Three-tier library plan: tokens, primitives, editor blocks |

### Delivery and governance
| Skill | Use it when | Output |
| --- | --- | --- |
| [`estimate`](.claude/skills/estimate/SKILL.md) | "How long will this take?" | Arithmetic over counted items, confidence band, `ESTIMATE.xlsx` and `.md`; says "not estimable" when inputs are missing |
| [`suggestion-sheet`](.claude/skills/suggestion-sheet/SKILL.md) | Improvement lists and audit findings | `SUGGESTIONS.xlsx`, one measured observation per row |
| [`corporate-docs`](.claude/skills/corporate-docs/SKILL.md) | Client deliverables | Fixed twelve-document set from one source so numbers never drift |
| [`risk-and-compliance`](.claude/skills/risk-and-compliance/SKILL.md) | Tokens in inputs, production writes, personal data | Pre-flight checks, credential exposure procedure, breach runbook |

## Working rules and gates

[`CLAUDE.md`](CLAUDE.md) holds the global rules. The ones that matter most:

- **Never publish from scripts.** `--delete` and bulk publish are never automatic. Every write goes to a disposable dev space first.
- **Verify before you claim.** "Done" means the real path ran. Say which checks ran (typecheck, unit tests, preview, Visual Editor, live) and which did not.
- **Editors pick semantic options** (`tone`, `spacing`, `layout`, `variant`, `width`), never hex or px.
- **A user instruction repeated twice is a defect in the assistant's work.** Restate it, find the miss, log it.
- **Runtime API calls from editor code cost rate limit on every keystroke.** Prefer build-time data.
- **Say what could not be verified.** A caveat is never rounded into a guarantee.

Three gates sit between phases, tracked with approver and date in `docs/GATES.md`:

| Gate | Meaning |
| --- | --- |
| A | Scope and fidelity (`reference`, `rebuild`, `emulation`) approved. Nothing is built before this. |
| B | Block schema frozen. No seed, push or builder before this. |
| C | Write to a non-disposable Storyblok space approved by a named human. |

## Agents

`.claude/agents/` holds 16 role definitions with inputs, outputs and a handoff contract: `orchestrator`, `task-triage`, `web-inspector`, `visual-extractor`, `visual-qa`, `figma-reader`, `code-reader`, `space-auditor`, `feature-interviewer`, `token-modeller`, `component-modeller`, `schema-deriver`, `builder`, `estimator`, `suggestion-analyst`, `risk-reviewer`. Only the orchestrator reads or writes `memory.md`; builders receive one spec inline, never a path.

## Repository layout

```
CLAUDE.md                     global working rules (load once)
memory.template.md            per-project memory skeleton (orchestrator only)
.claude/skills/<17 skills>/   SKILL.md + references/ scripts/ assets/
.claude/agents/<16 roles>.md  role, inputs, outputs, handoff contract
prompts/MASTER_PROMPT.md      toggle header F01-F24 + fixed body
prompts/toggles.json          per-project toggle values
scripts/strip-toggles.mjs     builds prompts/ACTIVE_PROMPT.md from toggles.json
scripts/check-secrets.sh      fails on token patterns in docs/, .claude/, memory.md
templates/                    DESIGN.md, OUTPUT_PLAN.md, GATES.md, RISK_REGISTER.md, spec template
```

## Use the whole system on a project

1. `bash scripts/check-secrets.sh` must pass.
2. Copy `memory.template.md` to `memory.md` and fill in the Project section.
3. Edit `prompts/toggles.json`, then `node scripts/strip-toggles.mjs` to produce `prompts/ACTIVE_PROMPT.md`.
4. Start the session with `CLAUDE.md` and `ACTIVE_PROMPT.md`. The orchestrator classifies the scenario and asks the mandatory questions.
5. Calibrate the effort bands in `estimate` on one page you have actually built before using an estimate with a client.

Starting points it handles: a live URL, UI images, existing code, a Figma file, a Trello board, an idea, or an existing Storyblok space.

## Defaults taken (change them if you disagree)

| Decision | Default | To change |
| --- | --- | --- |
| Runtime | Claude Code (`.claude/skills`, `.claude/agents`, `CLAUDE.md`) | For claude.ai projects, upload the skills folder; agents become sections of the master prompt |
| Fidelity | `reference` | Set `fidelity` in `OUTPUT_PLAN`; asset download only at `emulation` |
| Storyblok reads | Direct `fetch` with `next: { tags }` | `nextjs-storyblok/references/app-router-rules.md` has an SDK note |
| Estimate unit | Hours only | Add a rate column in `estimate/assets/estimate_template.py` |
| SEO scope | Technical subset | Swap in a dedicated SEO plugin for broader coverage |
| Word report | On request | Set F23 on in `toggles.json` |

## Limits and honesty

- Written October 2026 against Storyblok CLI 4.x, `@storyblok/field-plugin` 1.7.x and Next.js 16. API limits, plan features and CLI flags change; where a number is not confirmed against current Storyblok docs, the skill says "not verified" and tells Claude to read response headers instead.
- Rules from the incident log marked "unconfirmed" are inferences, not proven diagnoses.
- The skills reduce mistakes; they do not replace reading a diff before you push to a space that holds a live site.

## Contributing

The most useful contribution is a new incident: something an assistant got wrong with Storyblok that cost you a retry.

1. Add a row to [`incident-log.md`](.claude/skills/storyblok-core/references/incident-log.md): what happened, root cause (mark "unconfirmed" if unsure), the rule, the skill.
2. Put the rule in the skill it belongs to, with the shortest wording that would have prevented it.
3. Keep `SKILL.md` frontmatter valid YAML. Quote `description` (it contains colons) and keep `name` equal to the folder name.
4. Remove client names, space IDs and tokens from anything you add.

Issues and pull requests are welcome.

## License

MIT. See `LICENSE`.

Storyblok is a trademark of Storyblok GmbH. This project is independent and unofficial.
