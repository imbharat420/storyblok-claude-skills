---
name: behaviour-sweep
description: Systematic discovery of every dynamic behaviour on a live page
  (scroll-triggered header changes, viewport-entry animations, auto-switching
  sidebars, scroll-snap, parallax, hover transitions, click-driven tabs and
  modals, time-driven carousels, responsive layout shifts) recorded with
  trigger, before/after states, transition and implementation mechanism. Use
  this skill whenever a page is being inspected for rebuild or documentation,
  before any section is extracted, and whenever the words animation,
  interaction, hover, scroll effect, sticky, carousel, tabs or "how does it
  behave" appear. Do not use on static screenshots or for pages behind login.
---
# behaviour-sweep

The interaction model is the most expensive thing to get wrong; this sweep runs before section extraction and produces `BEHAVIORS.md`.

## Do not use when
- Input is images or Figma (behaviour is not observable; record "not verifiable").
- The page is authenticated or gated.

## Procedure
1. **Scroll sweep (before any click).** Scroll slowly top to bottom. At each section pause. Record: header changes and the scroll position that triggers them; elements animating into view (type, stagger); sidebars or tab indicators that switch on their own (IntersectionObserver, not clicks); scroll-snap containers; parallax layers; theme transitions between sections; non-native scroll feel (Lenis, Locomotive). Use `scripts/scroll-diff.js` on the header and on any element that appears to change: run at scroll 0, scroll past the threshold, run again, diff.
2. **Click sweep.** Click every button, tab, pill, link, card, accordion header. Record what changes: content swap, modal, dropdown, route change. For tabs, click each and record the content per state.
3. **Hover sweep.** Hover buttons, cards, links, images, nav items. Record property changes and `transition`.
4. **Time sweep.** Wait 15 s on sections with carousels or counters. Record autoplay interval and loop.
5. **Responsive sweep.** Repeat layout observation at 1440, 768, 390. Record which sections change (column to stack, sidebar hidden, nav to drawer) and the approximate breakpoint.
6. **Write `BEHAVIORS.md`** using the format below. Reference every behaviour from the relevant component spec.

## Record format
```
### <Behaviour name>
- Section: <topology name>
- Model: scroll | click | hover | time | responsive
- Trigger: <exact: scrollY > 64px | IO threshold 0.3 rootMargin -30% | click .tab | hover .card | every 5000 ms | width < 768>
- State A: <props>
- State B: <props>
- Transition: <e.g. all 300ms cubic-bezier(0.4,0,0.2,1)>
- Mechanism: <CSS transition + scroll listener | IntersectionObserver | CSS animation-timeline | scroll-snap | position: sticky | JS library name>
- Evidence: <screenshot pair or extraction diff file>
```

## References
- `references/interaction-models.md`: how to tell scroll-driven from click-driven, and the Next.js implementation pattern for each.
