import { Analysis, GlobalDSCR, MemoSection, AuditEntry } from '@/types';
import { demoBorrowerGroup } from './borrower-groups';
import { mockAdjustments } from './adjustments';

// ============================================
// DSCR Calculations
// ============================================

export const mockGlobalDSCR: GlobalDSCR = {
  combinedCashFlow: 630000,
  totalDebtService: 450000,
  globalDSCR: 1.4,
  policyMinimum: 1.25,
  status: 'pass',
  entityBreakdown: [
    {
      entityId: 'entity-1',
      entityName: 'Smith Manufacturing LLC',
      cashFlow: 478000,
      debtService: 188000,
      dscr: 2.54,
      status: 'pass',
    },
    {
      entityId: 'entity-2',
      entityName: 'Smith Properties LLC',
      cashFlow: 152000,
      debtService: 153600,
      dscr: 0.99,
      status: 'fail',
    },
  ],
};

// ============================================
// Memo Sections
// ============================================

export const mockMemoSections: MemoSection[] = [
  {
    id: 'memo-1',
    title: 'Business Overview',
    content: `Smith Holdings is a diversified group consisting of Smith Manufacturing LLC, a precision metal fabrication company established in 2008, and Smith Properties LLC, a real estate holding company. The manufacturing operation serves the automotive and aerospace industries with annual revenues of approximately $4.25 million. The relationship is 100% owned by John Smith, who has 25 years of industry experience.`,
    isGenerated: true,
    isEdited: false,
    order: 1,
  },
  {
    id: 'memo-2',
    title: 'Financial Performance',
    content: `**Revenue Trend:** Revenue increased 10.4% YoY from $3.85M (2022) to $4.25M (2023), driven by new aerospace contracts secured in Q2 2023.

**Profitability:** EBITDA improved to $582,000 (13.7% margin) from $512,000 (13.3% margin) in the prior year. Net income increased 19.8% to $357,000.

**Liquidity:** Current ratio of 2.38x indicates adequate short-term liquidity. Working capital increased by $85,000 during the period.

⚠️ **Analyst Note Required:** Related party rent adjustment was overridden - see adjustment schedule for details.`,
    isGenerated: true,
    isEdited: false,
    order: 2,
  },
  {
    id: 'memo-3',
    title: 'Global Cash Flow Summary',
    content: `The combined global cash flow analysis includes two operating entities and one personal guarantor:

| Source | Cash Flow | Debt Service | Coverage |
|--------|-----------|--------------|----------|
| Smith Manufacturing LLC | $478,000 | $188,000 | 2.54x |
| Smith Properties LLC | $152,000 | $153,600 | 0.99x |
| John Smith (Personal) | $185,000 | $52,200 | 3.55x |
| **Global Total** | **$815,000** | **$393,800** | **2.07x** |

The real estate entity shows marginal coverage on a standalone basis; however, when combined with the manufacturing cash flow and personal guarantor support, global coverage is adequate.`,
    isGenerated: true,
    isEdited: false,
    order: 3,
  },
  {
    id: 'memo-4',
    title: 'DSCR Analysis',
    content: `**Global DSCR: 1.40x** (Policy Minimum: 1.25x) ✓ PASS

The borrower demonstrates adequate debt service coverage on a global basis. Key considerations:

1. Manufacturing entity provides strong standalone coverage (2.54x)
2. Real estate entity is marginally below 1.0x but stabilized with long-term tenant
3. Personal guarantor adds significant additional coverage capacity
4. Proposed $500,000 term loan would reduce global DSCR to 1.28x, still within policy`,
    isGenerated: true,
    isEdited: false,
    order: 4,
  },
  {
    id: 'memo-5',
    title: 'Policy Exceptions',
    content: `No policy exceptions are required for this request. The global DSCR of 1.40x exceeds the minimum requirement of 1.25x.`,
    isGenerated: true,
    isEdited: false,
    order: 5,
  },
  {
    id: 'memo-6',
    title: 'Recommendation',
    content: `[DRAFT - ANALYST REVIEW REQUIRED]

Based on the analysis above, it is recommended that the Bank [APPROVE/DECLINE] the credit request for Smith Holdings in the amount of $[AMOUNT] subject to the following conditions:

1. [Condition 1]
2. [Condition 2]
3. [Condition 3]`,
    isGenerated: true,
    isEdited: false,
    order: 6,
  },
];

// ============================================
// Audit Log
// ============================================

export const mockAuditLog: AuditEntry[] = [
  {
    id: 'audit-1',
    timestamp: '2024-01-10T09:15:00Z',
    action: 'file-uploaded',
    description: 'Sageworks export uploaded: Smith_Manufacturing_2023.xlsx',
    user: 'Sarah Johnson',
    details: { fileName: 'Smith_Manufacturing_2023.xlsx', fileType: 'spreads' },
  },
  {
    id: 'audit-2',
    timestamp: '2024-01-10T09:16:00Z',
    action: 'file-uploaded',
    description: 'Sageworks export uploaded: Smith_Properties_2023.xlsx',
    user: 'Sarah Johnson',
    details: { fileName: 'Smith_Properties_2023.xlsx', fileType: 'spreads' },
  },
  {
    id: 'audit-3',
    timestamp: '2024-01-10T09:20:00Z',
    action: 'data-normalized',
    description: 'Financial data normalized to canonical format',
    user: 'System',
    details: { entities: 2, periods: 3, lineItems: 156 },
  },
  {
    id: 'audit-4',
    timestamp: '2024-01-12T14:30:00Z',
    action: 'adjustment-applied',
    description: 'Non-recurring adjustment applied: Legal settlement expense',
    user: 'System',
    details: { rule: 'NR-001', impact: 85000 },
  },
  {
    id: 'audit-5',
    timestamp: '2024-01-12T14:30:00Z',
    action: 'adjustment-applied',
    description: 'Owner compensation normalization applied',
    user: 'System',
    details: { rule: 'OC-001', impact: 60000 },
  },
  {
    id: 'audit-6',
    timestamp: '2024-01-17T10:30:00Z',
    action: 'adjustment-overridden',
    description: 'Related party rent adjustment overridden',
    user: 'Sarah Johnson',
    details: {
      rule: 'RP-001',
      originalImpact: -36000,
      reason: 'Property appraisal confirms $4,500/mo is market rate',
    },
  },
  {
    id: 'audit-7',
    timestamp: '2024-01-17T11:00:00Z',
    action: 'relationship-updated',
    description: 'Guarantor added: John Smith',
    user: 'Sarah Johnson',
  },
  {
    id: 'audit-8',
    timestamp: '2024-01-18T09:00:00Z',
    action: 'dscr-calculated',
    description: 'Global DSCR calculated: 1.40x',
    user: 'System',
    details: { globalDSCR: 1.4, status: 'pass' },
  },
  {
    id: 'audit-9',
    timestamp: '2024-01-18T10:15:00Z',
    action: 'memo-generated',
    description: 'Credit memo draft generated',
    user: 'System',
    details: { sections: 6 },
  },
];

// ============================================
// Full Analysis Object
// ============================================

export const mockAnalysis: Analysis = {
  id: 'analysis-1',
  borrowerGroupId: 'bg-1',
  borrowerGroup: demoBorrowerGroup,
  status: 'debt-service',
  currentStep: 6,
  adjustments: mockAdjustments,
  globalDSCR: mockGlobalDSCR,
  memoSections: mockMemoSections,
  auditLog: mockAuditLog,
  createdAt: '2024-01-10T09:00:00Z',
  updatedAt: '2024-01-18T14:30:00Z',
};

// Helper to get analysis by ID
export const getAnalysis = (id: string): Analysis | undefined => {
  if (id === 'analysis-1' || id === 'demo') {
    return mockAnalysis;
  }
  return undefined;
};
