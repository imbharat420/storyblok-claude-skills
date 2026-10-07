# Pre-flight evidence
| Item | Evidence accepted |
| --- | --- |
| Reproduction right | email or contract clause naming the domain; or fidelity `reference` in OUTPUT_PLAN |
| Secrets scan | `check-secrets.sh` output OK, dated |
| Token scoping | env var names listed; no PAT in web app env |
| Browser limits | page list contains no `/account`, `/login`, `/checkout`; if it does, marked out of scope |
| Personal data inventory | table of fields and where they flow (CRM, mailbox, datasource) |
| Route inventory | `docs/OUTPUT_PLAN.md` existing-routes section filled |
| Approvers | `docs/GATES.md` names per action |
| Licences | `manifest.json` licence column not UNREVIEWED at emulation |
