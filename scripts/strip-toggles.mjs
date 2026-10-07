// Produces prompts/ACTIVE_PROMPT.md from prompts/MASTER_PROMPT.md and prompts/toggles.json.
// Blocks are delimited by <!-- Fnn start --> ... <!-- Fnn end -->. Dependencies are enforced.
import { readFileSync, writeFileSync } from "node:fs";
const master = readFileSync("prompts/MASTER_PROMPT.md", "utf8");
const toggles = JSON.parse(readFileSync("prompts/toggles.json", "utf8"));
const deps = {
  F03: ["F02"], F05: ["F02|F06|F08"], F10: ["F05"], F11: ["F10"], F12: ["F11", "F07"],
  F13: ["F11"], F15: ["F02"], F17: ["F10"], F20: ["F02"], F22: ["F21"], F23: ["F16", "F17"],
};
const on = (id) => toggles[id] === "on";
for (const [id, reqs] of Object.entries(deps)) {
  if (!on(id)) continue;
  for (const r of reqs) {
    const ok = r.split("|").some(on);
    if (!ok) { console.error(`Refused: ${id} is on but requires ${r}.`); process.exit(1); }
  }
}
if (on("F24")) console.warn("Warning: F24 (caveman) is on. Never use in a client-facing session.");
let out = master;
for (const id of Object.keys(toggles)) {
  if (on(id)) continue;
  const re = new RegExp(`<!-- ${id} start -->[\\s\\S]*?<!-- ${id} end -->\\n?`, "g");
  out = out.replace(re, "");
}
out = out.replace(/<!-- F\d\d (start|end) -->\n?/g, "");
writeFileSync("prompts/ACTIVE_PROMPT.md", out);
console.log(`ACTIVE_PROMPT.md written: ${out.split("\n").length} lines, toggles on: ${Object.keys(toggles).filter(on).join(", ")}`);
