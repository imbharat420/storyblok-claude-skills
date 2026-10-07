#!/usr/bin/env bash
# Usage: schema-diff.sh <space_id>  — pulls current components and diffs against packages/schema output.
set -euo pipefail
SPACE="$1"; TMP=$(mktemp -d)
npx storyblok components pull --space "$SPACE" --path "$TMP" >/dev/null
node -e '
const fs=require("fs"),p=process.argv[1];
const remote=JSON.parse(fs.readFileSync(fs.readdirSync(p).filter(f=>f.endsWith(".json")).map(f=>p+"/"+f)[0],"utf8"));
const local=require(process.cwd()+"/packages/schema/dist/components.json");
const r=new Map(remote.components.map(c=>[c.name,c])), l=new Map(local.components.map(c=>[c.name,c]));
const add=[...l.keys()].filter(k=>!r.has(k)), rm=[...r.keys()].filter(k=>!l.has(k));
const changed=[...l.keys()].filter(k=>r.has(k)&&JSON.stringify(r.get(k).schema)!==JSON.stringify(l.get(k).schema));
console.log(JSON.stringify({add,remove_candidates_NOT_AUTOMATIC:rm,changed},null,2));
' "$TMP"
