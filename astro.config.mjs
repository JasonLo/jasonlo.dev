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
      // Dual themes so code blocks can follow the site's theme toggle.
      themes: {
        light: 'github-light',
        dark: 'github-dark'
      },
      // `false` = emit only `--shiki-light` / `--shiki-dark` custom properties,
      // with no inline `color:` fallback. The site's `[data-theme]` rules in
      // src/styles/global.css resolve those variables, since Shiki's default
      // dual-theme output keys off `prefers-color-scheme` and would desync
      // from the explicit toggle.
      defaultColor: false,
      wrap: true
    }
  },
  experimental: {
    contentIntellisense: true,
  },
});
