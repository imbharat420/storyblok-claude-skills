# Field type selection
| Content shape | Field type | Notes |
| --- | --- | --- |
| Short string | `text` | `translatable: true` when editorial |
| Long formatted | `richtext` | never `markdown` for new schemas; renderer handles headings, links, embedded blocks |
| Image or file | `asset` / `multiasset` | `filetypes` restriction; alt text in asset meta |
| Link | `multilink` | internal, external, email, asset |
| Enum | `option` | fixed `options`; this is the editor-facing styling surface |
| Multi enum | `options` | tags-like without tags |
| Reference | `option` with `source: internal_stories`, `filter_content_type` | taxonomy and relations |
| Nested blocks | `bloks` | `restrict_components` + `component_whitelist` always |
| Datasource pick | `option` with `source: internal`, `datasource_slug` | localized via dimensions |
| Boolean | `boolean` | avoid for styling; use `variant` |
| Date | `datetime` | |
| Number | `number` | never for px |
| Table | `table` | small data only; large tables become datasources or external |
Never: colour fields, CSS class fields, px/rem fields, raw HTML fields.
