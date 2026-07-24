/**
 * RSS Feed API Route
 *
 * Generates a single combined RSS 2.0 feed covering every content collection
 * (journey, projects, publications, tools, blog), newest first.
 *
 * Features:
 * - Reuses `getPublished()` so drafts never reach the feed
 * - Reuses `getEntryDate()` for the same date precedence as the on-site feed
 * - Mirrors the item shape of `UpdatesFeed.astro` (same title / description /
 *   link field choices per collection)
 * - Title and description only, never the rendered post body
 * - Absolute `<link>` values, so no resolution against `site` is needed
 * - Explicit, collection-namespaced, non-permalink `<guid>` per item
 * - Normalizes site URL (removes trailing slash)
 *
 * Route: /rss.xml
 *
 * Why explicit GUIDs: `@astrojs/rss` defaults `<guid>` to the item link, which
 * is not unique here. Journey and tools items are same-page anchors and many
 * publications point at off-site DOIs. Each GUID is therefore derived only from
 * the collection name plus the entry id, so it is unique across the feed and
 * stable forever, even if the item is later re-linked or re-dated.
 *
 * Why `customData`: `RSSFeedItem` has no `guid` field. The library merges
 * `customData` over the generated item, so a `<guid>` supplied there replaces
 * the link-derived default rather than duplicating it.
 *
 * Why every item has a valid `pubDate`: `getEntryDate()` is total over these
 * five collections. It returns `updatedDate` when present, and otherwise falls
 * back to a field that each collection's Zod schema marks required (`year` for
 * projects, `publishDate` for publications and blog, `date` for journey and
 * tools). No branch can yield `undefined`.
 */

import rss, { type RSSFeedItem } from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { siteConfig } from '../config';
import { getPublished } from '../utils/collections';
import { getEntryDate } from '../utils/entryDate';

/** Feed item with the `pubDate` guaranteed present, so it can be sorted on. */
type FeedItem = RSSFeedItem & { pubDate: Date };

/**
 * Normalized site URL without a trailing slash.
 *
 * Matches the normalization used in `robots.txt.ts` and `llms.txt.ts` so that
 * concatenating `/some/path` never produces a double slash.
 */
const siteUrl = siteConfig.url.endsWith('/')
  ? siteConfig.url.slice(0, -1)
  : siteConfig.url;

/** Escapes the five XML character entities for safe interpolation into `customData`. */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Builds the `customData` string carrying a stable, unique `<guid>` for an item.
 *
 * The GUID is a URN-style URL that is never navigated to, hence
 * `isPermaLink="false"`. It depends only on the collection and the entry id.
 *
 * @param collection Collection name, used to namespace ids across collections
 * @param id Content entry id (the MDX file slug)
 */
function guidData(collection: string, id: string): string {
  return `<guid isPermaLink="false">${escapeXml(`${siteUrl}/rss/${collection}/${id}`)}</guid>`;
}

/**
 * GET handler for /rss.xml
 *
 * Loads every published entry, flattens the collections into a common feed
 * item shape, and sorts the result by date descending.
 *
 * @returns Response with the RSS XML body
 */
export const GET: APIRoute = async () => {
  const [journey, projects, publications, tools, blog] = await Promise.all([
    getPublished('journey'),
    getPublished('projects'),
    getPublished('publications'),
    getPublished('tools'),
    getPublished('blog'),
  ]);

  const items: FeedItem[] = [
    ...journey.map((entry): FeedItem => ({
      title: entry.data.title,
      description: entry.data.description,
      pubDate: getEntryDate(entry),
      link: `${siteUrl}/journey/#${entry.id}`,
      categories: ['journey'],
      customData: guidData('journey', entry.id),
    })),
    ...projects.map((entry): FeedItem => ({
      title: entry.data.title,
      description: entry.data.outcomeSummary,
      pubDate: getEntryDate(entry),
      link: `${siteUrl}/projects/${entry.id}/`,
      categories: ['project'],
      customData: guidData('projects', entry.id),
    })),
    ...publications.map((entry): FeedItem => ({
      title: entry.data.title,
      description: entry.data.journal,
      pubDate: getEntryDate(entry),
      // DOIs are already absolute and are passed through untouched. Without one,
      // link to the on-site listing rather than an unusable placeholder anchor.
      link: entry.data.doi ?? `${siteUrl}/publications/`,
      categories: ['publication'],
      customData: guidData('publications', entry.id),
    })),
    ...tools.map((entry): FeedItem => ({
      title: entry.data.name,
      description: entry.data.description,
      pubDate: getEntryDate(entry),
      link: `${siteUrl}/tools/#${entry.id}`,
      categories: ['tool'],
      customData: guidData('tools', entry.id),
    })),
    ...blog.map((entry): FeedItem => ({
      title: entry.data.title,
      description: entry.data.description,
      pubDate: getEntryDate(entry),
      link: `${siteUrl}/blog/${entry.id}/`,
      categories: ['blog'],
      customData: guidData('blog', entry.id),
    })),
  ].sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

  return rss({
    title: siteConfig.title,
    description: siteConfig.description,
    site: siteUrl,
    xmlns: {
      atom: 'http://www.w3.org/2005/Atom',
    },
    customData: [
      `<language>${siteConfig.language}</language>`,
      `<atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>`,
    ].join(''),
    items,
  });
};
