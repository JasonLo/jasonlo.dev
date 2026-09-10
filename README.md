# jasonlo.dev

[![Built with Astro](https://astro.badg.es/v2/built-with-astro/tiny.svg)](https://astro.build)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Source code for [jasonlo.dev](https://jasonlo.dev) — a personal portfolio built around project case studies, documenting decisions, trade-offs, and outcomes.

## Stack

- **Astro 7** — Static site generation with MDX content collections
- **Vanilla CSS** — Dark/light theme, WCAG AA compliant
- **Biome** — Lint + format for `.ts`/`.mjs`/`.json` (`.astro` is covered by `astro check`)
- **Bun** — Package manager and runtime
- **GitHub Actions** — Auto-deploy on push + weekly scheduled jobs (publication sync, doc cleanup, WCAG audit)

## Development

```sh
bun install
bun run dev       # Start dev server
bun run build     # Type-check (src + scripts) + build
bun run lint      # Biome: format + lint check
bun run lint:fix  # Biome: apply safe fixes
bun run preview   # Preview production build
```

## Project Structure

```txt
src/
  config.ts          # Site metadata, author info, social links, nav
  content.config.ts  # Zod schemas for all content collections
  pages.config.ts    # Per-page SEO metadata
  content/
    journey/         # Career timeline entries (MDX)
    projects/        # Project Retrospective (MDX)
    publications/    # Academic publications (MDX, synced from ORCID + OpenAlex)
    tools/           # Tools and software (MDX)
    blog/            # Blog posts (MDX)
  pages/             # File-based routing
  layouts/           # BaseLayout
  components/        # Astro components (ListLayout, SEO, etc.)
  styles/            # global.css, typography.css, utilities.css
  assets/            # icons/ and other static assets imported by components
  data/              # shortlinks.json (source for s/[key].astro)
  utils/             # Shared helpers (collections, date, readingTime)
scripts/             # generate-og-image.ts, sync-publications-fused.ts (type-checked)
```

## Automation

- **Publish workflow** — Builds and deploys to GitHub Pages on every push to `main` (`publish.yml`)
- **Publication sync** — Weekly GitHub Action fetches journal articles from ORCID (public API, no auth) and OpenAlex (optional API key), deduplicates by DOI/title, merges the best fields from each source, and commits updates automatically (`scripts/sync-publications-fused.ts`, `sync-publications-fused.yml`)
- **WCAG Compliance Auditor** — Claude Code Action that audits accessibility and opens PRs on pushes to `main` touching markup, styles, or content (`wcag-audit-claude.yml`)
- **CI** — Lint and type-check + build on every pull request (`ci.yml`)
