import { getPublished } from '../utils/collections';

interface SearchItem {
  type: 'project' | 'blog' | 'tool' | 'publication' | 'journey';
  title: string;
  description: string;
  url: string;
  tags: string[];
  meta: string;
  external?: boolean;
}

export async function GET() {
  const [projects, blog, tools, publications, journey] = await Promise.all([
    getPublished('projects'),
    getPublished('blog'),
    getPublished('tools'),
    getPublished('publications'),
    getPublished('journey'),
  ]);

  const items: SearchItem[] = [
    ...projects.map((p) => ({
      type: 'project' as const,
      title: p.data.title,
      description: p.data.outcomeSummary,
      url: `/projects/${p.id}`,
      tags: p.data.techStack,
      meta: String(p.data.year),
    })),
    ...blog.map((b) => ({
      type: 'blog' as const,
      title: b.data.title,
      description: b.data.description,
      url: `/blog/${b.id}`,
      tags: b.data.tags ?? [],
      meta: String(b.data.publishDate.getFullYear()),
    })),
    ...tools.map((t) => ({
      type: 'tool' as const,
      title: t.data.name,
      description: t.data.description,
      url: `/tools#${t.id}`,
      tags: t.data.tags ?? [],
      meta: String(t.data.date.getFullYear()),
    })),
    ...publications.map((p) => {
      const externalUrl = p.data.doi ?? p.data.oaUrl;
      return {
        type: 'publication' as const,
        title: p.data.title,
        description: p.data.journal,
        url: externalUrl ?? `/publications#${p.id}`,
        tags: p.data.tags ?? [],
        meta: String(p.data.publishDate.getFullYear()),
        external: Boolean(externalUrl),
      };
    }),
    ...journey.map((j) => ({
      type: 'journey' as const,
      title: j.data.title,
      description: j.data.description,
      url: `/journey#${j.id}`,
      tags: j.data.skills ?? [],
      meta: String(j.data.date.getFullYear()),
    })),
  ];

  return new Response(JSON.stringify(items), {
    headers: { 'Content-Type': 'application/json' },
  });
}
