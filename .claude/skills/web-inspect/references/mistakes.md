# Expensive mistakes (each has cost hours of rework)
1. Building click tabs when the original is scroll-driven, or the reverse. Determine the interaction model by scrolling first, clicking second.
2. Extracting only the default state. Click every tab; capture header at scroll 0 and past threshold.
3. Missing layered images: background + foreground mockup + overlay icon = 3 assets in one container.
4. Building HTML mockups of content that is a video, Lottie or canvas.
5. Approximating classes: computed 18px/24px is not text-lg (18px/28px).
6. One monolithic build. Incremental sections, verified build after each merge.
7. Treating a new target as permission to replace the current app or another page's namespace.
8. Builder prompts that say "see DESIGN_TOKENS.md". Specs are inline.
9. Skipping asset enumeration at any fidelity; even at reference the count and dimensions drive the estimate.
10. Builder scope too large. Over 150 spec lines means split.
11. Inspecting only at desktop width.
12. Missing smooth-scroll libraries (Lenis, Locomotive). The feel differs and users notice.
13. Dispatching without a spec file.
