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
   * Optional folder groups that this ad should automatically appear on.
   * Examples: `"getting-started"`, `"de/getting-started"`.
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
    ],
    groups: ['getting-started']
  },
  community: {
    headline: 'Join the APIOps Community',
    text: 'Connect with practitioners and get the latest updates.',
    ctaHref: 'https://osaango.kit.com/dfc21aabae',
    ctaText: 'Join mailing list',
    images: [{ src: person, alt: 'APIOps users' }],
    groups: ['de/getting-started']
  }
};

/**
 * Determine which ad (if any) should be shown for the current page based on
 * the directory groups the page belongs to.
 */
export function selectAd(entry?: any): Ad | undefined {
  const groups = entryGroups(entry);
  let best: { ad: Ad; score: number } | undefined;
  for (const ad of Object.values(ads)) {
    if (!ad.groups) continue;
    for (const tag of ad.groups) {
      if (groups.includes(tag)) {
        const score = tag.split('/').length;
        if (!best || score > best.score) {
          best = { ad, score };
        }
      }
    }
  }
  return best?.ad;
}

function entryGroups(entry?: any): string[] {
  const id = entry?.id as string | undefined;
  if (!id) return [];

  const parts = id.split('/');
  parts.pop(); // remove filename
  const set = new Set<string>();

  for (let i = 0; i < parts.length; i++) {
    set.add(parts[i]);
    set.add(parts.slice(0, i + 1).join('/'));
  }

  return Array.from(set);
}

