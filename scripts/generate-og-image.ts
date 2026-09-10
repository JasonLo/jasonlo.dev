/**
 * Open Graph image generator
 *
 * Renders public/og-image.png (1200x630) from the site palette in
 * src/styles/global.css and the identity in src/config.ts, so the social card
 * cannot drift from the site it represents.
 *
 * The name is drawn with the brand wordmark's vector path (read from
 * src/assets/icons/brand-logo.svg), so the most prominent element carries no
 * font dependency. The smaller supporting lines are real text and therefore do
 * resolve against system fonts: the committed PNG is the artifact that ships,
 * and regenerating on a machine with a different font stack may shift those
 * lines slightly.
 *
 * Usage: bun run scripts/generate-og-image.ts
 */

import { readFile, stat } from 'node:fs/promises';
import sharp from 'sharp';
import { siteConfig } from '../src/config';

const WIDTH = 1200;
const HEIGHT = 630;
const OUTPUT = 'public/og-image.png';

// Mirrors the dark-theme tokens in src/styles/global.css.
const COLORS = {
  bg: '#201e16',
  text: '#e7e1d2',
  textMuted: '#938d78',
  accent: '#a6b475',
  border: '#3a3626',
};

const TAGLINE = 'Lean scientific inference';
const FONT_STACK = 'Inter, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif';

/** Extracts the single `d` attribute and viewBox from the brand wordmark SVG. */
async function readWordmark(): Promise<{ d: string; width: number; height: number }> {
  const svg = await readFile('src/assets/icons/brand-logo.svg', 'utf-8');
  const d = svg.match(/\sd="([^"]+)"/)?.[1];
  const viewBox = svg.match(/viewBox="([^"]+)"/)?.[1];
  if (!d || !viewBox) throw new Error('Could not parse brand-logo.svg');
  const [, , width, height] = viewBox.split(/\s+/).map(Number);
  return { d, width, height };
}

/** Escapes the five XML character entities for safe interpolation into markup. */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function buildSvg(mark: Awaited<ReturnType<typeof readWordmark>>): string {
  // Scale the wordmark to a fixed width and place it on the left margin.
  const markWidth = 480;
  const scale = markWidth / mark.width;
  const markX = 90;
  const markY = 236;

  const eyebrow = `${siteConfig.author.title} · ${siteConfig.author.location}`.toUpperCase();
  const domain = siteConfig.url.replace(/^https?:\/\//, '');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <linearGradient id="glow" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${COLORS.accent}" stop-opacity="0.10"/>
      <stop offset="60%" stop-color="${COLORS.accent}" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <rect width="${WIDTH}" height="${HEIGHT}" fill="${COLORS.bg}"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow)"/>
  <rect x="0" y="0" width="${WIDTH}" height="6" fill="${COLORS.accent}"/>

  <text x="${markX}" y="150" font-family="${FONT_STACK}" font-size="22"
        font-weight="600" letter-spacing="4" fill="${COLORS.accent}">${escapeXml(eyebrow)}</text>

  <g transform="translate(${markX} ${markY}) scale(${scale})" fill="${COLORS.text}">
    <path d="${mark.d}"/>
  </g>

  <line x1="${markX}" y1="410" x2="${markX + 120}" y2="410"
        stroke="${COLORS.accent}" stroke-width="4"/>

  <text x="${markX}" y="480" font-family="${FONT_STACK}" font-size="40"
        font-weight="500" fill="${COLORS.text}">${escapeXml(TAGLINE)}</text>

  <text x="${markX}" y="540" font-family="${FONT_STACK}" font-size="26"
        fill="${COLORS.textMuted}">${escapeXml(siteConfig.author.bio)}</text>

  <line x1="${markX}" y1="${HEIGHT - 64}" x2="${WIDTH - markX}" y2="${HEIGHT - 64}"
        stroke="${COLORS.border}" stroke-width="2"/>

  <text x="${markX}" y="${HEIGHT - 26}" font-family="${FONT_STACK}" font-size="24"
        font-weight="600" letter-spacing="1" fill="${COLORS.textMuted}">${escapeXml(domain)}</text>
</svg>`;
}

async function main() {
  const mark = await readWordmark();
  const svg = buildSvg(mark);
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(OUTPUT);
  const { size } = await stat(OUTPUT);
  console.log(`Wrote ${OUTPUT} (${WIDTH}x${HEIGHT}, ${Math.round(size / 1024)} KB)`);
}

await main();
