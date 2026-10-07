# Inspection guide (what to capture)

## Visual audit
Screenshots: every distinct page at 1440/768/390; light and dark; hover, active, open menus, modals; loading/skeleton; empty; error.
Tokens: colours (background, text primary/secondary/muted, accent, border, hover, error, success, warning); typography (family, h1-h6, body, caption, label, weights, line heights, letter spacing); spacing scale; radius (buttons, cards, avatars, inputs); shadows (card, dropdown, modal overlay); breakpoints (measured in responsive mode); icon library and sizes; avatar sizes and fallback; button variants; input types.

## Component inventory (per component)
Name; structure; variants; states (default, hover, active, disabled, loading, error, empty); responsive behaviour; interactions (click, hover, focus, keyboard); animations.
Look for: navigation (top, side, bottom), cards, buttons and links, forms, modals, dropdowns, tabs, avatars, skeletons, toasts, tooltips, popovers.

## Layout architecture
Grid or flex; columns per breakpoint; max-width of content; sticky elements; z-index layers; scroll behaviour (infinite, pagination, virtual).

## Stack (see stack-analyse)
Framework markers; CSS approach; state management; API pattern (REST, GraphQL); font loading; image strategy (CDN, lazy, srcset, formats); animation library.

## Output files
DESIGN_TOKENS.md, COMPONENT_INVENTORY.md, LAYOUT_ARCHITECTURE.md, INTERACTION_PATTERNS.md, TECH_STACK_ANALYSIS.md (written by modelling agents from this skill's research set).
