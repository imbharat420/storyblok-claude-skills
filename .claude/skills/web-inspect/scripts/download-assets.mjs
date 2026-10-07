// node download-assets.mjs ASSETS.json public/sites/<site>/<page>   (fidelity emulation only)
import { mkdirSync, writeFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { basename } from "node:path";
const [,, listPath, outDir] = process.argv;
const list = JSON.parse(await readFile(listPath, "utf8"));
mkdirSync(outDir, { recursive: true });
const urls = [...new Set([...(list.images||[]).map(i=>i.src), ...(list.videos||[]).map(v=>v.src), ...(list.backgrounds||[]).map(b=>(b.url.match(/url\("?([^")]+)"?\)/)||[])[1])].filter(Boolean))];
const manifest = [];
async function get(u, attempt = 1) {
  try { const r = await fetch(u); if (!r.ok) throw new Error(r.status); const buf = Buffer.from(await r.arrayBuffer());
    const name = basename(new URL(u).pathname) || "asset"; const p = `${outDir}/${name}`; writeFileSync(p, buf);
    manifest.push({ source: u, file: p, bytes: buf.length, licence: "UNREVIEWED" }); }
  catch (e) { if (attempt < 3) return get(u, attempt + 1); manifest.push({ source: u, error: String(e) }); }
}
for (let i = 0; i < urls.length; i += 4) await Promise.all(urls.slice(i, i + 4).map(u => get(u)));
writeFileSync(`${outDir}/manifest.json`, JSON.stringify(manifest, null, 2));
console.log(`${manifest.filter(m=>m.file).length}/${urls.length} downloaded; review licence column before use.`);
