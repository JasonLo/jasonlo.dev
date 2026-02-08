import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projectsCollection = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    role: z.string(),
    year: z.number(),
    link: z.string().url().optional(),
    duration: z.string().optional(),
    teamSize: z.number().optional(),
    outcomeSummary: z.string(),
    overview: z.string(),
    problem: z.string(),
    constraints: z.array(z.string()),
    approach: z.string(),
    keyDecisions: z.array(z.object({
      decision: z.string(),
      reasoning: z.string(),
      alternatives: z.array(z.string()).optional(),
    })),
    techStack: z.array(z.string()),
    impact: z.object({
      metrics: z.array(z.object({
        label: z.string(),
        value: z.string(),
      })).optional(),
      qualitative: z.string(),
    }),
    learnings: z.array(z.string()),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    status: z.enum(['completed', 'ongoing', 'archived']).default('completed'),
    relatedProjects: z.array(z.string()).optional(),
  }),
});

const journeyCollection = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/journey' }),
  schema: z.object({
    date: z.coerce.date(),
    title: z.string(),
    type: z.enum(['milestone', 'learning', 'transition']),
    description: z.string(),
    skills: z.array(z.string()).optional(),
    draft: z.boolean().default(false),
  }),
});

const publicationsCollection = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/publications' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    authors: z.array(z.string()),
    journal: z.string(),
    publishDate: z.coerce.date(),
    doi: z.string().url().optional(),
    oaUrl: z.string().url().optional(),
    citedByCount: z.number().default(0),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().default(false),
  }),
});

const toolsCollection = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/tools' }),
  schema: z.object({
    name: z.string(),
    description: z.string(),
    url: z.string().url().optional(),
    date: z.coerce.date(),
    is_favorite: z.boolean().default(false),
    best_for: z.string(),
    not_for: z.string().optional(),
    personal_remarks: z.string().optional(),
    license: z.string().optional(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  projects: projectsCollection,
  journey: journeyCollection,
  publications: publicationsCollection,
  tools: toolsCollection,
};
