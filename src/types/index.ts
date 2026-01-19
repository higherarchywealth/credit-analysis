// Global Types for Credit Analysis Demo

// ============================================
// Core Entities
// ============================================

export interface BorrowerGroup {
  id: string;
  name: string;
  status: AnalysisStatus;
  entities: Entity[];
  guarantors: Guarantor[];
  createdAt: string;
  updatedAt: string;
  analyst: string;
}

export interface Entity {
  id: string;
  name: string;
  type: 'operating' | 'holding' | 'real-estate';
  ownershipPercent: number;
  includeInGlobal: boolean;
  financials: FinancialPeriod[];
  debts: DebtObligation[];
}

export interface Guarantor {
  id: string;
  name: string;
  type: 'individual' | 'entity';
  ownershipPercent: number;
  personalCashFlow: number;
  personalDebt: DebtObligation[];
}

// ============================================
// Financial Data
// ============================================

export interface FinancialPeriod {
  id: string;
  entityId: string;
  periodType: 'FY' | 'TTM' | 'Interim';
  periodEnd: string;
  year: number;
  balanceSheet: BalanceSheet;
  incomeStatement: IncomeStatement;
  cashFlow: CashFlowStatement;
}

export interface BalanceSheet {
  // Assets
  cash: number;
  accountsReceivable: number;
  inventory: number;
  otherCurrentAssets: number;
  totalCurrentAssets: number;
  fixedAssets: number;
  accumulatedDepreciation: number;
  netFixedAssets: number;
  otherAssets: number;
  totalAssets: number;
  // Liabilities
  accountsPayable: number;
  currentPortionLTD: number;
  otherCurrentLiabilities: number;
  totalCurrentLiabilities: number;
  longTermDebt: number;
  otherLiabilities: number;
  totalLiabilities: number;
  // Equity
  commonStock: number;
  retainedEarnings: number;
  totalEquity: number;
}

export interface IncomeStatement {
  revenue: number;
  costOfGoodsSold: number;
  grossProfit: number;
  operatingExpenses: number;
  officerCompensation: number;
  depreciation: number;
  amortization: number;
  interestExpense: number;
  otherIncome: number;
  otherExpense: number;
  netIncome: number;
  ebitda: number;
}

export interface CashFlowStatement {
  netIncome: number;
  depreciation: number;
  amortization: number;
  changeInAR: number;
  changeInInventory: number;
  changeInAP: number;
  otherOperating: number;
  operatingCashFlow: number;
  capitalExpenditures: number;
  otherInvesting: number;
  investingCashFlow: number;
  debtProceeds: number;
  debtPayments: number;
  distributions: number;
  otherFinancing: number;
  financingCashFlow: number;
  netCashFlow: number;
}

// ============================================
// Debt & DSCR
// ============================================

export interface DebtObligation {
  id: string;
  lender: string;
  type: 'term' | 'revolver' | 'loc' | 'mortgage' | 'auto' | 'other';
  originalBalance: number;
  currentBalance: number;
  interestRate: number;
  monthlyPayment: number;
  maturityDate: string;
  isProposed: boolean;
}

export interface DSCRCalculation {
  entityId: string;
  entityName: string;
  cashFlow: number;
  debtService: number;
  dscr: number;
  status: 'pass' | 'marginal' | 'fail';
}

export interface GlobalDSCR {
  combinedCashFlow: number;
  totalDebtService: number;
  globalDSCR: number;
  policyMinimum: number;
  status: 'pass' | 'marginal' | 'fail';
  entityBreakdown: DSCRCalculation[];
}

// ============================================
// Adjustments
// ============================================

export interface Adjustment {
  id: string;
  category: AdjustmentCategory;
  description: string;
  originalValue: number;
  adjustedValue: number;
  impact: number;
  rule: string;
  isOverridden: boolean;
  overrideReason?: string;
  overriddenBy?: string;
  overriddenAt?: string;
}

export type AdjustmentCategory =
  | 'non-recurring'
  | 'owner-compensation'
  | 'related-party'
  | 'one-time'
  | 'rent-normalization'
  | 'other';

// ============================================
// Analysis Workflow
// ============================================

export type AnalysisStatus =
  | 'draft'
  | 'data-review'
  | 'adjustments'
  | 'relationship'
  | 'debt-service'
  | 'memo'
  | 'completed';

export interface Analysis {
  id: string;
  borrowerGroupId: string;
  borrowerGroup: BorrowerGroup;
  status: AnalysisStatus;
  currentStep: number;
  adjustments: Adjustment[];
  globalDSCR: GlobalDSCR | null;
  memoSections: MemoSection[];
  auditLog: AuditEntry[];
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Memo & Commentary
// ============================================

export interface MemoSection {
  id: string;
  title: string;
  content: string;
  isGenerated: boolean;
  isEdited: boolean;
  order: number;
}

// ============================================
// Audit Trail
// ============================================

export interface AuditEntry {
  id: string;
  timestamp: string;
  action: AuditAction;
  description: string;
  user: string;
  details?: Record<string, unknown>;
}

export type AuditAction =
  | 'file-uploaded'
  | 'data-normalized'
  | 'adjustment-applied'
  | 'adjustment-overridden'
  | 'relationship-updated'
  | 'dscr-calculated'
  | 'memo-generated'
  | 'memo-edited'
  | 'output-generated';

// ============================================
// UI State
// ============================================

export interface UploadedFile {
  id: string;
  name: string;
  type: 'spreads' | 'uca' | 'debt-schedule';
  status: 'uploading' | 'processing' | 'complete' | 'error';
  progress: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'analyst' | 'admin' | 'reviewer';
  avatar?: string;
}
