/**
 * Site Configuration
 *
 * Centralized configuration for the entire site.
 * All values are defined here — no environment variables needed for the site build.
 *
 * @module config
 */

export const siteConfig = {
  url: 'https://jasonlo.dev',
  language: 'en',
  title: 'Jason Lo Portfolio',
  description: 'Data scientist specializing in AI-driven interdisciplinary research and engineering solutions.',

  author: {
    name: 'Jason Lo',
    title: 'Data Scientist',
    bio: 'Bringing AI to interdisciplinary research.',
    email: 'lcmjlo@gmail.com',
    location: 'Madison, WI',
  },

  social: {
    github: 'https://github.com/jasonlo',
    linkedin: 'https://linkedin.com/in/jasonlcm',
    twitter: '',
    mastodon: '',
    bluesky: '',
    scholar: 'https://scholar.google.com/citations?hl=en&user=84y-HKEAAAAJ',
    orcid: 'https://orcid.org/0000-0002-8428-1086',
  },

  apis: {
    openalex: 'https://api.openalex.org/a5021047469',
  },

  nav: [
    { label: 'Journey', href: '/journey' },
    { label: 'Projects', href: '/projects' },
    { label: 'Publications', href: '/publications' },
    { label: 'Tools', href: '/tools' },
    { label: 'Blog', href: '/blog' },
  ],
};

export type SiteConfig = typeof siteConfig;
export type SocialLinks = typeof siteConfig.social;
export type NavItem = typeof siteConfig.nav[number];
