# Demo UI — Updated Full Workflow

This document outlines the updated workflow for the credit analysis UI, incorporating enhancements to reduce repetitious tasks and streamline credit memo creation for **New Request** analysis and **Relationship Review** (beta).

---

## Table of Contents

- [User Flow Overview](#user-flow-overview)
- [Screen-by-Screen Breakdown](#screen-by-screen-breakdown)
  - [1. Dashboard (Home)](#1-dashboard-home)
  - [2. New Analysis - Type Selection & File Upload](#2-new-analysis---type-selection--file-upload)
  - [3. Data Review & Normalization](#3-data-review--normalization)
  - [4. Adjustments & Add-backs](#4-adjustments--add-backs)
  - [5. Relationship Structure](#5-relationship-structure)
  - [6. Debt Schedule & DSCR](#6-debt-schedule--dscr)
  - [7. Memo & Commentary](#7-memo--commentary)
  - [8. Output Generation](#8-output-generation)
  - [9. Audit Trail](#9-audit-trail)
- [Supporting Screens](#supporting-screens)
  - [Settings / Bank Policy Config](#settings--bank-policy-config)
  - [Auth Screens (Simple)](#auth-screens-simple)
- [Navigation Structure](#navigation-structure)
- [Component Library Needs](#component-library-needs)
- [Demo Flow (Updated Happy Path)](#demo-flow-updated-happy-path)

---

## User Flow Overview

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│   Upload    │ →  │  Review &    │ →  │ Relationship │ →  │   Debt &     │ →  │   Output    │
│   Files     │    │  Normalize   │    │   Setup      │    │   DSCR       │    │  Generation │
└─────────────┘    └──────────────┘    └─────────────┘    └──────────────┘    └─────────────┘
```

**Note:** The core flow remains similar, but now includes:
- Branching for **analysis type** (New Request vs Relationship Review beta)
- **Required loan inputs** upfront for New Requests
- **Multi-entity parsing** (one Sageworks file per entity/guarantor)
- Enhanced DSCR and memo automation to minimize repetition

---

## Screen-by-Screen Breakdown

### 1) Dashboard (Home)

**Route:** `/dashboard`  
**Purpose:** Overview of all borrower relationships/deals in progress, including quick filters for **New Requests** vs **Relationship Reviews**.

**Components**
- Stats cards:
  - Active deals
  - Pending review
  - Completed this month
  - **New Requests vs Reviews**
- Recent activity feed (e.g., “New Request started for Smith Holdings”)
- Quick actions: **New Analysis**, **Continue Draft**
- Table of borrower groups with status
  - Add columns: **Analysis Type**, **Global DSCR Status**

**Mock Data**
- 5–8 sample borrower groups at various stages  
  - Example mix: 4 New Requests, 2 Reviews (beta), 1 output generated

---

### 2) New Analysis — Type Selection & File Upload

**Route:** `/dashboard/analysis/new`  
**Purpose:** Select analysis type, input required loan details (for New Requests), and upload Sageworks exports and schedules.

**Components**
- Analysis Type selector (radio)
  - **New Request** (focus; enables loan input form)
  - **Relationship Review** (beta; simplified flow; skips loan inputs but includes uploads/parsing)

#### For New Request: Loan Input Form (Required Gate)
- Loan Type dropdown:
  - Balloon
  - Term Loan (fully amortizing)
  - RLOC
- Loan Amount (numeric; validation > 0)
- Interest Rate (percentage)
- Index (text input; e.g., “WSJP + 2.5%”)
- Fees Associated (borrower-paid fees; optional; prompts for inclusion in DSCR calc)

#### File Upload
- Drag-and-drop upload zone (multi-file, multi-party)
- File Type selector per file:
  - Sageworks Spreads (Borrower / Entities / Guarantors)
  - UCA
  - Debt Schedule
- Upload queue with status:
  - Uploaded / Processing / Parsed / Flagged
- Continue button:
  - Disabled until:
    - New Request loan inputs are complete **AND**
    - At least one file uploaded

**Demo Behavior**
- Select **New Request** → fill loan inputs → upload multiple files → show “processing” → auto-advance
- “Use pre-loaded sample files” button loads:
  - Borrower
  - 1 related entity
  - 1–2 guarantors
- Dev Note:
  - Validate loan inputs (error if amount <= 0)
  - Auto-tag files by filename heuristics (“Personal” → Guarantor)

---

### 3) Data Review & Normalization

**Route:** `/dashboard/analysis/[id]/review`  
**Purpose:** Review parsed financials from multiple Sageworks files (one per entity/guarantor), resolve mapping issues.

**Components**
- Multi-Entity tabs (dynamic from uploads):
  - Borrower
  - Related Entity 1 (e.g., Smith Properties)
  - Guarantor 1 (e.g., John Smith)
  - etc.
- For each tab:
  - Side-by-side view: Original (Sageworks) → Normalized (Canonical)
  - Line Item Mapping table with confidence indicators
  - Flagged items requiring review (yellow/red)
  - Period selector (auto-detect; standard 3 FYE + interim)
  - Approve & Continue button
- Dev Note (Guarantors):
  - Highlight personal fields:
    - Wages/Salaries
    - Interest/Dividends
    - Schedule C
    - Capital Gains
    - Net Rents & Royalties
    - Farm Operations
    - Distributions
    - Income Taxes

**Tabs (per entity/guarantor)**
- Balance Sheet
- Income Statement
- Cash Flow (UCA)

**Mock Data**
- Borrower + 1 related entity + 1 guarantor  
- Each has 3 years + interim/TTM  
- Intentional flagged items:
  - ambiguous “Other Income”
  - unmatched personal income bucket mapping

---

### 4) Adjustments & Add-backs

**Route:** `/dashboard/analysis/[id]/adjustments`  
**Purpose:** Apply and review normalization adjustments across entities/guarantors using standardized rules, with overrides and audit trails.

**Components**
- Multi-Entity accordion (Borrower / Related Entities / Guarantors)
- Adjustment Categories (per entity):
  - Non-recurring expenses
  - Owner comp normalization
  - Related party adjustments
  - One-time events
- Entity-specific logic:
  - **Corporate:** Depreciation, Amortization, Interest Expense, Contributions (add-backs)
  - **Guarantor:** Living expenses auto-calc (default 30% post-tax cash flow)
- Each adjustment includes:
  - Triggering rule (e.g., “Auto-add back Depreciation from IS”)
  - Original value → Adjusted value
  - Override toggle + reason field (audit tracked)
- Running totals:
  - Corporate: “Net Adjustments: +$X to EBITDA”
  - Guarantor: “Cash Available for DS impact: $X”
- Adjustment audit log preview

**Dev Note (Formulas)**
- Corporate: `Net Income + Add-backs - Distributions = Cash Available for DS`
- Guarantor:
  - `Total Income = sum(income buckets)`
  - `Cash Available = Total Income - Taxes - Living Expenses`
  - Living Expenses default = `30% of post-tax cash flow` (policy-configurable)

**Mock Data**
- 5–6 auto-applied adjustments per entity
- 2–3 requiring analyst decision (override)

---

### 5) Relationship Structure

**Route:** `/dashboard/analysis/[id]/relationship`  
**Purpose:** Define borrower group, entities, guarantors, ownership. Now auto-suggests structure from uploads.

**Components**
- Visual org chart / tree

```
Borrower Group: "Smith Holdings"
├── Entity: Smith Manufacturing LLC (100%)
├── Entity: Smith Properties LLC (100%)
└── Guarantor: John Smith (Personal)
```

- Add/edit entity modal (auto-populate from uploads)
- Add/edit guarantor modal
- Ownership percentage inputs
- “Include in Global DSCR” toggles (default ON for parsed parties)
- Roll-up configuration (aggregate cash flows)

**Mock Data**
- 2 operating companies + 1 guarantor (pre-built)

---

### 6) Debt Schedule & DSCR

**Route:** `/dashboard/analysis/[id]/debt-service`  
**Purpose:** Capture existing debt (manual-first), auto-calc proposed debt (from loan inputs), compile DSCR template, calculate entity + global DSCR.

#### Tabs

##### 6a) Existing Debt
- Multi-Entity table of current corporate obligations:
  - Lender | Type | Balance | Rate | Payment | Maturity
- Personal debt obligations for guarantors:
  - Manual entry from credit report / PFS
- Import option (Excel/CSV) or manual entry
- Dev Note:
  - Future: credit report API integration placeholder

##### 6b) Proposed Debt
- Pre-populated from New Request inputs:
  - Amount, Rate, Index, Fees
- Auto-calculate payment:
  - Fully amortizing vs interest-only vs balloon logic
  - Option to include fees impact if required by bank policy
- Scenario comparison:
  - With vs without proposed debt

##### 6c) DSCR Calculation
- DSCR Template Builder:
  - Columns: 3–4 periods (3 FYE + interim typical)
- Per entity/guarantor:
  - Auto-fill from parsed + adjusted data using standardized formulas
- Entity DSCR cards:
  - Cash Available / Debt Service
- Global DSCR summary:

```
┌─────────────────────────────────────┐
│ GLOBAL DSCR                         │
│ ═══════════════════════════════════ │
│ Combined Cash Flow:     $1,250,000  │
│ Total Debt Service:       $890,000  │
│ ─────────────────────────────────── │
│ Global DSCR:                 1.40x  │
│ Policy Minimum:              1.25x  │
│ Status:                   ✓ PASS    │
└─────────────────────────────────────┘
```

- Sensitivity toggle:
  - Rate +100 bps
  - Revenue -10%
  - (Optional) margin stress

**Dev Note**
- Global aggregates:
  - `Global Cash Available = sum(all included parties)`
  - `Global Debt Service = sum(all obligations + proposed)`
- Flag if global DSCR < policy min (e.g., 1.25x) → memo exceptions triggered

**Mock Data**
- 3–4 existing loans (manual) across entities
- 1 proposed loan (auto)
- Calculated DSCR values (entity + global)

---

### 7) Memo & Commentary

**Route:** `/dashboard/analysis/[id]/memo`  
**Purpose:** Generate memo sections and commentary blocks based on objective triggers; enable editing and audit-tracked finalization.

**Core rule:** Draft content is **not** a credit decision model. It is **draft narrative for analyst review**.

**Components**
- Section-by-section memo builder (editable)
- “Regenerate section” button (rules-based, deterministic; no “opinions”)
- Audit trail on edits/overrides
- “Draft — Analyst Review Required” badge on each section

#### Sections

1) **Summary First Page**
- Auto intro paragraph (purpose/request)
- Loan details table (from inputs)

2) **Background**
- Relationship and business history
- Key managers resumes
- Manual input/editable

3) **Industry Risk Analysis**
- Placeholder for IBISWorld import
- Manual/editable; future API integration

4) **Market Analysis**
- Manual/editable narrative about borrower market/collateral market

5) **DSCR Analysis Template**
- Embed entity and global DSCR tables (from DSCR step)

6) **Financial Performance Commentary (automation-friendly)**
Auto-generated trends + triggers/overrides:
- Revenue (YoY, CAGR, seasonality, concentration if available)
- Gross margin trend
- EBITDA/operating margin trend
- OpEx trend (SG&A %, fixed vs variable)
- One-time items / normalization frequency
- Earnings volatility
- Cash flow and debt service capacity
- UCA/CFO trend
- FCF sustainability
- Working capital (AR/Inv/AP days, CCC)
- DSCR (historical, pro-forma, stress)
- Global DSCR
- Leverage/capital structure (debt trends, ratios)
- Liquidity/balance sheet health (ratios, availability)
- Off-balance-sheet exposures

7) **Debt Schedule Analysis (obligation-level)**
Per debt obligation:
- Type, balance, rate, payment, amortization
- Maturity/balloon/refi risk
- Collateral and lien position (if captured)
- Covenant placeholders (manual if not captured)
- Concentration, coverage, cushion
- Stress testing references

8) **Collateral Analysis**
- Manual + structured placeholders (valuation date, LTV, margin of safety)

9) **Personal Financial Snapshot**
- Guarantor income/debt summary (from DSCR + manual obligations)

10) **Strengths and Weaknesses**
- Auto-suggest based on flags (declining revenue + rising leverage, thin DSCR, etc.)
- Editable

#### Standardized Tables/Graphs (Embedded)
- Trend table (3yr + interim/TTM): revenue, margins, EBITDA, CFO, leverage, liquidity
- Debt schedule summary + maturity wall
- DSCR history + pro-forma + stress
- Graph placeholders (optional future)

**Mock Data**
- Trigger examples:
  - “Revenue decreased 12% YoY” → explanation prompt
  - “AR days > 60” → collections risk block
  - “Global DSCR < 1.25x” → exception language inserted

---

### 8) Output Generation

**Route:** `/dashboard/analysis/[id]/output`  
**Purpose:** Generate and download final package as a **single PDF**.

**Components**
- Output checklist (compiled into one PDF):
  - Credit memo (full narrative with sections/tables)
  - DSCR template (embedded)
  - Global cash flow package
  - Audit trail report
- Preview panels for each
- Generate All button (progress bar)
- Download options:
  - Default: single PDF
  - Optional: ZIP (future)

**Demo Behavior**
- Simulate generation → provide sample downloadable PDF

---

### 9) Audit Trail

**Route:** `/dashboard/analysis/[id]/audit`  
**Purpose:** Full history of all changes; now includes loan inputs and multi-entity actions.

**Components**
- Timeline of actions:
  - Loan inputs entered/edited
  - Files uploaded/processed
  - Mapping approved
  - Adjustments applied/overridden (with reasons)
  - Proposed debt locked
  - DSCR calculated (base vs pro-forma vs stress)
  - Memo sections generated/edited
  - Output generated
- Filters:
  - Date
  - User
  - Action type
- Export audit log

---

## Supporting Screens

### Settings / Bank Policy Config

**Route:** `/dashboard/settings`  
**Tabs**
- DSCR Methodology (e.g., living expense % default; DSCR formula choice)
- Add-back Rules (rules, thresholds, triggers)
- Memo Templates (section templates, commentary triggers)
- Users & Permissions

---

### Auth Screens (Simple)

- `/login` — Login form
- `/register` — Registration (optional demo)

---

## Navigation Structure

**Sidebar**
- Dashboard (home)
- Analyses (all deals)
- Clients (borrower groups)
- Reports
- Settings
  - DSCR Config
  - Add-back Rules
  - Memo Templates
  - Team

---

## Component Library Needs

| Component | Usage |
|---|---|
| DataTable | Financial statements, debt schedules, audit logs, trend tables |
| FileUpload | Drag-drop upload zone (multi-file) |
| OrgChart | Relationship visualization |
| StatCard | Dashboard metrics |
| StepWizard | Multi-step analysis flow |
| AdjustmentCard | Individual adjustment review (multi-entity) |
| DSCRGauge | Visual DSCR indicator |
| MemoEditor | Rich text with sections, triggers |
| AuditTimeline | Chronological activity log |
| FormValidator | Loan input validation (required fields gate) |

---

## Demo Flow (Updated Happy Path)

1) User logs in → lands on Dashboard  
2) Clicks New Analysis → selects **New Request** (Relationship Review is beta, not demoed)  
3) Enters required loan inputs (type, amount, rate, index, fees)  
4) Uploads sample Sageworks files (borrower, related entity, guarantor) or uses pre-loaded  
5) Reviews normalized data across entities/guarantors → approves  
6) Reviews auto-applied adjustments/add-backs → overrides one  
7) Confirms relationship structure (auto-suggested from uploads)  
8) Reviews corporate debt schedule (manual entry) → proposed debt auto-calculated from inputs  
9) Views compiled DSCR template/calculation (entity + global) → confirms status  
10) Reviews generated memo (auto-sections + triggers; manual fields for background/industry/market) → edits one section  
11) Generates output package → downloads **single PDF**

**Total screens:** 8 steps  
**Estimated demo time:** 3–5 minutes (automation reduces manual steps)

---
