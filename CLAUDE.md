# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

- `bun run dev` — Start development server
- `bun run build` — Type-check (`astro check`) then build static site
- `bun run preview` — Preview production build locally

There are no test or lint commands configured.

## Architecture

Astro v5 static site (SSG) using MDX content collections and vanilla CSS. Based on the "Case" portfolio theme — a case-study-first portfolio for engineers.

### Configuration Layers

- **`astro.config.mjs`** — Build config, integrations (MDX, Sitemap), env var schema, Sharp image optimization, Shiki syntax highlighting (GitHub Dark theme)
- **`src/config.ts`** — Runtime site config: `siteConfig` object with author info, social links, navigation structure. Uses `getEnv()` helper for env var access with fallbacks
- **`src/pages.config.ts`** — SEO metadata per page (title, description, heading, intro)
- **`src/content.config.ts`** — Five content collection schemas with Zod validation

### Content Collections

All content lives in `src/content/` as MDX files. Schemas are defined in `src/content.config.ts`:

| Collection | Key frontmatter |
|---|---|
| `projects` | title, role, year, overview, problem, constraints, approach, keyDecisions, techStack, impact, learnings, featured |
| `publications` | title, description, publishDate, tags, draft |
| `journey` | date, title, type (milestone/learning/transition), skills |
| `tools` | name, description, url, date, is_favorite, best_for, not_for, personal_remarks, license, tags |
| `testimonials` | name, role, company, quote, featured |

Collections support cross-referencing via `relatedProjects` slug arrays.

### Routing

File-based routing in `src/pages/`. Dynamic routes use `[slug].astro` for individual items and `[...page].astro` for paginated listings (publications). Static pages: index, journey, tools, 404.

### Layouts

- `BaseLayout.astro` — HTML wrapper with SEO, nav, footer, theme toggle
- `PageLayout.astro` — Static pages
- `ArticleLayout.astro` — Blog articles (includes reading time via `src/utils/readingTime.ts` at 200 WPM)
- `CaseStudyLayout.astro` — Project case studies

### Styling

Custom vanilla CSS in `src/styles/` (global.css, typography.css, utilities.css). No Tailwind or CSS framework. Dark/light theme toggle supported. Dark mode uses a slate-blue palette; light mode uses blue-tinted greys. Nav/footer use `--color-bg`, main content uses `--color-bg-content` for subtle contrast.

### Environment Variables

Copy `.env.example` to `.env`. All vars are public/client-side. Key vars: `SITE_URL` (required for sitemap/canonical URLs), `SITE_AUTHOR_*`, `SOCIAL_*` (empty string hides the link).

## TypeScript

Strict mode (`astro/tsconfigs/strict`). No unused locals/parameters, no implicit returns or fallthrough cases.
