/**
 * Page Metadata Configuration
 * 
 * Centralized SEO metadata for all static pages. Single source of truth
 * for titles and descriptions to ensure consistency across the site.
 * 
 * Usage:
 * ```astro
 * ---
 * import BaseLayout from '../layouts/BaseLayout.astro';
 * import SEO from '../components/SEO.astro';
 * import { pagesConfig } from '../pages.config';
 * ---
 * 
 * <BaseLayout>
 *   <SEO 
 *     slot="head"
 *     title={pagesConfig.projects.title}
 *     description={pagesConfig.projects.description}
 *   />
 *   <!-- Page content -->
 * </BaseLayout>
 * ```
 * 
 * @module pages.config
 */

interface PageMeta {
  title: string;
  description: string;
  heading?: string;
  intro?: string;
}

/**
 * Pages configuration object
 * 
 * Contains metadata for all static pages. Dynamic pages (like individual
 * project or article pages) generate their own metadata from content.
 */
export const pagesConfig = {
  home: {
    title: 'Home',
    description: 'I\'m Jason Lo, a builder and repairer of systems, driven by the belief that real efficiency comes from rapid iteration and adaptation. My work is an ongoing experiment in applying cutting-edge AI, spanning neuroimaging, literacy, agriculture, and geoscience, to find the simplest and most robust path to discovery.',
  },

  journey: {
    title: 'Journey - Career Growth & Learning Timeline',
    heading: 'Journey',
    description: 'A chronological timeline of my professional journey, highlighting key milestones, learning moments, and career transitions.',
    intro: 'A timeline of my professional growth and learning progression.',
  },

  projects: {
    title: 'Projects',
    heading: 'Projects',
    description: 'Detailed projects showcasing problem-solving approach, technical decisions, and measurable impact.',
    intro: 'Projects that demonstrate how I approach problems.',
  },

  publications: {
    title: 'Publications - Academic Research',
    description: 'Jason Lo\'s Research publications.',
    heading: 'Publications',
    intro: 'My research publications, automatically aggregated and synchronized from ORCID and OpenAlex.',
  },

  tools: {
    title: 'Tools - Development Tools & Stack',
    description: 'Tools that I tried.',
    heading: 'Tools',
    intro: 'A curated collection of tools I have explored and worked with over time.',
  },

} as const;

export type PagesConfig = typeof pagesConfig;
export type PageConfig = PageMeta;
