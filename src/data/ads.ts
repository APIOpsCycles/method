import type { ImageMetadata } from 'astro';

import logo from '../assets/apiops-cycles-logo2025-blue.svg';
import person from '../assets/apiopscycles-users-2025-nobg.png';

export interface Ad {
  headline: string;
  text: string;
  ctaHref: string;
  ctaText: string;
  images?: { src: ImageMetadata; alt: string }[];
  /**
   * Optional groups that this ad should automatically appear on.
   * Examples: `"stations"`, `"lines"`, `"resources:canvas"`.
   */
  groups?: string[];
}

export const ads: Record<string, Ad> = {
  scrimba: {
    headline: 'Learn Astro with James Q Quick',
    text: 'Build your first site with 35 interactive Scrimba lessons',
    ctaHref: 'https://scrimba.com/intro-to-astro-c00ar0fi5u?via=astro',
    ctaText: 'Get 20% off',
    images: [
      { src: logo, alt: 'Scrimba' },
      { src: person, alt: '' }
    ]
  },
  community: {
    headline: 'Join the APIOps Community',
    text: 'Connect with practitioners and get the latest updates.',
    ctaHref: 'https://osaango.kit.com/dfc21aabae',
    ctaText: 'Join mailing list',
    images: [{ src: person, alt: 'APIOps users' }],
    groups: [
      'stations',
      'lines',
      'resources:canvas',
      'resources:guideline',
      'resources:tool'
    ]
  }
};

/**
 * Determine which ad (if any) should be shown for the current page.
 * Respects explicit `ad` frontmatter and falls back to group-based matching.
 */
export function selectAd(pathname: string, entry?: any): Ad | undefined {
  const adId = entry?.data?.ad as string | undefined;
  if (adId && ads[adId]) return ads[adId];

  const groups = pageGroups(pathname, entry);
  return Object.values(ads).find((ad) => ad.groups?.some((g) => groups.includes(g)));
}

function pageGroups(pathname: string, entry?: any): string[] {
  const groups: string[] = [];

  const normalized = pathname.replace(/^\/[a-z]{2}(?=\/)/, '');
  if (normalized.startsWith('/method/')) groups.push('stations');
  if (normalized.startsWith('/lines/')) groups.push('lines');
  if (normalized.startsWith('/resources/')) {
    const category = entry?.data?.category;
    if (category) groups.push(`resources:${category}`);
    groups.push('resources');
  }

  return groups;
}

