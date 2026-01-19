# Underwriting Automation Layer — New Request Workflow (UI Demo)
_Last updated: 2026-01-18_

> **Scope:** This document defines the **“New Request”** workflow for the UI demo: user inputs loan terms, uploads Sageworks files, confirms relationship structure, enters debt schedules, runs entity + global DSCR, and exports a memo/package with auditability.  
> **Non-goal:** This is **not** a credit decision model. All narrative output is **draft for analyst review** and must be traceable to data/rules.

---

## Table of Contents
1. [User Journey (High-Level)](#user-journey-high-level)
2. [Screen-by-Screen Workflow](#screen-by-screen-workflow)
   - 2.1 [Login → Dashboard](#login--dashboard)
   - 2.2 [New Analysis → New Request](#new-analysis--new-request)
   - 2.3 [Loan Details (Required Gate)](#loan-details-required-gate)
   - 2.4 [Uploads: Sageworks Files (Borrower / Entities / Guarantors)](#uploads-sageworks-files-borrower--entities--guarantors)
   - 2.5 [Normalized Data Review](#normalized-data-review)
   - 2.6 [Relationship Structure Confirmation](#relationship-structure-confirmation)
   - 2.7 [Debt Schedules + Proposed Debt Service](#debt-schedules--proposed-debt-service)
   - 2.8 [DSCR Template Build (Entity + Global)](#dscr-template-build-entity--global)
   - 2.9 [Memo & Package Outputs](#memo--package-outputs)
3. [Inputs](#inputs)
4. [Data Capture Requirements](#data-capture-requirements)
5. [Entity DSCR Model (Template Outline)](#entity-dscr-model-template-outline)
6. [Personal Guarantor Cash Flow Model (Template Outline)](#personal-guarantor-cash-flow-model-template-outline)
7. [Global DSCR Roll-Up](#global-dscr-roll-up)
8. [Commentary Requirements (Automation-Friendly)](#commentary-requirements-automation-friendly)
9. [Debt Obligation Analysis Checklist](#debt-obligation-analysis-checklist)
10. [Standardized Trend Tables & Visuals](#standardized-trend-tables--visuals)
11. [Exports & Packaging (Single PDF)](#exports--packaging-single-pdf)
12. [Audit Trail & Governance](#audit-trail--governance)
13. [Beta Path: Relationship Review](#beta-path-relationship-review)

---

## User Journey (High-Level)
**User logs in → Dashboard → New Analysis → New Request → (required inputs) → uploads Sageworks files → reviews normalized data → confirms relationship structure → enters debt schedules → adds proposed debt → runs DSCR (entity + global) → generates memo + DSCR workbook → exports single PDF package.**

**Primary output:** bank-format DSCR (entity + global) + memo sections + audit trail.

---

# Screen-by-Screen Workflow

## Login → Dashboard
**Landing elements**
- Recent analyses list (Draft / In Review / Packaged)
- **New Analysis** button
- Search (Borrower name, relationship id)

---

## New Analysis → New Request
User selects one of:
- **Relationship Review (Beta)** — minimal focus for demo
- **New Request (Primary)** — the demo workflow

> **Gate:** “New Request” starts only after required loan details are entered.

---

## Loan Details (Required Gate)
The following must be completed before moving forward to DSCR build.

### Required loan inputs
| Field | Required | Notes |
|---|---:|---|
| Loan Type | ✅ | Balloon / Term Loan (fully amortizing) / RLOC |
| Loan Amount | ✅ | Currency |
| Interest Rate | ✅ | Fixed or variable |
| Index | Conditional | WSJP +/- spread (if variable) |
| Fees (paid by borrower) | Optional | Origination, underwriting, etc. |
| Amortization | Conditional | Fully amortizing vs Interest-only window |
| Term / Maturity | ✅ | Term months and/or maturity date |

**UX expectations**
- Inline validation (numeric ranges, missing required fields)
- Interest rate + index/spread shown clearly in summary bar
- The proposed debt service calculation uses these settings

---

## Uploads: Sageworks Files (Borrower / Entities / Guarantors)
Each entity/guarantor that will be included in the global analysis requires its own Sageworks file.

### Upload requirements
| Upload Type | Required | Source | Notes |
|---|---:|---|---|
| Borrower Sageworks Export | ✅ | Sageworks | Spreads + UCA outputs |
| Supporting Related Entity Exports | As needed | Sageworks | Entities that assist with servicing debt |
| Personal Guarantor Exports | As needed | Sageworks | Personal cash flow outputs (or equivalent) |
| Use preloaded sample | Optional | Demo | Allow “Use preloaded borrower pack” |

**UX expectations**
- Upload wizard that captures: **Entity/Guarantor name**, **role**, **periods detected**
- Parser status: Success / Warning / Failed with actionable messages
- Immutable “as-of” snapshots per period

---

## Normalized Data Review
After parsing, the user reviews standardized line items and period coverage.

### Review checklist
- Periods present: **3 FYE + most recent interim/TTM** (or 3–4 FYE)
- Balance sheet ties out and totals are reasonable
- Income statement line mapping into canonical structure
- UCA / cash flow lines captured for later commentary

### Normalization review table (UI concept)
| Item | Status | Details |
|---|---|---|
| Period detection | ✅/⚠️ | Missing interim? Duplicate FY? |
| Canonical mapping coverage | ✅/⚠️ | % mapped; unmapped lines list |
| Tie-out totals | ✅/⚠️ | Show differences vs source |

---

## Relationship Structure Confirmation
User confirms which entities and guarantors roll into **global DSCR**.

### Required structure inputs
- Borrower (primary obligor)
- Supporting entities (optional)
- Guarantors (optional)
- Ownership and roll-up inclusion rules

### Relationship table (UI concept)
| Party | Type | Included in Global? | Ownership % | Notes |
|---|---|---:|---:|---|
| Borrower LLC | Entity | ✅ | 100% | Primary obligor |
| OpCo A | Entity | ✅/❌ | 80% | Supporting |
| Guarantor 1 | Individual | ✅/❌ | — | Personal cash flow + obligations |

---

## Debt Schedules + Proposed Debt Service
### Corporate debt schedules (existing)
Existing debt obligations are typically **manually entered** (source: internal schedule, statements, or borrower-provided schedule).

**Required fields (per obligation)**
- Lender / Facility type
- Original amount / current balance
- Rate type (fixed/variable) + index/spread (if applicable)
- Payment amount + amortization type
- Maturity date (balloon risk)
- Collateral + lien position (if tracked)
- Guarantees (corporate vs personal)

### Proposed debt service (new request)
System calculates proposed payment based on:
- Loan type (balloon / fully amortizing / RLOC)
- Amortization (interest-only vs amortizing)
- Rate inputs (fixed or WSJP +/-)
- Term/maturity

**Debt service output shown**
- Monthly payment
- Annual debt service used in DSCR denominator
- Pro-forma combined debt service (existing + proposed)

---

## DSCR Template Build (Entity + Global)
The system compiles:
- Parsed Sageworks spreads/UCA
- Debt schedules (corporate + personal)
- Proposed debt service
- Standardized add-backs and analyst adjustments
to produce a DSCR workbook structure with periods as columns.

### Periods convention
- Typically: **3 FYE + most recent interim/TTM**
- Alternative: **3–4 FYE** depending on file availability

### Entity DSCR template (rough format)
| Line Item | FY-3 | FY-2 | FY-1 | TTM/Interim |
|---|---:|---:|---:|---:|
| Net Income |  |  |  |  |
| + Depreciation |  |  |  |  |
| + Amortization |  |  |  |  |
| + Interest Expense |  |  |  |  |
| + Contributions Made |  |  |  |  |
| +/- Other Adjustments (editable) |  |  |  |  |
| − Distributions |  |  |  |  |
| **Cash Available for Debt Service** |  |  |  |  |
| **Annual Debt Service (Existing)** |  |  |  |  |
| **Annual Debt Service (Proposed)** |  |  |  |  |
| **Total Annual Debt Service** |  |  |  |  |
| **DSCR** |  |  |  |  |

### Supporting/related entities
Supporting entities run the **same** entity DSCR process and are included in global DSCR based on roll-up rules.

---

## Memo & Package Outputs
### Output artifacts (minimum)
1. **Summary first page**
   - Intro paragraph: purpose of request
   - Loan details summary (type, amount, pricing/index, term, fees)
2. **Background**
   - Relationship history, business overview
   - Key managers + resumes (manual input/editable)
3. **Industry risk analysis** (manual input/editable; e.g., IBISWorld)
4. **Market analysis** (manual input/editable)
5. **DSCR analysis workbook** (entity + global; includes guarantor sections if applicable)
6. **Debt schedule summary + maturity wall**
7. **Collateral analysis**
8. **Personal financial snapshot**
9. **Strengths & weaknesses summary**
10. **Audit trail extract** (or embedded references)

### Packaging
- Generate output package and allow **download as a single PDF**

---

# Inputs

## Loan request inputs
| Field | Example |
|---|---|
| Loan type | Term Loan (fully amortizing) |
| Loan amount | 500,000 |
| Rate | WSJP + 2.50% |
| Fees | 1.00% origination |
| Term | 84 months |
| Interest only | 0 months |

## Upload inputs
- Sageworks exports per entity/guarantor (Excel)
- Optional preloaded demo borrower pack

## Debt schedule inputs
- Corporate obligations (manual entry initially)
- Personal obligations (manual entry from credit report / PFS)

---

# Data Capture Requirements
## Minimum required before DSCR can run
1. Loan details complete (gate)
2. At least one borrower Sageworks file parsed successfully
3. Periods selected (FY-3, FY-2, FY-1, and TTM/interim if available)
4. Debt schedule entered (at least existing + proposed debt)

## Minimum required before Global DSCR can run
1. Relationship structure confirmed (who is included)
2. Guarantor obligations entered if guarantors included
3. Roll-up rules applied consistently (ownership / inclusion)

---

# Entity DSCR Model (Template Outline)
### Core calculation
**Cash Available for Debt Service (CADS)**  
= Net Income  
+ Depreciation  
+ Amortization  
+ Interest Expense  
+ Contributions Made  
± Other Adjustments (analyst editable)  
− Distributions

**Entity DSCR**  
= CADS / Total Annual Debt Service

### Adjustment handling
- System suggests standardized add-backs based on policy rules
- Analyst can add/edit adjustments with required rationale
- All adjustments must have an audit reference

---

# Personal Guarantor Cash Flow Model (Template Outline)
Personal guarantors should have income streams broken out and adjusted:

### Personal income categories
- Wages and Salaries
- Interest & Dividends
- Schedule C Income
- Capital Gains
- Net Rents & Royalties
- Farm Operations
- Distributions

**Total Income** = sum of categories

### Personal cash available for debt service
**Cash Available (Personal)**  
= Total Income  
− Income Taxes (from Sageworks where available)  
− Living Expenses (estimated: **30% of post-tax cash flow**)

### Personal obligations
- Manually entered (credit report and/or PFS)
- Not sourced from Sageworks (initially)

**Personal DSCR (if used)**  
= Personal Cash Available / Personal Debt Service

---

# Global DSCR Roll-Up
**Global CADS** (conceptually) includes:
- Included entity CADS (per roll-up rules)
- Included guarantor personal cash available (if guarantees are part of global view)

**Global Debt Service** includes:
- All included entity debt service (existing + proposed)
- Included personal obligations (if policy requires)

**Global DSCR**  
= Global CADS / Global Debt Service

> Global roll-up must be transparent: every included component is drill-downable to a source file, line item, or manual debt entry.

---

# Commentary Requirements (Automation-Friendly)
The memo should emphasize objective, repeatable commentary triggers. The system should support draft blocks for:

## Performance trends
- Revenue trend (YoY, CAGR, seasonality, customer concentration if available)
- Gross margin trend (compression/expansion drivers)
- EBITDA / operating margin trend
- Operating expense trend (SG&A %, absolute vs revenue growth; fixed vs variable sensitivity)
- One-time items / normalization (non-recurring add-backs and frequency)
- Earnings volatility (variance across periods; downside sensitivity)

## Cash flow & debt service capacity
- UCA / CFO trend (if using UCA framework)
- Free cash flow (CFO − capex) and sustainability
- DSCR (historical, pro-forma, stress case)
- Global DSCR (if rolled up)

## Working capital dynamics
- AR days / aging trend
- Inventory days (if applicable)
- AP days trend
- Cash conversion cycle trend

## Leverage & capital structure
- Total debt trend (absolute and relative)
- Debt-to-EBITDA trend
- Debt-to-equity trend
- Net leverage (when relevant)
- Equity trends (retained earnings, distributions, deficits)

## Liquidity & balance sheet health
- Cash balance and liquidity runway
- Current ratio / quick ratio trend
- Revolver availability (if known)
- Balance sheet composition changes
- Off-balance-sheet exposures (leases/guarantees when available)

---

# Debt Obligation Analysis Checklist
For each obligation, capture and analyze:

| Category | Fields / Questions |
|---|---|
| Facility basics | Lender, facility type, original amount, current balance |
| Pricing | Fixed vs variable; index/spread; rate sensitivity |
| Payment structure | Payment amount; amortization type; IO period |
| Maturity risk | Maturity date; balloon/refinance risk; maturity clustering |
| Collateral | Type, lien position, collateral quality |
| Covenants | Key covenants; reporting; compliance status (if tracked) |
| Guarantees | Corporate vs personal; cross-defaults (if tracked) |
| Purpose | Growth capex vs WC vs refinance |
| Concentration | Single-lender dependence; cross-collateralization |

---

# Standardized Trend Tables & Visuals
## Standardized trend table (3-year + TTM)
Recommended fields:
- Revenue
- Gross margin
- EBITDA margin / operating margin
- CFO (UCA)
- FCF (CFO − capex) where available
- DSCR (historical + pro-forma)
- Total debt
- Debt/EBITDA
- Liquidity (cash, current ratio/quick ratio)

## Debt schedule summary + maturity wall
- Total balances by year
- Balloon amounts within 12–24 months highlighted

## DSCR visuals (optional)
- Simple table or chart: historical vs pro-forma vs stressed DSCR

---

# Exports & Packaging (Single PDF)
## Output package contents
- Summary page (loan details + purpose)
- Background + management (manual)
- Industry risk analysis (manual)
- Market analysis (manual)
- DSCR workbook (entity + global)
- Global cash flow package
- Debt schedule summary + maturity wall
- Collateral analysis
- Personal financial snapshot
- Strengths/weaknesses summary
- Draft commentary blocks with triggers + required explanations
- Audit trail excerpt (or embedded references)

## Packaging rule
- **Single download** as PDF for the entire package (UI demo target)

---

# Audit Trail & Governance
## Non-negotiables
- Every adjustment/add-back has:
  - rule reference (id + policy version)
  - user + timestamp
  - impacted entity/guarantor + period
  - source linkage (file hash and line item mapping)
- Manual debt entries are audited:
  - who entered, when, and what changed

## Audit views (UI)
- Timeline by analysis
- Filter by entity/guarantor, period, rule, or field
- Diff view for overrides and edits

---

# Beta Path: Relationship Review
**Relationship Review** exists as a beta option on “New Analysis” but is not the primary demo focus.

**Intent (beta)**
- Review an existing borrower group relationship structure and historical DSCR packages
- Highlight changes since last review (ownership, debt schedule, performance)
