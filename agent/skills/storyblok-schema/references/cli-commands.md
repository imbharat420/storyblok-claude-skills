# Storyblok CLI (v4, "monoblok") notes from the CLI source
- `login` picks region (eu, us, ap, ca, cn); credentials stored locally; never pass tokens on argv.
- `components pull --space <id> [--path] [--separate-files] [--filename]`; `push --space <id> [--from <id>] [--filter]`.
- `stories pull/push`: JSON per story; push matches by slug; folders ordered before children.
- `assets pull/push`: writes `manifest.jsonl` and `folders/manifest.jsonl`; push re-uploads and remaps URLs by manifest; keep manifests in the repo for space-to-space migration.
- `datasources pull/push`: entries and dimensions; dimension values keyed by dimension name.
- `languages pull/push`: space language codes and names.
- `migrations`: field migrations for renamed or reshaped fields; prefer over versioned component names.
- Diff before push; the CLI reports adds and changes; deletions are never applied without `--delete`, which this system never runs unattended.
