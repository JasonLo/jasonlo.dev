---
name: wcag-audit
description: Audit Astro pages and components for WCAG 2.2 accessibility issues. Use when reviewing HTML templates, components, or layouts for accessibility compliance.
---

Perform a WCAG 2.2 accessibility audit on $ARGUMENTS (default: `src/` if no argument given).

## Step 0 — Study the site's design system

Before auditing, read and internalize the site's visual identity so that every suggested fix preserves the current look and feel.

1. **Read** `src/styles/global.css`, `src/styles/typography.css`, and `src/styles/utilities.css`
2. Extract the full color palette for **both** dark and light themes — map every `--color-*` custom property and note which theme it belongs to
3. Identify the typographic scale (font families, sizes, weights, line heights)
4. Note spacing tokens, border radii, transition styles, and any other recurring design patterns
5. Understand the theme toggle mechanism — how `[data-theme]` or `prefers-color-scheme` switches between modes

Keep this design context in mind throughout the audit. **All suggested fixes must use existing CSS custom properties and match the site's aesthetic.** Never suggest raw hex/rgb values or generic styles that clash with the established palette. When a contrast fix is needed, recommend the closest existing custom property that meets the required ratio, or suggest a new property that fits the palette naming convention.

## Audit scope

Check for violations across WCAG 2.2 levels A and AA. Organize findings by these categories:

### 1. Perceivable
- Images missing `alt` attributes or with non-descriptive alt text
- Missing or inadequate text alternatives for non-text content
- Color contrast ratios below 4.5:1 (normal text) or 3:1 (large text) — compute contrast for **both** dark and light themes using the actual custom property values
- Content that relies solely on color to convey meaning
- Missing captions or transcripts for media

### 2. Operable
- Interactive elements not keyboard accessible (missing `tabindex`, non-interactive elements with click handlers)
- Missing skip navigation links
- Focus order issues
- Missing or inadequate focus indicators in CSS — suggested focus styles must use the site's existing accent/highlight colors
- Links or buttons without discernible text
- Touch targets smaller than 24x24 CSS pixels (WCAG 2.2)

### 3. Understandable
- Missing `lang` attribute on `<html>`
- Form inputs without associated `<label>` elements
- Missing error identification and suggestions
- Inconsistent navigation patterns across pages

### 4. Robust
- Invalid or misused ARIA roles, states, and properties
- Duplicate `id` attributes
- Missing landmark regions (`<main>`, `<nav>`, `<header>`, `<footer>`)
- Improper heading hierarchy (skipped levels)

## Process

1. **Study the theme** — complete Step 0 above first
2. **Glob** for `.astro`, `.mdx`, and `.css` files in the target path
3. **Read** each file and check against the criteria above
4. For CSS files, pay special attention to:
   - `:focus` and `:focus-visible` styles
   - `prefers-reduced-motion` and `prefers-contrast` media queries
   - Color contrast for both dark and light modes using the resolved custom property values
5. For layout files, verify semantic HTML structure and landmark regions
6. For components, check ARIA usage and interactive element accessibility

## Output format

Report findings as a markdown table:

| Severity | File | Line | WCAG Criterion | Issue | Suggested Fix |
|----------|------|------|-----------------|-------|---------------|

Severity levels:
- **Critical** — Blocks access for some users (e.g., missing alt, no keyboard access)
- **Major** — Significant barrier (e.g., poor contrast, missing labels)
- **Minor** — Best-practice improvement (e.g., redundant ARIA, heading order)

All suggested fixes in the table must reference existing CSS custom properties (e.g., `var(--color-accent)`) and respect both dark and light themes.

End with a summary count: `X critical, Y major, Z minor issues found.`
