#!/usr/bin/env node
// deep-merge-story.js --snapshot path.json --space id --lang da [--dry-run]  (dry-run is the default)
const fs = require("fs");
const args = Object.fromEntries(process.argv.slice(2).map((a, i, arr) => a.startsWith("--") ? [a.slice(2), arr[i + 1]?.startsWith("--") || arr[i + 1] === undefined ? true : arr[i + 1]] : []).filter(Boolean));
const dry = args["dry-run"] !== false && args.write !== true;
const PRESERVE_TOP = ["uuid","group_id","created_at","published_at","position","sort_by_date","tag_list","favorites","permissions","workflow_stage","release_id","translated_slugs","dimensions","alternates","parent_id","full_slug","is_folder","default_root"];
function deepMerge(cur, snap) {
  if (Array.isArray(snap)) {
    if (!Array.isArray(cur)) return snap;
    const byUid = new Map(cur.filter(x => x && x._uid).map(x => [x._uid, x]));
    return snap.map(s => (s && s._uid && byUid.has(s._uid)) ? deepMerge(byUid.get(s._uid), s) : s);
  }
  if (snap && typeof snap === "object") {
    const out = { ...(cur || {}) };
    for (const [k, v] of Object.entries(snap)) { if (k === "_uid" && cur && cur._uid) { out._uid = cur._uid; continue; } out[k] = deepMerge(cur ? cur[k] : undefined, v); }
    return out;
  }
  return snap;
}
function diff(a, b, path = "", out = []) {
  if (JSON.stringify(a) === JSON.stringify(b)) return out;
  if (a && b && typeof a === "object" && typeof b === "object" && !Array.isArray(a)) { for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) diff(a[k], b[k], path + "/" + k, out); return out; }
  out.push({ path, from: a, to: b }); return out;
}
async function main() {
  const snap = JSON.parse(fs.readFileSync(args.snapshot, "utf8"));
  const lang = args.lang && args.lang !== "default" ? args.lang : null;
  const base = `https://mapi.storyblok.com/v1/spaces/${args.space}`;
  const H = { Authorization: process.env.STORYBLOK_PAT, "Content-Type": "application/json" };
  if (!process.env.STORYBLOK_PAT) throw new Error("STORYBLOK_PAT env required (never on argv)");
  const id = snap.story_id || snap.id;
  const cur = (await (await fetch(`${base}/stories/${id}${lang ? `?language=${lang}` : ""}`, { headers: H })).json()).story;
  if (!cur) throw new Error(`story ${id} not found; create flow required (not automatic)`);
  const merged = deepMerge(cur.content, snap.content);
  const changes = diff(cur.content, merged);
  const preserved = Object.fromEntries(PRESERVE_TOP.map(k => [k, cur[k]]));
  console.log(JSON.stringify({ id, lang: lang || "default", changes: changes.length, sample: changes.slice(0, 20), preserved_keys: Object.keys(preserved).filter(k => preserved[k] !== undefined) }, null, 2));
  if (dry) { console.log("DRY RUN: nothing written. Pass --write to apply (dev space only unless Gate C recorded)."); return; }
  const body = { story: { content: merged }, ...(lang ? { lang } : {}) };
  const res = await fetch(`${base}/stories/${id}`, { method: "PUT", headers: H, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  const check = (await (await fetch(`${base}/stories/${id}${lang ? `?language=${lang}` : ""}`, { headers: H })).json()).story;
  console.log("verified changes remaining:", diff(check.content, merged).length);
}
main().catch(e => { console.error(e.message); process.exit(1); });
