export type JourneyIntentTag = 'new-api' | 'major-redesign' | 'governance' | 'platform-scale';

export type JourneyIntentMapping = Record<JourneyIntentTag, Record<string, number>>;

export const journeyIntentMappings: JourneyIntentMapping = {
  'new-api': {
    'api-product-strategy': 100,
    'api-consumer-experience': 85,
    'api-design': 80,
    'api-platform-architecture': 75,
    'api-delivery': 60,
  },
  'major-redesign': {
    'api-audit': 95,
    'api-design': 90,
    'api-consumer-experience': 80,
    'api-delivery': 70,
    'monitoring-and-improving': 60,
  },
  governance: {
    'legal-and-compliance': 100,
    'security-and-privacy': 95,
    'service-agreements': 85,
    'operating-guidelines': 80,
    'portfolio-management': 75,
  },
  'platform-scale': {
    'api-platform-architecture': 100,
    'scalable-infrastructure': 95,
    'ci-cd': 85,
    development: 75,
    'release-management': 70,
  },
};

interface StationState {
  status?: string;
}

interface RankInput {
  stationIdsInOrder: string[];
  stationStateById: Record<string, StationState>;
  selectedIntents: JourneyIntentTag[];
}

export interface RankedStation {
  stationId: string;
  score: number;
  intentScore: number;
  readinessScore: number;
  positionScore: number;
}

function getReadinessScore(status?: string): number {
  if (status === 'ready') return 100;
  if (status === 'completed') return 40;
  return 0;
}

export function rankStationsForJourneyIntent({
  stationIdsInOrder,
  stationStateById,
  selectedIntents,
}: RankInput): RankedStation[] {
  const hasIntentSelection = selectedIntents.length > 0;

  return stationIdsInOrder
    .map((stationId, index) => {
      const intentScore = selectedIntents.reduce((total, intent) => {
        return total + (journeyIntentMappings[intent]?.[stationId] || 0);
      }, 0);

      const readinessScore = getReadinessScore(stationStateById[stationId]?.status);
      const positionScore = Math.max(stationIdsInOrder.length - index, 0);

      const score = hasIntentSelection
        ? intentScore * 1.5 + readinessScore + positionScore * 0.25
        : positionScore;

      return {
        stationId,
        score,
        intentScore,
        readinessScore,
        positionScore,
      };
    })
    .sort((a, b) => b.score - a.score);
}

export function normalizeJourneyIntentTags(tags: string[]): JourneyIntentTag[] {
  const validTags = new Set<JourneyIntentTag>(['new-api', 'major-redesign', 'governance', 'platform-scale']);
  return tags.filter((tag): tag is JourneyIntentTag => validTags.has(tag as JourneyIntentTag));
}
