import type { APIRoute } from 'astro';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const WIDTH = 1200;
const HEIGHT = 630;
const CACHE_CONTROL = 'public, max-age=3600, s-maxage=86400';
const DEFAULT_TITLE = 'APIOps Cycles Method';
const VALID_TYPES = new Set(['home', 'method', 'station', 'line', 'resource']);
const ALLOWED_IMAGE_PREFIXES = ['/social/', '/partners/'];
const PUBLIC_DIR = path.resolve('public');

const sanitizeUtf8 = (value: string): string => {
  const normalized = value.toWellFormed().normalize('NFC');
  const cleaned = normalized.replace(/[\u0000-\u001F\u007F]/g, '');
  return new TextDecoder('utf-8', { fatal: false }).decode(new TextEncoder().encode(cleaned));
};

const sanitizeTitle = (rawTitle: string | null): string => {
  if (!rawTitle) {
    return DEFAULT_TITLE;
  }

  const trimmed = sanitizeUtf8(rawTitle).trim();
  const compacted = trimmed.replace(/\s+/g, ' ');
  return compacted.slice(0, 140) || DEFAULT_TITLE;
};

const sanitizeType = (rawType: string | null): string => {
  if (!rawType) {
    return 'method';
  }

  const cleaned = sanitizeUtf8(rawType).trim().toLowerCase();
  return VALID_TYPES.has(cleaned) ? cleaned : 'method';
};

const sanitizeSlug = (rawSlug: string | null): string => {
  if (!rawSlug) {
    return '';
  }

  return sanitizeUtf8(rawSlug).trim().toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 80);
};

const safeImagePath = (rawImage: string | null): string | null => {
  if (!rawImage) {
    return null;
  }

  const cleaned = sanitizeUtf8(rawImage).trim();

  if (!cleaned.startsWith('/')) {
    return null;
  }

  if (!ALLOWED_IMAGE_PREFIXES.some((prefix) => cleaned.startsWith(prefix))) {
    return null;
  }

  if (!/\.(png|jpe?g|webp|svg)$/i.test(cleaned)) {
    return null;
  }

  const resolved = path.resolve(PUBLIC_DIR, `.${cleaned}`);
  if (!resolved.startsWith(PUBLIC_DIR)) {
    return null;
  }

  return resolved;
};

const wrapText = (value: string, maxLineLength = 32, maxLines = 3): string[] => {
  const words = value.split(' ');
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxLineLength) {
      current = candidate;
      continue;
    }

    if (current) {
      lines.push(current);
      current = word;
    } else {
      lines.push(word.slice(0, maxLineLength));
      current = word.slice(maxLineLength);
    }

    if (lines.length >= maxLines) {
      break;
    }
  }

  if (lines.length < maxLines && current) {
    lines.push(current);
  }

  if (lines.length > maxLines) {
    return lines.slice(0, maxLines);
  }

  if (lines.length === maxLines && words.join(' ').length > lines.join(' ').length) {
    lines[maxLines - 1] = `${lines[maxLines - 1].slice(0, Math.max(0, maxLineLength - 1)).trimEnd()}…`;
  }

  return lines;
};

const escapeXml = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

const createOverlaySvg = (title: string, type: string, slug: string): Buffer => {
  const lines = wrapText(title);
  const typeLabel = type.toUpperCase();
  const slugLabel = slug ? `/${slug}` : '';

  const textLines = lines
    .map((line, index) => {
      const y = 264 + index * 84;
      return `<text x="72" y="${y}" fill="#ffffff" font-size="68" font-weight="700" font-family="Inter, Arial, sans-serif">${escapeXml(line)}</text>`;
    })
    .join('');

  const svg = `
    <svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="overlay" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#0b1020" stop-opacity="0.2"/>
          <stop offset="100%" stop-color="#0b1020" stop-opacity="0.82"/>
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="${WIDTH}" height="${HEIGHT}" fill="url(#overlay)" />
      <rect x="72" y="66" width="220" height="50" rx="25" fill="#7150b0" />
      <text x="182" y="99" fill="#ffffff" font-size="28" font-weight="700" text-anchor="middle" font-family="Inter, Arial, sans-serif">${escapeXml(typeLabel)}</text>
      ${textLines}
      <text x="72" y="584" fill="#d5d7dc" font-size="30" font-weight="500" font-family="Inter, Arial, sans-serif">apiopscycles.com${escapeXml(slugLabel)}</text>
    </svg>
  `;

  return Buffer.from(svg);
};

const fallbackResponse = async (logoImage: Buffer): Promise<Response> => {
  const fallbackOverlay = createOverlaySvg(DEFAULT_TITLE, 'method', '');
  const background = await readFile(path.join(PUBLIC_DIR, 'metro-bg.jpg'));

  const png = await sharp(background)
    .resize(WIDTH, HEIGHT, { fit: 'cover' })
    .composite([
      { input: logoImage, top: 54, left: 928 },
      { input: fallbackOverlay, top: 0, left: 0 },
    ])
    .png()
    .toBuffer();

  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': CACHE_CONTROL,
    },
  });
};

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const logoSvg = await readFile(path.resolve('src/assets/apiops-cycles-logo2025-blue.svg'));
  const logoImage = await sharp(logoSvg).resize(220, 220, { fit: 'inside' }).png().toBuffer();

  try {
    const { searchParams } = new URL(request.url);
    const title = sanitizeTitle(searchParams.get('title'));
    const type = sanitizeType(searchParams.get('type'));
    const slug = sanitizeSlug(searchParams.get('slug'));
    const imagePath = safeImagePath(searchParams.get('image'));

    const backgroundImage = imagePath
      ? await readFile(imagePath)
      : await readFile(path.join(PUBLIC_DIR, 'metro-bg.jpg'));

    const overlay = createOverlaySvg(title, type, slug);

    const png = await sharp(backgroundImage)
      .resize(WIDTH, HEIGHT, { fit: 'cover' })
      .composite([
        { input: logoImage, top: 54, left: 928},
        { input: overlay, top: 0, left: 0 },
      ])
      .png()
      .toBuffer();

    return new Response(new Uint8Array(png), {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': CACHE_CONTROL,
      },
    });
  } catch {
    return fallbackResponse(logoImage);
  }
};
