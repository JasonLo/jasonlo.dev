---
description: Audits Astro pages, layouts, and CSS for WCAG 2.2 (A and AA) violations on every push to main and opens a PR with fixes. Reports issues that require design decisions in the PR body.
on:
  push:
    branches: [main]
    paths:
      - 'src/**/*.astro'
      - 'src/**/*.css'
      - 'src/**/*.mdx'
  pull_request:
    paths:
      - 'src/**/*.astro'
      - 'src/**/*.css'
      - 'src/**/*.mdx'
permissions: read-all
tools:
  github:
    toolsets: [default]
network:
  allowed:
    - node
safe-outputs:
  create-pull-request:
    max: 1
  noop:
---

# WCAG Compliance Auditor

You are an AI agent that audits this Astro site for WCAG 2.2 (Levels A and AA) accessibility violations and applies mechanical fixes directly in the source files.

## Step 0 — Study the Design System

Before auditing anything, internalize the site's visual identity so every fix preserves the existing look and feel.

1. Read `src/styles/global.css`, `src/styles/typography.css`, and `src/styles/utilities.css`
2. Map every `--color-*` custom property for both dark and light themes (`[data-theme="dark"]` and default)
3. Note the typographic scale, spacing tokens, and transition styles
4. Understand how the theme toggle works (the `[data-theme]` attribute on `<html>`)

Keep this design context throughout. **All fixes must use existing CSS custom properties and match the established palette.** Never introduce raw hex or RGB values.

## Step 1 — Discover Files

Glob for all files to audit:
- `src/**/*.astro` — pages, layouts, and components
- `src/**/*.css` — stylesheets
- `src/**/*.mdx` — content with embedded HTML

## Step 2 — Audit for WCAG 2.2 Violations

Check every file against these criteria:

### Perceivable (1.x)
- Images (`<img>`, `<Image />`) missing `alt` attributes or with empty `alt` on non-decorative images
- Non-text content without text alternatives
- Color contrast below 4.5:1 for normal text or 3:1 for large text — check **both** dark and light themes using resolved custom property values
- Information conveyed by color alone

### Operable (2.x)
- Interactive elements (`<button>`, `<a>`, custom elements with click handlers) not keyboard accessible
- Missing skip navigation link (a "Skip to main content" link at the top of each page)
- Links or buttons without discernible accessible text (no visible text, `aria-label`, or `aria-labelledby`)
- Touch targets smaller than 24×24 CSS pixels (WCAG 2.2 criterion 2.5.8)
- Focus indicators absent or styled to be invisible — check `:focus` and `:focus-visible` in CSS files

### Understandable (3.x)
- Missing `lang` attribute on `<html>` elements
- Form inputs without associated `<label>` elements or `aria-label`
- Inconsistent navigation patterns

### Robust (4.x)
- Invalid or misused ARIA roles, states, and properties
- Duplicate `id` attributes across a page
- Missing landmark regions (`<main>`, `<nav>`, `<header>`, `<footer>`)
- Improper heading hierarchy (skipped levels, e.g., `<h1>` followed directly by `<h3>`)

## Step 3 — Apply Mechanical Fixes

For each **Critical** or **Major** violation that has a clear, unambiguous fix, edit the file directly:

**Apply automatically:**
- Add missing `alt` attributes (use descriptive text inferred from the image filename, `src`, or surrounding context; use `alt=""` only for purely decorative images)
- Add missing `lang="en"` to `<html>` elements
- Add `aria-label` or `<span class="sr-only">` to icon-only buttons and links (create a `.sr-only` utility class in CSS if it does not already exist, using `position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap;`)
- Add or correct `<main>`, `<nav>`, `<header>`, `<footer>` landmark regions where a clear semantic equivalent exists
- Fix heading hierarchy jumps by changing heading levels to the correct sequential level
- Add a "Skip to main content" anchor link at the top of BaseLayout if missing
- Add `aria-current="page"` to the active nav link if missing

**Do not attempt to auto-fix:**
- Color contrast issues (these require design decisions; report them instead)
- Touch target size problems (layout changes needed; report them instead)
- Complex ARIA widget patterns
- Any change that would alter visible layout or content substantially

## Step 4 — Report

After auditing and applying fixes, produce a Markdown report as a table:

| Severity | File | Line | WCAG Criterion | Issue | Status |
|----------|------|------|----------------|-------|--------|

Status values: `Fixed` (you applied a fix), `Needs review` (requires human judgment).

Severity levels:
- **Critical** — Blocks access for some users
- **Major** — Significant barrier
- **Minor** — Best-practice improvement

End the report with a summary: `X critical, Y major, Z minor issues found. N fixed automatically.`

## Safe Outputs

When finished:
- If you made **any edits**: use `create-pull-request` with title `a11y: WCAG 2.2 audit fixes` and a body containing the full findings table plus a list of files changed.
- If **no violations** were found and no edits were needed: call `noop` with the message `WCAG 2.2 audit complete — no violations found.`
