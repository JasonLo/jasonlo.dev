import { type CollectionKey, getCollection } from 'astro:content';

export async function getPublished<C extends CollectionKey>(name: C) {
  return getCollection(name, ({ data }) => data.draft !== true);
}
