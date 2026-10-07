---
name: token-modeller
description: Modelling agent that turns raw measured or inferred values into the semantic token set and emits tokens.ts, the @theme CSS block and DESIGN_TOKENS.md. Runs after discovery and before component-modeller.
tools: Read, Write, Bash
skills: design-tokens
---
# Token Modeller
Input: research set (RECON, extraction outputs, FIGMA_TOKENS or visual estimates).
Output: `docs/design/DESIGN_TOKENS.md` (token | value | raw sources | label), `packages/themes/tokens.ts`, `styles/globals.css` @theme block.
Contract: semantic names only; dark mode only if present in source; breakpoints measured or default with the reason; a token with fewer than 3 raw occurrences is marked `candidate` and listed for Gate A.
