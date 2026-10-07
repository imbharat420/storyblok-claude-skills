// pnpm plugins:deploy: builds each field plugin and uploads + publishes it to "My plugins" in Storyblok.
// Talks to MAPI directly: the field-plugin CLI pages through every public plugin first and fails on a 422 there.
// Token comes from the environment only (PANACHE_STORYBLOK_PAT here; rename per project). Never pass it on argv.
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const API = "https://mapi.storyblok.com/v1/field_types/";
const PLUGINS = [{ name: "my-plugin-name", dir: join(dirname(fileURLToPath(import.meta.url)), "..", "apps", "my-plugin") }];
const token = process.env.PANACHE_STORYBLOK_PAT;
if (!token) { console.error("PANACHE_STORYBLOK_PAT is not set (.env.local)"); process.exit(1); }

async function api(method, path, body) {
  const res = await fetch(API + path, {
    method, headers: { Authorization: token, "Content-Type": "application/json" }, body: body && JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${path} -> ${res.status}: ${text}`); // full body, never swallowed
  return text ? JSON.parse(text) : {};
}

for (const p of PLUGINS) {
  console.log(`\n> ${p.name}`);
  const build = spawnSync("pnpm", ["run", "build"], { cwd: p.dir, stdio: "inherit", shell: process.platform === "win32" });
  if (build.status !== 0) process.exit(build.status ?? 1);
  const body = readFileSync(join(p.dir, "dist", "index.js"), "utf8");
  if (body.includes(token)) { console.error("token found in bundle, aborting"); process.exit(1); }

  const { field_types: mine = [] } = await api("GET", "?only_mine=1&per_page=100");
  let id = mine.find((f) => f.name === p.name)?.id;
  if (!id) {
    ({ field_type: { id } } = await api("POST", "", { field_type: { name: p.name, body } }));
    console.log(`created ${p.name} (${id})`);
  }
  await api("PUT", String(id), { field_type: { body }, publish: true });
  console.log(`published ${p.name} -> https://app.storyblok.com/#/me/plugins/${id}`);
}
