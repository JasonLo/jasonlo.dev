/**
 * Sync publications from OpenAlex API
 *
 * Fetches all works for the configured author from OpenAlex,
 * generates MDX files, and updates citation counts for existing ones.
 *
 * Usage: bun run scripts/sync-publications.ts
 */

const AUTHOR_ID = "a5021047469";
const API_KEY = process.env.OPENALEX_API_KEY;
// The mailto is still recommended even with an API key for identification
const API_URL = `https://api.openalex.org/works?filter=authorships.author.id:${AUTHOR_ID}&sort=cited_by_count:desc&per_page=200&api_key=${API_KEY}`;
const OUTPUT_DIR = "src/content/publications";

interface OpenAlexWork {
  id: string;
  title: string;
  publication_date: string;
  doi: string | null;
  cited_by_count: number;
  primary_location: {
    source: { display_name: string } | null;
  } | null;
  authorships: Array<{
    author: { display_name: string };
  }>;
  open_access: {
    oa_url: string | null;
  };
  topics: Array<{
    display_name: string;
  }>;
}

interface OpenAlexResponse {
  results: OpenAlexWork[];
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80)
    .replace(/-$/, "");
}

function escapeYaml(str: string): string {
  if (str.includes('"') || str.includes(":") || str.includes("#")) {
    return `"${str.replace(/"/g, '\\"')}"`;
  }
  return `"${str}"`;
}

function generateMdx(work: OpenAlexWork): string {
  const title = work.title;
  const authors = work.authorships.map((a) => a.author.display_name);
  const journal =
    work.primary_location?.source?.display_name || "Unknown Journal";
  const publishDate = work.publication_date;
  const doi = work.doi ? `https://doi.org/${work.doi.replace("https://doi.org/", "")}` : null;
  const oaUrl = work.open_access.oa_url;
  const citedByCount = work.cited_by_count;

  const tags = work.topics
    .slice(0, 3)
    .map((t) => t.display_name.toLowerCase());

  let frontmatter = `---\n`;
  frontmatter += `title: ${escapeYaml(title)}\n`;
  frontmatter += `description: ${escapeYaml(title)}\n`;
  frontmatter += `authors:\n`;
  for (const author of authors) {
    frontmatter += `  - ${escapeYaml(author)}\n`;
  }
  frontmatter += `journal: ${escapeYaml(journal)}\n`;
  frontmatter += `publishDate: ${publishDate}\n`;
  if (doi) {
    frontmatter += `doi: ${escapeYaml(doi)}\n`;
  }
  if (oaUrl) {
    frontmatter += `oaUrl: ${escapeYaml(oaUrl)}\n`;
  }
  frontmatter += `citedByCount: ${citedByCount}\n`;
  if (tags.length > 0) {
    frontmatter += `tags:\n`;
    for (const tag of tags) {
      frontmatter += `  - ${escapeYaml(tag)}\n`;
    }
  }
  frontmatter += `draft: false\n`;
  frontmatter += `---\n`;

  return frontmatter;
}

async function main() {
  console.log("Fetching publications from OpenAlex...");

  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error(`OpenAlex API error: ${response.status} ${response.statusText}`);
  }

  const data: OpenAlexResponse = await response.json();
  const works = data.results;

  console.log(`Found ${works.length} publications`);

  const { readdir, readFile, writeFile, mkdir, unlink } = await import("fs/promises");
  const { join } = await import("path");

  await mkdir(OUTPUT_DIR, { recursive: true });

  const existingFiles = new Set(await readdir(OUTPUT_DIR));
  let created = 0;
  let updated = 0;
  let unchanged = 0;

  for (const work of works) {
    if (!work.title || !work.publication_date) continue;

    const slug = slugify(work.title);
    const filename = `${slug}.mdx`;
    const filepath = join(OUTPUT_DIR, filename);
    const content = generateMdx(work);

    if (existingFiles.has(filename)) {
      const existing = await readFile(filepath, "utf-8");
      if (existing !== content) {
        await writeFile(filepath, content);
        updated++;
        console.log(`  Updated: ${filename}`);
      } else {
        unchanged++;
      }
      existingFiles.delete(filename);
    } else {
      await writeFile(filepath, content);
      created++;
      console.log(`  Created: ${filename}`);
    }
  }

  for (const orphan of existingFiles) {
    if (orphan.endsWith(".mdx")) {
      await unlink(join(OUTPUT_DIR, orphan));
      console.log(`  Removed: ${orphan}`);
    }
  }

  console.log(
    `\nDone: ${created} created, ${updated} updated, ${unchanged} unchanged, ${existingFiles.size} removed`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
