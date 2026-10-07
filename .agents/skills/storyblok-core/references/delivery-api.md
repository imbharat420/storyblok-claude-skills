# CDA read patterns

## Pagination loop (totals in headers)
```ts
async function allStories(params: Record<string,string>, token: string) {
  const out: any[] = []; let page = 1, total = Infinity, cv: string | undefined;
  while ((page - 1) * 100 < total) {
    const q = new URLSearchParams({ ...params, token, per_page: "100", page: String(page), ...(cv ? { cv } : {}) });
    const res = await fetch(`https://api.storyblok.com/v2/cdn/stories?${q}`, { next: { tags: ["storyblok"] } });
    if (!res.ok) throw new Error(`CDA ${res.status}: ${await res.text()}`);
    total = Number(res.headers.get("total") ?? 0);
    const json = await res.json(); cv ??= String(json.cv); out.push(...json.stories); page++;
  }
  return out;
}
```
## Defensive reads
- Relations: field may be a UUID string or a resolved story object. Normalise before use.
- Rich text: JSON document; render with the official renderer; never `toString`.
- `version=draft` requires preview token; production routes must never carry it.
- `language=da` with `fallback_lang=default` returns default-language content where translation is missing; record which fields fell back when auditing.
## Image service
`https://a.storyblok.com/f/<space>/<w>x<h>/<hash>/<name>.jpg/m/<width>x0/filters:format(webp)` — per-breakpoint width in `m/`; never one width for all breakpoints.
