// node keys.mjs https://example.com/some/path?tab=2  → site-key and page-key (origin slug + 8-hex sha256)
import { createHash } from "node:crypto";
const u = new URL(process.argv[2]);
const h = (s) => createHash("sha256").update(s).digest("hex").slice(0, 8);
const origin = u.origin.toLowerCase();
const siteSlug = origin.replace(/^https?:\/\//, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const path = u.pathname.replace(/\/+$/, "") || "/";
const stateful = u.search + u.hash;
const pageSlug = path === "/" ? "root" : path.replace(/^\//, "").replace(/[^a-zA-Z0-9]+/g, "-").toLowerCase();
console.log(JSON.stringify({ siteKey: `${siteSlug}-${h(origin)}`, pageKey: `${pageSlug}-${h(path + stateful)}`, route: path }, null, 2));
