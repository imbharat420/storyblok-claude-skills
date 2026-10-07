---
name: "risk-and-compliance"
description: "Pre-flight and ongoing risk control for web reverse-engineering and Storyblok delivery: reproduction rights and fidelity gating, credential exposure scanning and rotation, browser-automation limits, personal-data inventory, Storyblok token scoping, production write gates, and a data-breach runbook with the GDPR 72-hour notification clock. Use this skill before Gate A on every project, whenever a token, password, PAT, API key or personal data appears in any input, whenever a write to a live client system is proposed, and when anything \"went wrong\" with credentials or data. Do not use to give legal opinions; it produces checks, findings and escalation steps."
---

# risk-and-compliance

Blocks Gate A on a legal or security finding; never soft-passes. Findings are stated once, with the action and owner.

## Pre-flight checklist (before Gate A)
- [ ] Client's right to reproduce the target confirmed in writing, or fidelity set to `reference`
- [ ] `scripts/check-secrets.sh` passes on uploads copied into the repo, docs/, .claude/, memory.md
- [ ] Storyblok tokens scoped: preview token for reads, PAT only in CI secrets, dev space for all writes
- [ ] Browser automation limits acknowledged; no authenticated pages, no form submission, no CAPTCHA
- [ ] Personal data inventory: forms, datasources, comments, enquiry stories listed or confirmed absent
- [ ] Existing routes and artefacts inventoried; nothing replaced without approval
- [ ] `--delete`, bulk publish, production push each mapped to a named approver in `docs/GATES.md`
- [ ] Third-party fonts and images: licence column present in every asset manifest

## Credential exposure procedure
1. Identify the token type and what it grants (see storyblok-core token-hygiene).
2. Rotate immediately; redeploy; revoke old.
3. Search every carrier: repos and git history, chat exports, Postman collection variables, docs, shared drives.
4. Record in `RISK_REGISTER.md`: what, where found, when rotated, by whom. Never record the value.

## Cases seen in real sessions (multisite project)
- A copied browser `curl` pasted into a prompt contains an `authorization` JWT and cookies of the user's Storyblok session. Do not run it, do not store it, do not reuse the token. Tell the user once, plainly, that the session token is now in the transcript and should be rotated (sign out everywhere), and ask for the data in another form (export, screenshot, API with the user's PAT in env).
- A PAT sits in plain text in a committed config such as `.mcp.json` (`Authorization: Bearer ...`). Report the file and line, not the value. Move it to an environment variable the config reads, add the file or the variable to `.gitignore` as appropriate, and rotate the token. Check git history before saying it never left the machine.
- The browser tool is signed in to a different Storyblok account than the user's ("Space not found"). Say so, stop browser steps for that space, and verify through the API or ask for a screenshot. Never sign in for the user.
- Netlify "secrets scan" findings: separate non-secret config (omit the key) from real secrets (remove from every repo file, set only in the host's env). See `storyblok-multisite`.
- A first push to a space that holds a live site is a production write even when the user calls it a test: Gate C applies (see `storyblok-schema` pre-push safety).

## Breach runbook (short)
1. Identify: scope of exposure, systems reachable, data categories.
2. Contain: rotate, revoke, block, snapshot logs.
3. Assess: was personal data accessible or exfiltrated? Storyblok stories rarely hold it; enquiry forms and datasources sometimes do.
4. Notify: if personal data at risk, controller notifies the supervisory authority within 72 hours (UK GDPR / EU GDPR); document the decision either way.
5. Record: timeline, actions, owners; feed lessons into this skill's checklist.

## Risk register format
`ID | Risk | Likelihood (1-5) | Impact (1-5) | Owner | Mitigation | Status | Gate blocked`

## References
- `references/pre-flight-checks.md`: expanded criteria and evidence required per item.
- `references/breach-runbook.md`: full runbook with roles and templates.
