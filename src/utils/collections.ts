import { getCollection, type CollectionKey } from 'astro:content';

export async function getPublished<C extends CollectionKey>(name: C) {
  return getCollection(name, ({ data }) => data.draft !== true);
}
