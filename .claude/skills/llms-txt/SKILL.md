---
name: llms-txt
description: Generate or update the /llms.txt file for AI discoverability. Reads site config and all content collections to produce a structured Markdown file following the llmstxt.org specification.
---

Generate or update the site's `/llms.txt` endpoint. Run this after adding, removing, or significantly editing content.

## Overview

The `/llms.txt` file follows the [llmstxt.org](https://llmstxt.org/) specification — a Markdown file at the site root that helps LLMs understand the site's content and structure.

## Step 1 — Read site context

Read these files to understand the current site state:

1. `src/config.ts` — author info, site URL, social links, navigation
2. `src/pages.config.ts` — page descriptions and headings
3. `src/content.config.ts` — content collection schemas

## Step 2 — Read all content collections

Read all non-draft MDX files from each collection to gather titles, summaries, and metadata:

- `src/content/projects/*.mdx` — extract `title`, `role`, `year`, `outcomeSummary`, `status`
- `src/content/publications/*.mdx` — extract `title`, `authors`, `journal`, `publishDate`
- `src/content/journey/*.mdx` — extract `date`, `title`, `type`, `description`
- `src/content/tools/*.mdx` — extract `name`, `description`, `is_favorite`

Filter out any entries with `draft: true`.

## Step 3 — Generate llms.txt content

Follow the llmstxt.org specification exactly:

```markdown
# {Site Title}

> {Brief summary of the site and its author — 2-3 sentences from config and pages.config}

{A short paragraph about the site's purpose, structure, and content types}

## Projects

- [{title}]({url}): {outcomeSummary}
  (repeat for each non-draft project, sorted by year descending)

## Publications

- [{title}]({url}): {journal}, {publishDate year}. Authors: {authors joined}
  (repeat for each non-draft publication, sorted by publishDate descending)

## Journey

- [{title}]({url}): {description} ({date year})
  (repeat for each non-draft journey entry, sorted by date descending)

## Tools

- [{name}]({url}): {description}
  (repeat for each non-draft tool, sorted by is_favorite descending then name)

## Optional

- [Sitemap]({siteUrl}/sitemap-index.xml): XML sitemap for all pages
```

### URL format

- Projects: `{siteUrl}/projects/{slug}/`
- Publications: `{siteUrl}/publications/` (publications are listed on a single paginated page, no individual routes)
- Journey: `{siteUrl}/journey/` (journey is a single timeline page, no individual routes)
- Tools: `{siteUrl}/tools/` (tools are listed on a single page, no individual routes)

For collections without individual pages (publications, journey, tools), link to the listing page instead of per-item URLs.

### Slug derivation

Project slugs are derived from the MDX filename (without `.mdx` extension).

## Step 4 — Write the endpoint

The file should be an Astro API route at `src/pages/llms.txt.ts`, following the same pattern as `src/pages/robots.txt.ts`:

- Import content collections using `getCollection` from `astro:content`
- Filter out drafts
- Sort entries as specified above
- Build the Markdown string
- Return a `Response` with `Content-Type: text/plain; charset=utf-8`

If the file already exists, update it. If not, create it.

## Step 5 — Validate

1. Run `bun run build` to verify the route compiles
2. Check that `dist/llms.txt` exists in the build output and contains the expected content
