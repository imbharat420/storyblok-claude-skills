# MAPI write patterns

## Throttled client (one instance per process)
Spaces requests at least `1000 / RPS` ms apart, retries 429 and 5xx with `Retry-After` or backoff, keeps every error body, and leaves `Content-Type` alone for non-JSON bodies (S3 upload uses multipart).
```ts
const RPS = Number(process.env.MAPI_RPS ?? 3);          // plan dependent; Retry-After wins over this
const GAP = 1000 / RPS;
let nextSlot = 0;
const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms));
async function slot() { const at = Math.max(Date.now(), nextSlot); nextSlot = at + GAP; await sleep(at - Date.now()); }

export async function mapi<T = unknown>(path: string, init: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = { Authorization: process.env.STORYBLOK_PAT!, ...(init.headers as Record<string, string>) };
  if (typeof init.body === "string") headers["Content-Type"] ??= "application/json";
  for (let attempt = 0; attempt < 5; attempt++) {
    await slot();
    const res = await fetch(`https://mapi.storyblok.com/v1/spaces/${process.env.STORYBLOK_SPACE_ID}${path}`, { ...init, headers });
    if (res.status === 429 || res.status >= 500) {
      const retryAfter = Number(res.headers.get("Retry-After"));
      await sleep((retryAfter > 0 ? retryAfter * 1000 : 2 ** attempt * 500) + Math.random() * 300);
      continue;
    }
    const text = await res.text();
    if (!res.ok) throw new Error(`${res.status} ${init.method ?? "GET"} ${path}: ${text}`); // full body, never swallowed
    return (text ? JSON.parse(text) : {}) as T;
  }
  throw new Error(`gave up after 5 attempts: ${path}`);
}
```
Known limits of this client: it throttles one process only (two scripts at once share nothing), and `STORYBLOK_PAT` must come from the environment, never from argv or a committed file.

## Idempotent component push
List existing `components`; match by `name`; `PUT /components/{id}` when present else `POST /components`. Never delete unmatched components automatically. Prefer the CLI (`storyblok components push --space`) which does diff and changesets.
Before the first push to a space that already holds a site: run the read-only diff, read every `update` line (an existing `page` component is replaced, and fields not in code are removed from the schema), record the changeset path, push only to an empty or disposable space. Rollback: `npx storyblok schema rollback <changeset.json> --space <id> --dry-run`, then without `--dry-run`.
A custom field type used by a component must be deployed first (storyblok-field-plugins).

## Idempotent story import
Match by `full_slug` (and `lang` when localized). `PUT /stories/{id}` with `{ story: { content } }`, no `publish`. Folders first, ordered by depth. Preserve `_uid` on every block.
After editing seed files, run the stories dry-run against the target space and report drift (seed has a field the live story lacks) before debugging any renderer.

## Asset upload
```
1. POST /assets { filename, size: "1200x800", asset_folder_id? } -> { id, fields, post_url, pretty_url }
2. POST post_url as multipart with fields then file
3. GET /assets/{id}/finish_upload
```
## Field plugins (custom field types)
`GET /field_types?only_mine=1&per_page=100`, `POST /field_types { field_type: { name, body } }`, `PUT /field_types/{id} { field_type: { body }, publish: true }`, `DELETE /field_types/{id}`. Note: this is the account-level path `https://mapi.storyblok.com/v1/field_types/`, not under `/spaces/{id}`.

## Filters MAPI ignores silently
Some list filters accepted by CDA are not honoured by MAPI stories list; verify a filter by checking `total` changes before relying on it.
