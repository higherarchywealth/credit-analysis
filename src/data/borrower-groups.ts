import { BorrowerGroup, Entity, Guarantor, FinancialPeriod, DebtObligation, BalanceSheet, IncomeStatement, CashFlowStatement } from '@/types';

// ============================================
// Sample Financial Data
// ============================================

const smithManufacturingBS2023: BalanceSheet = {
  cash: 245000,
  accountsReceivable: 520000,
  inventory: 380000,
  otherCurrentAssets: 45000,
  totalCurrentAssets: 1190000,
  fixedAssets: 1850000,
  accumulatedDepreciation: 620000,
  netFixedAssets: 1230000,
  otherAssets: 85000,
  totalAssets: 2505000,
  accountsPayable: 285000,
  currentPortionLTD: 120000,
  otherCurrentLiabilities: 95000,
  totalCurrentLiabilities: 500000,
  longTermDebt: 780000,
  otherLiabilities: 45000,
  totalLiabilities: 1325000,
  commonStock: 100000,
  retainedEarnings: 1080000,
  totalEquity: 1180000,
};

const smithManufacturingIS2023: IncomeStatement = {
  revenue: 4250000,
  costOfGoodsSold: 2890000,
  grossProfit: 1360000,
  operatingExpenses: 785000,
  officerCompensation: 180000,
  depreciation: 145000,
  amortization: 12000,
  interestExpense: 68000,
  otherIncome: 15000,
  otherExpense: 8000,
  netIncome: 357000,
  ebitda: 582000,
};

const smithManufacturingCF2023: CashFlowStatement = {
  netIncome: 357000,
  depreciation: 145000,
  amortization: 12000,
  changeInAR: -45000,
  changeInInventory: -28000,
  changeInAP: 32000,
  otherOperating: 5000,
  operatingCashFlow: 478000,
  capitalExpenditures: -185000,
  otherInvesting: 0,
  investingCashFlow: -185000,
  debtProceeds: 0,
  debtPayments: -115000,
  distributions: -120000,
  otherFinancing: 0,
  financingCashFlow: -235000,
  netCashFlow: 58000,
};

const smithManufacturingFinancials: FinancialPeriod[] = [
  {
    id: 'fp-1',
    entityId: 'entity-1',
    periodType: 'FY',
    periodEnd: '2023-12-31',
    year: 2023,
    balanceSheet: smithManufacturingBS2023,
    incomeStatement: smithManufacturingIS2023,
    cashFlow: smithManufacturingCF2023,
  },
  {
    id: 'fp-2',
    entityId: 'entity-1',
    periodType: 'FY',
    periodEnd: '2022-12-31',
    year: 2022,
    balanceSheet: {
      ...smithManufacturingBS2023,
      cash: 187000,
      totalAssets: 2320000,
    },
    incomeStatement: {
      ...smithManufacturingIS2023,
      revenue: 3850000,
      netIncome: 298000,
      ebitda: 512000,
    },
    cashFlow: {
      ...smithManufacturingCF2023,
      operatingCashFlow: 412000,
    },
  },
];

const smithPropertiesFinancials: FinancialPeriod[] = [
  {
    id: 'fp-3',
    entityId: 'entity-2',
    periodType: 'FY',
    periodEnd: '2023-12-31',
    year: 2023,
    balanceSheet: {
      cash: 85000,
      accountsReceivable: 12000,
      inventory: 0,
      otherCurrentAssets: 8000,
      totalCurrentAssets: 105000,
      fixedAssets: 2450000,
      accumulatedDepreciation: 380000,
      netFixedAssets: 2070000,
      otherAssets: 25000,
      totalAssets: 2200000,
      accountsPayable: 18000,
      currentPortionLTD: 85000,
      otherCurrentLiabilities: 12000,
      totalCurrentLiabilities: 115000,
      longTermDebt: 1420000,
      otherLiabilities: 0,
      totalLiabilities: 1535000,
      commonStock: 50000,
      retainedEarnings: 615000,
      totalEquity: 665000,
    },
    incomeStatement: {
      revenue: 324000,
      costOfGoodsSold: 0,
      grossProfit: 324000,
      operatingExpenses: 95000,
      officerCompensation: 0,
      depreciation: 82000,
      amortization: 0,
      interestExpense: 78000,
      otherIncome: 0,
      otherExpense: 0,
      netIncome: 69000,
      ebitda: 229000,
    },
    cashFlow: {
      netIncome: 69000,
      depreciation: 82000,
      amortization: 0,
      changeInAR: -2000,
      changeInInventory: 0,
      changeInAP: 3000,
      otherOperating: 0,
      operatingCashFlow: 152000,
      capitalExpenditures: -45000,
      otherInvesting: 0,
      investingCashFlow: -45000,
      debtProceeds: 0,
      debtPayments: -82000,
      distributions: -24000,
      otherFinancing: 0,
      financingCashFlow: -106000,
      netCashFlow: 1000,
    },
  },
];

// ============================================
// Debt Obligations
// ============================================

const smithManufacturingDebts: DebtObligation[] = [
  {
    id: 'debt-1',
    lender: 'First National Bank',
    type: 'term',
    originalBalance: 1200000,
    currentBalance: 780000,
    interestRate: 6.25,
    monthlyPayment: 14500,
    maturityDate: '2028-06-15',
    isProposed: false,
  },
  {
    id: 'debt-2',
    lender: 'First National Bank',
    type: 'revolver',
    originalBalance: 500000,
    currentBalance: 185000,
    interestRate: 7.5,
    monthlyPayment: 1156,
    maturityDate: '2025-12-31',
    isProposed: false,
  },
];

const smithPropertiesDebts: DebtObligation[] = [
  {
    id: 'debt-3',
    lender: 'Community Bank',
    type: 'mortgage',
    originalBalance: 1800000,
    currentBalance: 1420000,
    interestRate: 5.75,
    monthlyPayment: 12800,
    maturityDate: '2033-03-01',
    isProposed: false,
  },
];

const johnSmithPersonalDebt: DebtObligation[] = [
  {
    id: 'debt-4',
    lender: 'Home Mortgage Co',
    type: 'mortgage',
    originalBalance: 650000,
    currentBalance: 485000,
    interestRate: 4.25,
    monthlyPayment: 3200,
    maturityDate: '2048-08-01',
    isProposed: false,
  },
  {
    id: 'debt-5',
    lender: 'Auto Finance',
    type: 'auto',
    originalBalance: 62000,
    currentBalance: 28000,
    interestRate: 5.9,
    monthlyPayment: 1150,
    maturityDate: '2026-04-15',
    isProposed: false,
  },
];

// ============================================
// Entities & Guarantors
// ============================================

const smithManufacturing: Entity = {
  id: 'entity-1',
  name: 'Smith Manufacturing LLC',
  type: 'operating',
  ownershipPercent: 100,
  includeInGlobal: true,
  financials: smithManufacturingFinancials,
  debts: smithManufacturingDebts,
};

const smithProperties: Entity = {
  id: 'entity-2',
  name: 'Smith Properties LLC',
  type: 'real-estate',
  ownershipPercent: 100,
  includeInGlobal: true,
  financials: smithPropertiesFinancials,
  debts: smithPropertiesDebts,
};

const johnSmith: Guarantor = {
  id: 'guarantor-1',
  name: 'John Smith',
  type: 'individual',
  ownershipPercent: 100,
  personalCashFlow: 185000,
  personalDebt: johnSmithPersonalDebt,
};

// ============================================
// Borrower Groups
// ============================================

export const mockBorrowerGroups: BorrowerGroup[] = [
  {
    id: 'bg-1',
    name: 'Smith Holdings',
    status: 'debt-service',
    entities: [smithManufacturing, smithProperties],
    guarantors: [johnSmith],
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-18T14:30:00Z',
    analyst: 'Sarah Johnson',
  },
  {
    id: 'bg-2',
    name: 'Acme Industries Group',
    status: 'data-review',
    entities: [
      {
        id: 'entity-3',
        name: 'Acme Industries Inc',
        type: 'operating',
        ownershipPercent: 100,
        includeInGlobal: true,
        financials: [],
        debts: [],
      },
    ],
    guarantors: [
      {
        id: 'guarantor-2',
        name: 'Robert Williams',
        type: 'individual',
        ownershipPercent: 60,
        personalCashFlow: 220000,
        personalDebt: [],
      },
    ],
    createdAt: '2024-01-15T11:00:00Z',
    updatedAt: '2024-01-17T16:45:00Z',
    analyst: 'Sarah Johnson',
  },
  {
    id: 'bg-3',
    name: 'Riverside Medical Partners',
    status: 'completed',
    entities: [
      {
        id: 'entity-4',
        name: 'Riverside Medical Center LLC',
        type: 'operating',
        ownershipPercent: 100,
        includeInGlobal: true,
        financials: [],
        debts: [],
      },
    ],
    guarantors: [],
    createdAt: '2024-01-05T08:30:00Z',
    updatedAt: '2024-01-12T10:00:00Z',
    analyst: 'Michael Chen',
  },
  {
    id: 'bg-4',
    name: 'Greenfield Construction',
    status: 'adjustments',
    entities: [
      {
        id: 'entity-5',
        name: 'Greenfield Builders Inc',
        type: 'operating',
        ownershipPercent: 100,
        includeInGlobal: true,
        financials: [],
        debts: [],
      },
    ],
    guarantors: [
      {
        id: 'guarantor-3',
        name: 'David Miller',
        type: 'individual',
        ownershipPercent: 100,
        personalCashFlow: 145000,
        personalDebt: [],
      },
    ],
    createdAt: '2024-01-08T14:00:00Z',
    updatedAt: '2024-01-16T09:15:00Z',
    analyst: 'Emily Davis',
  },
  {
    id: 'bg-5',
    name: 'Pacific Auto Group',
    status: 'draft',
    entities: [],
    guarantors: [],
    createdAt: '2024-01-18T10:00:00Z',
    updatedAt: '2024-01-18T10:00:00Z',
    analyst: 'Sarah Johnson',
  },
];

// Helper to get a single borrower group
export const getBorrowerGroup = (id: string): BorrowerGroup | undefined => {
  return mockBorrowerGroups.find((bg) => bg.id === id);
};

// Default borrower group for demo
export const demoBorrowerGroup = mockBorrowerGroups[0];
