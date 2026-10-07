---
name: "design-tokens"
description: "Derive a semantic design token set (colour roles, type scale, spacing scale, radius, shadow, breakpoints, motion) from measured computed styles, from Figma variables, or from images (labelled estimated), and emit it as Tailwind v4 theme variables plus DESIGN_TOKENS.md with the raw-to-semantic mapping. Use this skill whenever tokens, theme, colours, typography scale, spacing scale, brand variables, dark mode variables or \"design system foundations\" are needed, including when a component inventory or Storyblok schema is about to be derived. Do not use to pick a new brand palette from taste; that is a design decision recorded at Gate A."
---

# design-tokens

Tokens are the only place a hex or px value may live. Everything downstream (primitives, blocks, editor options) refers to token names.

## Do not use when
- The client has a published design system already; import it instead and record the mapping.

## Inputs by source
| Source | Procedure | Label |
| --- | --- | --- |
| Live site | `scripts/tokens-from-computed.js` across the page; cluster values; name roles by usage frequency and element type | measured |
| Figma | Variables collection export or plugin read; if no variables, sample fills and text styles | measured or inferred |
| Images | Colour picker sampling on flat regions; font size by pixel measurement against known viewport | estimated |

## Procedure
1. Collect raw values (colour, font-size, line-height, font-weight, letter-spacing, padding/margin/gap, border-radius, box-shadow, transition-duration).
2. Cluster: colours within delta-E 3; sizes to nearest scale step; spacing to a 4 px base (record deviations).
3. Name semantically. Colour roles: `background`, `foreground`, `primary`, `primary-foreground`, `secondary`, `muted`, `muted-foreground`, `accent`, `border`, `ring`, `destructive`, `success`, `warning`; each with `-hover` where observed. Type: `xs sm base lg xl 2xl 3xl 4xl 5xl` with paired line heights. Spacing: `0 1 2 3 4 5 6 8 10 12 16 20 24`. Radius: `none sm md lg xl full`. Shadow: `sm md lg overlay`. Motion: `duration-fast 150ms`, `duration-base 300ms`, `duration-slow 500ms`, easing.
4. Dark mode: second value per colour role under `[data-theme=dark]`; if the target has no dark mode, derive nothing and record "dark mode: not in source".
5. Breakpoints: measured from `RECON.breakpointsHint` and the responsive sweep; default `sm 640 md 768 lg 1024 xl 1280 2xl 1536` only when measurement is impossible.
6. Emit `packages/themes/tokens.ts` (typed object), `globals.css` `@theme` block (from `assets/theme.template.css`), and `DESIGN_TOKENS.md` with three columns: token, value, raw source values mapped.
7. Run the `token-only-styling` check idea: any hex or px literal outside the theme file fails.

## References
- `references/naming.md`: role names and the mapping to shadcn token names for compatibility.
