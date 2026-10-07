# <ComponentName> Specification

## Overview
- Target file: `src/components/sites/<site-key>/<page-key>/<ComponentName>.tsx`
- Screenshot: `docs/design-references/<site-key>/<page-key>/<viewport>-<theme>-<state>.png`
- Interaction model: static | click | scroll | time | hover
- Fidelity: reference | rebuild | emulation

## DOM structure
<hierarchy: what contains what, roles, landmarks>

## Computed styles (from getComputedStyle)
### Container
- display, padding, maxWidth, gap, background, borderRadius, boxShadow, position, zIndex
### <Child 1>
- fontSize, fontWeight, lineHeight, letterSpacing, color, margin
### <Child N>

## States and behaviours
### <Behaviour>
- Trigger: <scroll px | IntersectionObserver rootMargin | click selector | hover>
- State A: <props>
- State B: <props>
- Transition: <duration easing properties>
- Mechanism: <CSS transition + listener | IntersectionObserver | animation-timeline | JS lib>
### Hover
- <element>: <prop> A -> B, transition

## Per-state content (tabs, carousels)
### State "<name>"
- fields

## Assets
- <role>: <url or local path>, <w x h>, layered with <other asset>

## Text content
<verbatim at emulation; structure + length at rebuild/reference>

## Responsive behaviour
- 1440:
- 768:
- 390:
- Breakpoint observed at ~<N>px

## Storyblok mapping (filled by schema-deriver)
- Block: <name> | app-level component (not a block)
- Editor options: tone | spacing | layout | variant | width
- Content fields:

## Not verifiable
- <item, reason>
