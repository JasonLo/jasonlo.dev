# CLAUDE.md

## Build Commands

There are no test or lint commands configured.

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

### Important: View Transitions

The site uses Astro's `ClientRouter` for client-side navigation. Inline scripts must use `astro:page-load` event (not `DOMContentLoaded`) to re-initialize on navigation.

## TypeScript

The `scripts/` directory is excluded from type checking (`tsconfig.json`) since scripts are standalone and share function names.

## Scripts

- **`scripts/sync-publications-fused.ts`** — Fused publication sync that fetches journal articles from ORCID (public, no auth) and OpenAlex (optional `OPENALEX_API_KEY`), deduplicates by DOI / title slug, merges best fields, and writes MDX to `src/content/publications/`. Run with `bun run scripts/sync-publications-fused.ts`.

## Deployment

GitHub Pages via GitHub Actions. Custom domain `jasonlo.dev` configured. The `OPENALEX_API_KEY` secret is stored in GitHub Actions secrets for the publication sync workflow (`sync-publications-fused.yml`).
