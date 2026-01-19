import { Adjustment } from '@/types';

export const mockAdjustments: Adjustment[] = [
  {
    id: 'adj-1',
    category: 'non-recurring',
    description: 'Legal settlement expense - one-time litigation',
    originalValue: 85000,
    adjustedValue: 0,
    impact: 85000,
    rule: 'NR-001: Legal settlements > $25,000 flagged as non-recurring',
    isOverridden: false,
  },
  {
    id: 'adj-2',
    category: 'owner-compensation',
    description: 'Officer compensation normalization',
    originalValue: 180000,
    adjustedValue: 120000,
    impact: 60000,
    rule: 'OC-001: Officer comp > $120,000 normalized to market rate',
    isOverridden: false,
  },
  {
    id: 'adj-3',
    category: 'non-recurring',
    description: 'Equipment write-off - obsolete machinery',
    originalValue: 42000,
    adjustedValue: 0,
    impact: 42000,
    rule: 'NR-002: Asset write-offs flagged as non-recurring',
    isOverridden: false,
  },
  {
    id: 'adj-4',
    category: 'related-party',
    description: 'Related party rent - below market rate',
    originalValue: 36000,
    adjustedValue: 72000,
    impact: -36000,
    rule: 'RP-001: Related party rent adjusted to market rate ($6,000/mo)',
    isOverridden: true,
    overrideReason: 'Property appraisal confirms $4,500/mo is market rate for this location',
    overriddenBy: 'Sarah Johnson',
    overriddenAt: '2024-01-17T10:30:00Z',
  },
  {
    id: 'adj-5',
    category: 'one-time',
    description: 'Insurance claim proceeds - roof damage',
    originalValue: 0,
    adjustedValue: -28000,
    impact: -28000,
    rule: 'OT-001: Insurance proceeds > $10,000 removed from recurring income',
    isOverridden: false,
  },
  {
    id: 'adj-6',
    category: 'non-recurring',
    description: 'Employee severance package',
    originalValue: 35000,
    adjustedValue: 0,
    impact: 35000,
    rule: 'NR-003: Severance payments flagged as non-recurring',
    isOverridden: false,
  },
];

// Calculate totals
export const getAdjustmentSummary = (adjustments: Adjustment[]) => {
  const totalImpact = adjustments.reduce((sum, adj) => sum + adj.impact, 0);
  const byCategory = adjustments.reduce(
    (acc, adj) => {
      acc[adj.category] = (acc[adj.category] || 0) + adj.impact;
      return acc;
    },
    {} as Record<string, number>
  );
  const overriddenCount = adjustments.filter((adj) => adj.isOverridden).length;
  const pendingReview = adjustments.filter((adj) => !adj.isOverridden && adj.impact < 0).length;

  return {
    totalImpact,
    byCategory,
    overriddenCount,
    pendingReview,
    count: adjustments.length,
  };
};
