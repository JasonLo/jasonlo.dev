# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

- `bun run dev` — Start development server
- `bun run build` — Type-check (`astro check`) then build static site
- `bun run preview` — Preview production build locally

There are no test or lint commands configured.

## Architecture

Astro v5 static site (SSG) using MDX content collections and vanilla CSS. Based on the "Case" portfolio theme — a case-study-first portfolio for engineers.

### Configuration

- **`astro.config.mjs`** — Build config, integrations (MDX, Sitemap), Sharp image optimization, Shiki syntax highlighting (GitHub Dark theme)
- **`src/config.ts`** — Site config: `siteConfig` object with author info, social links, navigation. All values hardcoded (no env vars needed for build)
- **`src/pages.config.ts`** — SEO metadata per page (title, description, heading, intro)
- **`src/content.config.ts`** — Content collection schemas with Zod validation

### Content Collections

All content lives in `src/content/` as MDX files. Schemas are defined in `src/content.config.ts`:

| Collection | Key frontmatter |
| --- | --- |
| `projects` | title, role, year, duration, teamSize, overview, problem, constraints, approach, keyDecisions, techStack, impact, learnings, featured, status |
| `publications` | title, authors, journal, publishDate, doi, citedByCount, tags, draft |
| `journey` | date, title, type (milestone/learning/transition), skills |
| `tools` | name, description, url, date, is_favorite, best_for, not_for, personal_remarks, license, tags |

### Routing

File-based routing in `src/pages/`. Dynamic routes use `[slug].astro` for individual items and `[...page].astro` for paginated listings (publications). Static pages: index, journey, tools, 404.

### Layouts

- `BaseLayout.astro` — HTML wrapper with SEO, nav, footer, theme toggle, ClientRouter (View Transitions)
- `ArticleLayout.astro` — Blog articles (includes reading time via `src/utils/readingTime.ts` at 200 WPM)
- `CaseStudyLayout.astro` — Project case studies
- `ListLayout.astro` — Reusable list pages with client-side sort-by (tools, publications, projects)

### Styling

Custom vanilla CSS in `src/styles/` (global.css, typography.css, utilities.css). No Tailwind or CSS framework. Dark/light theme toggle supported. Dark mode uses a slate-blue palette; light mode uses blue-tinted greys. Nav/footer use `--color-bg`, main content uses `--color-bg-content` for subtle contrast.

### Important: View Transitions

The site uses Astro's `ClientRouter` for client-side navigation. Inline scripts must use `astro:page-load` event (not `DOMContentLoaded`) to re-initialize on navigation.

## TypeScript

Strict mode (`astro/tsconfigs/strict`). No unused locals/parameters, no implicit returns or fallthrough cases.

## Deployment

GitHub Pages via GitHub Actions. Custom domain `jasonlo.dev` configured. The `OPENALEX_API_KEY` secret is stored in GitHub Actions secrets for the publication sync workflow.
