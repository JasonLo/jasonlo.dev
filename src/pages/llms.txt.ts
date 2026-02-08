import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { siteConfig } from '../config';

export const GET: APIRoute = async () => {
  const siteUrl = siteConfig.url.endsWith('/')
    ? siteConfig.url.slice(0, -1)
    : siteConfig.url;

  const projects = (await getCollection('projects', ({ data }) => data.draft !== true))
    .sort((a, b) => b.data.year - a.data.year);

  const publications = (await getCollection('publications', ({ data }) => data.draft !== true))
    .sort((a, b) => new Date(b.data.publishDate).getTime() - new Date(a.data.publishDate).getTime());

  const journey = (await getCollection('journey', ({ data }) => data.draft !== true))
    .sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime());

  const tools = (await getCollection('tools', ({ data }) => data.draft !== true))
    .sort((a, b) => {
      if (a.data.is_favorite !== b.data.is_favorite) return a.data.is_favorite ? -1 : 1;
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
