import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { siteConfig } from './src/config.ts';

export default defineConfig({
  site: siteConfig.url,
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/s/'),
    }),
  ],
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: {
        limitInputPixels: 33177600,
      }
    },
  },
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true
    }
  },
  experimental: {
    contentIntellisense: true,
  },
});
