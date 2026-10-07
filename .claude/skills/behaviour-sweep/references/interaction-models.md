# Interaction models

| Observation | Model | Next.js pattern |
| --- | --- | --- |
| Content changes as you scroll without clicking; sidebar item highlights as sections pass | scroll-driven (IntersectionObserver) | Client component with useEffect + IO; server-render all panels |
| Header shrinks or gains shadow after N px | scroll-driven (listener) | useEffect scroll listener with rAF throttle toggling a data attribute; CSS transition animates |
| Sections lock into place | scroll-snap | CSS scroll-snap-type on container; no JS |
| Layer moves slower than scroll | parallax | CSS animation-timeline: scroll() where supported; JS fallback flagged |
| Content changes only on click | click-driven | Client component with state; ARIA tab roles |
| Content cycles on its own | time-driven | setInterval with pause on hover; respects prefers-reduced-motion |
| Layout differs by width only | responsive | Tailwind breakpoints; no JS |

Rule: scroll first, click second. If nothing changes on scroll, then test clicks. Document the model at the top of every component spec.
