# MUI catalogue decision table
| MUI item | Decision | Target |
| --- | --- | --- |
| Typography | block | `text` |
| Button, Button Group, Toggle Button | block | `button_group` / `button` |
| Card, Paper | block | `media_card`, `review` |
| Chip, Badge | block | `badge_list`; `media_card.badge` |
| Avatar | block option | `image` with `shape: circle` |
| Divider | block | `divider` |
| Rating | block | `rating` |
| Alert | block | `alert` |
| Accordion | block | extend `faq` |
| Tabs | block | `tabs` + `tab` |
| Stepper, Timeline | block | `timeline` + `timeline_item` |
| Table | block | `table` |
| Image List, Masonry | block | `gallery` |
| Grid, Stack, Container, Box | block/layout | `columns`, `section`, `grid` |
| Icons | primitive | `Icon.tsx` list |
| List | block | `feature_list` (`layout: list`) |
| Breadcrumbs, App Bar, Drawer, Menu, Menubar, Link, Bottom Navigation | app-level | `SiteShell`, `site_config` |
| Text Field, Select, Checkbox, Radio, Switch, Slider, Autocomplete, Number Field | app-level | inside `enquiry_form`, `search` blocks only |
| Dialog, Modal, Popover, Popper, Backdrop, Snackbar, Tooltip, Progress, Skeleton, Speed Dial, FAB, Pagination, Transfer List | app-level or skip | app behaviour |
| Utils (Portal, No SSR, Transitions, useMediaQuery, CSS Baseline, InitColorSchemeScript) | skip | React internals |
| MUI X (Data Grid, Date/Time Pickers, Charts, Tree View) | skip | native inputs; charts only if a spec demands |
Native first: slider = CSS scroll-snap; lightbox = `<dialog>`; tabs = small client component with ARIA roles. No new dependencies by default.
