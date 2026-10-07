# Section catalogue to blocks
| Section type | Block | Variants (editor `variant`) | Notes |
| --- | --- | --- | --- |
| Hero | `hero` | image, video, split, centered, minimal; background: solid, gradient, shader, illustration | shaders/illustrations/animated backgrounds are variants, not blocks |
| Feature sections | `feature_list`, `feature_grid` | list, grid-2, grid-3, alternating | |
| Bento grid | `bento_grid` + `bento_item` | 2x2, 3x2, asymmetric | |
| Logo cloud | `logo_cloud` | row, grid, marquee | marquee = time-driven; respect reduced motion |
| Pricing | `pricing_table` + `plan` | cards, comparison table | toggle monthly/annual is click-driven |
| Testimonials | `testimonials` + `review` | carousel, grid, single | carousel = CSS scroll-snap |
| Team | `team_grid` + `person` | grid, list | |
| Stats | `stat_list` + `stat` | row, grid | counters are time-driven on view |
| CTA | `cta` | banner, split, card | |
| FAQ | `faq` (accordion) | single-open, multi-open | |
| Blog list / content | `article_list`, `article_body` | grid, list; rich text | |
| Contact | `contact_section` + `enquiry_form` | split, stacked | form controls never placed singly |
| Empty state | variant on list blocks | | not a page |
| Sidebar | `section.layout: sidebar-left | sidebar-right` | | not a block |
| Navbar, Footer, Login/Signup | `site_config` + app routes | | never blocks |
| Text animations | `text.variant: reveal | typewriter` | | reduced-motion fallback required |
