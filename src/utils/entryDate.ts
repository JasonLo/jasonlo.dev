import type { CollectionEntry } from 'astro:content';

type DatedEntry =
  | CollectionEntry<'projects'>
  | CollectionEntry<'publications'>
  | CollectionEntry<'journey'>
  | CollectionEntry<'tools'>
  | CollectionEntry<'blog'>;

export function getEntryDate(entry: DatedEntry): Date {
  if (entry.data.updatedDate) return entry.data.updatedDate;
  switch (entry.collection) {
    case 'projects':
      return new Date(entry.data.year, 0, 1);
    case 'publications':
    case 'blog':
      return entry.data.publishDate;
    case 'journey':
    case 'tools':
      return entry.data.date;
  }
}
