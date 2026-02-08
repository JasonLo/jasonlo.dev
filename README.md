# jasonlo.dev

[![Built with Astro](https://astro.badg.es/v2/built-with-astro/tiny.svg)](https://astro.build)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Source code for [jasonlo.dev](https://jasonlo.dev) — a personal portfolio built around project case studies, documenting decisions, trade-offs, and outcomes.

## Stack

- **Astro v5** — Static site generation with MDX content collections
- **Vanilla CSS** — Dark/light theme, WCAG AA compliant
- **Bun** — Package manager and runtime
- **GitHub Actions** — Auto-deploy on push + weekly publication sync via OpenAlex

## Development

```sh
bun install
bun run dev       # Start dev server
bun run build     # Type-check + build
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
    publications/    # Academic publications (MDX, synced from OpenAlex)
    tools/           # Tools and software (MDX)
  pages/             # File-based routing
  layouts/           # BaseLayout, ArticleLayout, CaseStudyLayout
  components/        # Astro components (ListLayout, SEO, etc.)
  styles/            # global.css, typography.css, utilities.css
```

## Automation

- **Publish workflow** — Builds and deploys to GitHub Pages on every push to `main`
- **Publication sync** — Weekly GitHub Action pulls publication data from OpenAlex API and commits updates automatically
