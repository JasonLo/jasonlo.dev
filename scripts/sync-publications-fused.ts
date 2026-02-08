/**
 * Fused publication sync: ORCID + OpenAlex
 *
 * Fetches journal articles from both ORCID (public, no auth) and OpenAlex
 * (optional API key), deduplicates by DOI / title slug, merges the best
 * fields from each source, and writes MDX files to src/content/publications/.
 *
 * - ORCID is the primary source (always available, no auth needed)
 * - OpenAlex enriches with citation counts, tags, and better metadata
 * - If OPENALEX_API_KEY is missing or the API errors, continues with ORCID only
 *
 * Usage: bun run scripts/sync-publications-fused.ts
 */

import { readdir, readFile, writeFile, mkdir, unlink } from "fs/promises";
import { join } from "path";

// ── Config ──────────────────────────────────────────────────────

const ORCID_ID = "0000-0002-8428-1086";
const OPENALEX_AUTHOR_ID = "a5021047469";
const OPENALEX_API_KEY = process.env.OPENALEX_API_KEY;
const OUTPUT_DIR = "src/content/publications";
const BATCH_SIZE = 50;

// ── Types ───────────────────────────────────────────────────────

interface Publication {
  title: string;
  authors: string[];
  journal: string;
  publishDate: string; // YYYY-MM-DD
  doi: string | null;
  oaUrl: string | null;
  citedByCount: number;
  tags: string[];
  source: "openalex" | "orcid";
}

interface OrcidWorkSummary {
  "put-code": number;
  title: { title: { value: string } };
  type: string;
  "journal-title": { value: string } | null;
  "publication-date": {
    year: { value: string } | null;
    month: { value: string } | null;
    day: { value: string } | null;
  } | null;
  "external-ids": {
    "external-id": Array<{
      "external-id-type": string;
      "external-id-value": string;
      "external-id-relationship": string;
    }>;
  };
}

interface OrcidWorksResponse {
  group: Array<{
    "external-ids": {
      "external-id": Array<{
        "external-id-type": string;
        "external-id-value": string;
      }>;
    };
    "work-summary": OrcidWorkSummary[];
  }>;
}

interface OrcidWork {
  "put-code": number;
  title: { title: { value: string }; subtitle: { value: string } | null };
  "journal-title": { value: string } | null;
  type: string;
  "publication-date": {
    year: { value: string } | null;
    month: { value: string } | null;
    day: { value: string } | null;
  } | null;
  "external-ids": {
    "external-id": Array<{
      "external-id-type": string;
      "external-id-value": string;
      "external-id-relationship": string;
    }>;
  };
  contributors: {
    contributor: Array<{ "credit-name": { value: string } | null }>;
  } | null;
  citation: { "citation-type": string; "citation-value": string } | null;
  url: { value: string } | null;
}

interface OrcidBulkResponse {
  bulk: Array<{ work: OrcidWork } | { error: unknown }>;
}

interface OpenAlexWork {
  id: string;
  title: string;
  publication_date: string;
  doi: string | null;
  cited_by_count: number;
  primary_location: { source: { display_name: string } | null } | null;
  authorships: Array<{ author: { display_name: string } }>;
  open_access: { oa_url: string | null };
  topics: Array<{ display_name: string }>;
}

interface OpenAlexResponse {
  results: OpenAlexWork[];
}

// ── Helpers ─────────────────────────────────────────────────────

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
  if (/[":# ]/.test(str)) {
    return `"${str.replace(/"/g, '\\"')}"`;
  }
  return `"${str}"`;
}

function normalizeDoi(doi: string): string {
  return doi.toLowerCase().replace(/^https?:\/\/doi\.org\//i, "").trim();
}

function formatDoiUrl(doi: string): string {
  return `https://doi.org/${doi.replace(/^https?:\/\/doi\.org\//i, "")}`;
}

function isDoiUrl(url: string): boolean {
  return /^https?:\/\/(dx\.)?doi\.org\//i.test(url);
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}

// ── ORCID ───────────────────────────────────────────────────────

function parseOrcidDate(pd: OrcidWork["publication-date"]): string | null {
  if (!pd?.year?.value) return null;
  const m = pd.month?.value?.padStart(2, "0") ?? "01";
  const d = pd.day?.value?.padStart(2, "0") ?? "01";
  return `${pd.year.value}-${m}-${d}`;
}

function parseOrcidDoi(ids: OrcidWork["external-ids"]): string | null {
  const doi = ids["external-id"].find(
    (e) => e["external-id-type"] === "doi" && e["external-id-relationship"] === "self"
  );
  return doi ? formatDoiUrl(doi["external-id-value"]) : null;
}

function parseOrcidAuthors(work: OrcidWork): string[] {
  const fromContributors = work.contributors?.contributor
    ?.map((c) => c["credit-name"]?.value)
    .filter((n): n is string => !!n) ?? [];
  if (fromContributors.length > 0) return fromContributors;

  if (work.citation?.["citation-type"] === "bibtex") {
    const match = work.citation["citation-value"].match(/author\s*=\s*\{([^}]+)\}/i);
    if (match) return match[1].split(/\s+and\s+/).map((a) => a.trim());
  }
  return [];
}

function orcidToPublication(work: OrcidWork): Publication | null {
  const title = work.title?.title?.value;
  const publishDate = parseOrcidDate(work["publication-date"]);
  if (!title || !publishDate) return null;

  const rawUrl = work.url?.value ?? null;

  return {
    title,
    authors: parseOrcidAuthors(work),
    journal: work["journal-title"]?.value ?? work.title?.subtitle?.value ?? "Unknown Journal",
    publishDate,
    doi: parseOrcidDoi(work["external-ids"]),
    oaUrl: rawUrl && !isDoiUrl(rawUrl) ? rawUrl : null,
    citedByCount: 0,
    tags: [],
    source: "orcid",
  };
}

async function fetchOrcid(): Promise<Publication[]> {
  const base = `https://pub.orcid.org/v3.0/${ORCID_ID}`;
  console.log(`Fetching works from ORCID (${ORCID_ID})...`);

  const { group } = await fetchJson<OrcidWorksResponse>(`${base}/works`);
  const articles = group.filter((g) => g["work-summary"][0].type === "journal-article");
  console.log(`  Found ${group.length} work groups, ${articles.length} journal articles`);

  const putCodes = articles.map((g) => g["work-summary"][0]["put-code"]);
  if (putCodes.length === 0) return [];

  const works: OrcidWork[] = [];
  for (let i = 0; i < putCodes.length; i += BATCH_SIZE) {
    const batch = putCodes.slice(i, i + BATCH_SIZE);
    const bulk = await fetchJson<OrcidBulkResponse>(`${base}/works/${batch.join(",")}`);
    for (const entry of bulk.bulk) {
      if ("work" in entry && entry.work) works.push(entry.work);
    }
  }

  const pubs = works.map(orcidToPublication).filter((p): p is Publication => p !== null);
  console.log(`  ${pubs.length} valid publications`);
  return pubs;
}

// ── OpenAlex ────────────────────────────────────────────────────

function openAlexToPublication(work: OpenAlexWork): Publication | null {
  if (!work.title || !work.publication_date) return null;

  const rawOaUrl = work.open_access.oa_url;

  return {
    title: work.title,
    authors: work.authorships.map((a) => a.author.display_name),
    journal: work.primary_location?.source?.display_name || "Unknown Journal",
    publishDate: work.publication_date,
    doi: work.doi ? formatDoiUrl(work.doi) : null,
    oaUrl: rawOaUrl && !isDoiUrl(rawOaUrl) ? rawOaUrl : null,
    citedByCount: work.cited_by_count,
    tags: work.topics.slice(0, 3).map((t) => t.display_name.toLowerCase()),
    source: "openalex",
  };
}

async function fetchOpenAlex(): Promise<Publication[]> {
  if (!OPENALEX_API_KEY) {
    console.log("No OPENALEX_API_KEY — skipping OpenAlex.");
    return [];
  }

  console.log("Fetching publications from OpenAlex...");
  try {
    const url = `https://api.openalex.org/works?filter=authorships.author.id:${OPENALEX_AUTHOR_ID},type:article&sort=cited_by_count:desc&per_page=200&api_key=${OPENALEX_API_KEY}`;
    const { results } = await fetchJson<OpenAlexResponse>(url);
    const pubs = results.map(openAlexToPublication).filter((p): p is Publication => p !== null);
    console.log(`  ${pubs.length} valid publications`);
    return pubs;
  } catch (err) {
    console.warn(`  OpenAlex failed: ${err} — continuing with ORCID only`);
    return [];
  }
}

// ── Deduplication & merge ───────────────────────────────────────

function mergePair(orcid: Publication | undefined, openalex: Publication | undefined): Publication {
  if (!orcid) return openalex!;
  if (!openalex) return orcid;

  // Prefer the more specific date (not defaulting to Jan 1)
  let publishDate = openalex.publishDate;
  if (openalex.publishDate.endsWith("-01-01") && !orcid.publishDate.endsWith("-01-01")) {
    publishDate = orcid.publishDate;
  }

  return {
    title: openalex.title,
    authors: openalex.authors.length >= orcid.authors.length ? openalex.authors : orcid.authors,
    journal: openalex.journal !== "Unknown Journal" ? openalex.journal : orcid.journal,
    publishDate,
    doi: openalex.doi ?? orcid.doi,
    oaUrl: openalex.oaUrl ?? orcid.oaUrl,
    citedByCount: openalex.citedByCount,
    tags: openalex.tags.length > 0 ? openalex.tags : orcid.tags,
    source: "openalex",
  };
}

type SourcePair = { orcid?: Publication; openalex?: Publication };

function dedupeAndMerge(orcidPubs: Publication[], openAlexPubs: Publication[]): Publication[] {
  const byDoi = new Map<string, SourcePair>();
  const bySlug = new Map<string, SourcePair>();

  for (const pub of [...orcidPubs, ...openAlexPubs]) {
    const slug = slugify(pub.title);
    if (pub.doi) {
      const key = normalizeDoi(pub.doi);
      const entry = byDoi.get(key) ?? {};
      entry[pub.source] = pub;
      byDoi.set(key, entry);
    }
    const entry = bySlug.get(slug) ?? {};
    entry[pub.source] = pub;
    bySlug.set(slug, entry);
  }

  const seen = new Set<string>();
  const result: Publication[] = [];

  // DOI matches first
  for (const [doi, pair] of byDoi) {
    const merged = mergePair(pair.orcid, pair.openalex);
    seen.add(slugify(merged.title));
    seen.add(doi);
    if (pair.orcid) seen.add(slugify(pair.orcid.title));
    if (pair.openalex) seen.add(slugify(pair.openalex.title));
    result.push(merged);
  }

  // Slug-only fallback
  for (const [slug, pair] of bySlug) {
    if (seen.has(slug)) continue;
    const doi = pair.orcid?.doi ?? pair.openalex?.doi;
    if (doi && seen.has(normalizeDoi(doi))) continue;
    seen.add(slug);
    result.push(mergePair(pair.orcid, pair.openalex));
  }

  return result;
}

// ── MDX generation ──────────────────────────────────────────────

function toMdx(pub: Publication): string {
  const lines = [
    "---",
    `title: ${escapeYaml(pub.title)}`,
    `description: ${escapeYaml(pub.title)}`,
    "authors:",
    ...(pub.authors.length > 0
      ? pub.authors.map((a) => `  - ${escapeYaml(a)}`)
      : ['  - "Unknown"']),
    `journal: ${escapeYaml(pub.journal)}`,
    `publishDate: ${pub.publishDate}`,
  ];

  if (pub.doi) lines.push(`doi: ${escapeYaml(pub.doi)}`);
  if (pub.oaUrl) lines.push(`oaUrl: ${escapeYaml(pub.oaUrl)}`);
  lines.push(`citedByCount: ${pub.citedByCount}`);
  if (pub.tags.length > 0) {
    lines.push("tags:", ...pub.tags.map((t) => `  - ${escapeYaml(t)}`));
  }
  lines.push("draft: false", "---", "");

  return lines.join("\n");
}

// ── Write files ─────────────────────────────────────────────────

async function writeMdxFiles(pubs: Publication[]) {
  await mkdir(OUTPUT_DIR, { recursive: true });
  const existing = new Set(await readdir(OUTPUT_DIR));
  let created = 0, updated = 0, unchanged = 0, removed = 0;

  for (const pub of pubs) {
    const filename = `${slugify(pub.title)}.mdx`;
    const filepath = join(OUTPUT_DIR, filename);
    const content = toMdx(pub);

    if (existing.has(filename)) {
      const prev = await readFile(filepath, "utf-8");
      if (prev !== content) {
        await writeFile(filepath, content);
        updated++;
        console.log(`  Updated: ${filename}`);
      } else {
        unchanged++;
      }
      existing.delete(filename);
    } else {
      await writeFile(filepath, content);
      created++;
      console.log(`  Created: ${filename}`);
    }
  }

  for (const orphan of existing) {
    if (!orphan.endsWith(".mdx")) continue;
    await unlink(join(OUTPUT_DIR, orphan));
    removed++;
    console.log(`  Removed: ${orphan}`);
  }

  console.log(`\nDone: ${created} created, ${updated} updated, ${unchanged} unchanged, ${removed} removed`);
}

// ── Main ────────────────────────────────────────────────────────

async function main() {
  const [orcidPubs, openAlexPubs] = await Promise.all([fetchOrcid(), fetchOpenAlex()]);
  console.log(`\nMerging: ${orcidPubs.length} ORCID + ${openAlexPubs.length} OpenAlex`);

  const merged = dedupeAndMerge(orcidPubs, openAlexPubs);
  console.log(`Result: ${merged.length} unique publications\n`);

  await writeMdxFiles(merged);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
