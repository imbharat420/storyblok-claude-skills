# Working rules (global, do not edit per project)

## Rules
1. Think before coding: state assumptions, present interpretations when ambiguous, stop and ask when confused. Never pick silently.
2. Ponytail ladder before any code: (a) no change needed, (b) config change, (c) one-line change, (d) existing library or component, (e) new code. Stop at the first rung that holds. Never cut validation, error handling, security or accessibility to reach a lower rung.
3. Surgical changes only. Do not touch code, comments or files orthogonal to the task.
4. Every CSS value comes from `getComputedStyle()` or a Figma variable. A value that was inferred from an image is labelled `estimated` in every document that carries it.
5. Storyblok: MAPI never runs in the web runtime. Scripts never publish. `--delete` and bulk publish are never automatic. Every write goes to a disposable dev space first.
6. Styling is tokens in code. Editors pick semantic options (`tone`, `spacing`, `layout`, `variant`, `width`), never hex or px.
7. Corporate output: Arial, grey `D9D9D9` column headers, `F2F2F2` alternating rows, thin black borders, no tab colours, no icons, no emoji. First sentence of every section states the finding or decision.
8. Say what could not be verified. Never round a caveat into a guarantee. Row count is not specification depth.
9. Verify before you claim. "Done" means the real path ran (render, push diff, deployed plugin in a real story). Say which checks ran and which did not (typecheck, unit tests, preview, Visual Editor, live). Never write "works" for something only compiled.
10. A user instruction repeated twice is a defect in your work, not in the instruction. Restate it as a checklist item, find why the first attempt missed it, and add a row to `storyblok-core/references/incident-log.md`.
11. Editors must understand every field (laymen test). A list or filter never renders less than chosen without a visible reason and never shows an error string to visitors. See `storyblok-editor-ux`.
12. Runtime API calls from editor code (field plugins, preview widgets) cost rate limit on every keystroke and every instance. Prefer build-time data or schema options; state the call count first. See `storyblok-field-plugins`.
13. Never delete an untracked folder, never restart background servers on your own, never reuse a token pasted into a prompt. Report and ask.
14. Plan-gated Storyblok features (conditional fields, workflows, branches) are checked against the user's plan with a source and date, or labelled "not verified".

## Gates
- Gate A: scope and fidelity (`reference` | `rebuild` | `emulation`) approved. Nothing is built before Gate A.
- Gate B: block schema frozen. No seed, no push, no builder before Gate B.
- Gate C: write to a non-disposable Storyblok space approved by a named human.
Each gate is a checklist with approver and date in `docs/GATES.md`. The orchestrator refuses to route past an incomplete gate.

## Roles
- Only the orchestrator reads or writes `memory.md`. Other agents receive the relevant excerpt inline.
- Builders receive one spec inline (under 150 lines), never a path to a document. A builder with a gap asks; it never guesses.
- Discovery agents produce facts into `docs/research/`; they do not design or recommend.

## Do not
- Copy third-party images, fonts or copy into a client deliverable without a recorded licence or ownership statement (fidelity `emulation` only).
- Store tokens, PATs, preview keys or personal data in `memory.md`, `docs/` or `.claude/`.
- Load caveman mode in a client-facing session.
- Authenticate, submit forms, or solve CAPTCHAs during browser inspection. Stop and report.
- Replace an existing route, component namespace or research folder without explicit approval.

## Skills and agents
Skills live in `.claude/skills/<name>/SKILL.md`; agent roles in `.claude/agents/<role>.md`; the master prompt in `prompts/MASTER_PROMPT.md`. Load a skill by name; do not restate its content in the prompt.
