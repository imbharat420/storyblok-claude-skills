# Token hygiene
| Token | Grants | May live in |
| --- | --- | --- |
| Public CDA token | published content read | client bundle, env |
| Preview CDA token | draft read | server env only; preview routes; never in production HTML |
| Personal access token (PAT) | full MAPI on every space the user can see | CI secret store; ops server env; never argv, never logs, never files |
| OAuth token (apps) | scoped MAPI | app backend |
Rotation: Storyblok account > Security > Personal access tokens (PAT); Space > Settings > Access tokens (CDA). Rotate, redeploy, then revoke the old one. Search repos, chat exports, Postman collection variables and docs for the old value; `scripts/check-secrets.sh` in this package covers docs/, .claude/, prompts/, templates/, memory.md.
