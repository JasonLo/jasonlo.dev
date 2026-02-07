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

/**
 * Page metadata interface
 */
interface PageMeta {
  /** Page title (used in browser tab and SEO) */
  title: string;
  
  /** Page description (used in meta tags and SEO) */
  description: string;
  
  /** Page heading (displayed as h1, optional - defaults to title) */
  heading?: string;
  
  /** Page intro text (displayed below heading, optional) */
  intro?: string;
}

/**
 * Pages configuration object
 * 
 * Contains metadata for all static pages. Dynamic pages (like individual
 * project or article pages) generate their own metadata from content.
 */
export const pagesConfig = {
  /**
   * Home page (/)
   * Note: Home page uses siteConfig for title/description as it represents the site itself
   */
  home: {
    title: 'Home',
    description: 'Engineering leader specializing in system architecture, technical decision-making, and delivering measurable business impact.',
  },
  
  /**
   * Projects listing page (/projects)
   */
  projects: {
    title: 'Projects - Case Studies',
    description: 'Detailed case studies showcasing problem-solving approach, technical decisions, and measurable impact across various engineering projects.',
    heading: 'Projects',
    intro: 'Case studies that demonstrate how I approach complex problems, make technical decisions, and deliver measurable impact. Each project tells the story of the challenge, the constraints, the decisions made, and the outcomes achieved.',
  },
  
  /**
   * Journey timeline page (/journey)
   */
  journey: {
    title: 'Journey - Career Growth & Learning Timeline',
    description: 'A chronological timeline of my professional journey, highlighting key milestones, learning moments, and career transitions that shaped my growth as an engineer.',
    heading: 'Journey',
    intro: 'A timeline of my professional growth and learning progression. This isn\'t a resume—it\'s a story of how I\'ve evolved as an engineer, the pivotal moments that shaped my thinking, and the skills I\'ve developed along the way.',
  },
  
  /**
   * Publications listing page (/publications)
   */
  publications: {
    title: 'Publications - Technical Articles & Insights',
    description: 'Technical articles, insights, and lessons learned from building software systems and solving engineering challenges.',
    heading: 'Publications',
    intro: 'Technical articles, insights, and lessons learned from building software systems. I write about architecture decisions, engineering practices, and the challenges of delivering reliable software at scale.',
  },

  /**
   * Uses/tools page (/uses)
   */
  uses: {
    title: 'Uses - Tools, Stack & Environment',
    description: 'A comprehensive list of the tools, technologies, and environment I use for development work.',
    heading: 'Uses',
    intro: 'A transparent look at the tools, technologies, and environment that power my development workflow. This page documents what I use and why, helping other engineers discover useful tools and understand my technical context.',
  },
  
} as const;

/**
 * Type export for the pages configuration
 */
export type PagesConfig = typeof pagesConfig;

/**
 * Type export for a single page metadata
 */
export type PageConfig = PageMeta;
