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
  description: 'AI tech lead building disciplined AI systems across research and production.',

  author: {
    name: 'Jason Lo',
    title: 'AI Tech Lead',
    bio: 'Leading AI from research to production.',
    email: 'lcmjlo@gmail.com',
    location: 'Madison, WI',
  },

  social: {
    github: 'https://github.com/jasonlo',
    linkedin: 'https://linkedin.com/in/jasonlcm',
    x: 'https://x.com/JasonLoCM',
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
