# CLAUDE.md

## Build Commands

- `bun run build` — `astro check` (type-checks `src/` and `scripts/`) then builds.
- `bun run lint` — Biome check (format + lint) over `.ts`, `.mjs`, `.json`.
- `bun run lint:fix` — apply Biome's safe fixes.

Biome deliberately does not cover `.astro`: it parses only the `---` frontmatter
as a standalone module, so anything used only in the template below reads as
unused. Those files are covered by `astro check` instead. See `biome.jsonc`.

There are no tests configured.

## Architecture

Based on the "Case" portfolio theme — a case-study-first portfolio for engineers.

Shiki's dual GitHub Light/Dark themes are resolved against `data-theme` in `global.css`, so changing one requires changing the other.

### Content Collections

All content lives in `src/content/` as MDX files. Schemas are defined in `src/content.config.ts`. All collections support an optional `updatedDate` field, which feeds the Latest Updates feed.

#### Content style

- Avoid em-dashes (`—`) in prose content (blog posts, project write-ups, etc.). Use commas, parentheses, or separate sentences instead.

### Routing

Shortlinks live at `s/[key].astro` (sourced from `src/data/shortlinks.json`) and are excluded from the sitemap via the filter in `astro.config.mjs`.

### Styling

Nav/footer use `--color-bg`, main content uses `--color-bg-content` for subtle contrast.

The "Graph Paper" palette has a visitor-selectable base hue (`ThemePicker.astro`): `data-hue` on `<html>` (localStorage `hue`, absent = ink blue) overrides only the paper tint and accent tokens in `global.css`; `data-theme` (localStorage `theme`, absent = system) still picks light/dark. Hue blocks are not tied to `:root` so the picker's swatches resolve their own hue. Keep every hue × mode at WCAG AA, and mirror ink-blue changes into `404.astro` and `scripts/generate-og-image.ts`.

### Important: View Transitions

The site uses Astro's `ClientRouter` for client-side navigation. Inline scripts must use `astro:page-load` event (not `DOMContentLoaded`) to re-initialize on navigation.

## TypeScript

`scripts/` is type-checked along with `src/`. Both scripts are ES modules, so
their same-named top-level helpers (`main`, etc.) stay in separate module scopes
and do not collide.

## Scripts

- **`scripts/generate-og-image.ts`** — Renders `public/og-image.png` (1200x630) from the palette in `global.css` and the identity in `config.ts`. The name is drawn with the brand wordmark's vector path, so it carries no font dependency; the smaller lines are text and do resolve against system fonts. Re-run with `bun run og-image` after changing the author name, title, location, tagline, or palette.
- **`scripts/sync-publications-fused.ts`** — Fused publication sync that fetches journal articles from ORCID (public, no auth) and OpenAlex (optional `OPENALEX_API_KEY`), deduplicates by DOI / title slug, merges best fields, and writes MDX to `src/content/publications/`. Run with `bun run scripts/sync-publications-fused.ts`.

## Git Workflow

This is a single-branch repo: work directly on `main`, no feature branches or PRs.
Commit to `main` automatically once a task is complete, without asking. Never push;
the user pushes manually.

## Deployment

GitHub Pages via GitHub Actions. Custom domain `jasonlo.dev` configured. The `OPENALEX_API_KEY` secret is stored in GitHub Actions secrets for the publication sync workflow (`sync-publications-fused.yml`).
