import type { APIRoute } from 'astro';
import { siteConfig } from '../config';
import { getPublished } from '../utils/collections';

export const GET: APIRoute = async () => {
  const siteUrl = siteConfig.url.endsWith('/')
    ? siteConfig.url.slice(0, -1)
    : siteConfig.url;

  const projects = (await getPublished('projects'))
    .sort((a, b) => b.data.year - a.data.year);

  const publications = (await getPublished('publications'))
    .sort((a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime());

  const journey = (await getPublished('journey'))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  const tools = (await getPublished('tools'))
    .sort((a, b) => {
      if (a.data.isFavorite !== b.data.isFavorite) return a.data.isFavorite ? -1 : 1;
      return a.data.name.localeCompare(b.data.name);
    });

  const projectLines = projects
    .map(p => `- [${p.data.title}](${siteUrl}/projects/${p.id}/): ${p.data.outcomeSummary}`)
    .join('\n');

  const pubLines = publications
    .map(p => {
      const year = new Date(p.data.publishDate).getFullYear();
      const authors = p.data.authors.join(', ');
      return `- ${p.data.title}: ${p.data.journal}, ${year}. Authors: ${authors}`;
    })
    .join('\n');

  const journeyLines = journey
    .map(j => {
      const year = new Date(j.data.date).getFullYear();
      return `- ${j.data.title}: ${j.data.description} (${year})`;
    })
    .join('\n');

  const toolLines = tools
    .map(t => `- ${t.data.name}: ${t.data.description}`)
    .join('\n');

  const body = `# ${siteConfig.title}

> ${siteConfig.author.name} is a ${siteConfig.author.title.toLowerCase()} based in ${siteConfig.author.location}. ${siteConfig.description}

This is a personal portfolio site built with Astro, organized around project case studies, academic publications, a career journey timeline, and tool reviews. Content is authored in MDX with structured frontmatter.

## Projects

${projectLines}

## Publications

${pubLines}

## Journey

${journeyLines}

## Tools

${toolLines}

## Optional

- [Sitemap](${siteUrl}/sitemap-index.xml): XML sitemap for all pages
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
