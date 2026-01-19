Problem
Community-bank credit teams waste time and introduce error risk by re-keying borrower financials across tools. Analysts spread tax returns and statements in Abrigo/Sageworks, export Excel outputs, then manually reformat and reconcile those numbers into bank-specific DSCR templates and credit memo packages. “Global” underwriting is especially slow and inconsistent because relationships often involve multiple operating entities, multiple guarantors, personal 1040-based cash flow, and external debt schedules that sit outside Sageworks. As a result, add-backs, normalization adjustments, and required narrative commentary vary by analyst, creating inconsistency, rework, and weaker auditability.
Solution
The SaaS is an “Underwriting Automation Layer” that sits between Sageworks exports and a bank’s internal templates. It ingests Sageworks Excel outputs (spreads and UCA), external debt schedules (business and personal), proposed new debt terms, and a bank-specific policy configuration (DSCR methodology, add-back rules, required commentary triggers, and memo formatting). It then normalizes financial line items into a canonical structure, models relationship ownership and roll-up rules, applies deterministic and overrideable adjustment logic, calculates entity and global debt service, and produces standardized outputs: a bank-format DSCR workbook (entity and global), a global cash flow package (including personal cash flow and obligations), and memo-ready narrative blocks clearly labeled as analyst-review drafts—each backed by an audit trail.
How it solves the problem
By automating the translation from Sageworks outputs into the bank’s standard DSCR and credit package, the system removes repetitive manual formatting and reduces reconciliation errors. Bank-configurable rules enforce consistent add-backs and required narrative sections, while the global cash flow engine consolidates multiple entities and guarantors into a transparent, explainable global DSCR view. Audit trails tie every adjustment to a rule reference, user, and timestamp, improving defensibility and control. The net effect is faster underwriting cycle times, fewer credit admin returns, higher consistency across analysts, and improved risk governance without positioning the system as a credit decision model.
Target users
Credit analysts, underwriters, portfolio managers, credit admin at community banks using Sageworks/Abrigo and internal Excel/Word memo templates.
A “translation + automation” layer that takes Sageworks outputs and bank-specific inputs, then produces a standardized DSCR + global cash flow + memo-ready package with audit trails.

Inputs
Sageworks export (Excel) for each entity/guarantor:
Spreads: Balance Sheet / Income Statement
UCA (uniform cash analysis) outputs
External debt schedules (entity + personal)
Proposed new debt terms (for requested new money)
Bank policy config (rules and templates):
Add-back standards, normalization rules
Required commentary triggers, and possible policy exceptions. 
DSCR methodology and memo format mapping
Relationship structure
Multiple operating companies
Multiple guarantors
Ownership and which entities roll into “global”
Outputs
Bank-standard DSCR workbook (entity DSCR + global DSCR)
Global cash flow package including:
Operating cash flow (from UCA/spreads)
Existing debt service (from debt schedule)
Proposed debt service (scenario)
Personal cash flow + personal debt obligations
Consolidation across multiple companies + guarantors
Memo-ready narrative blocks (not “AI opinions”):
Auto-generated commentary based on rules + historical performance trends
Variance explanations prompts (YoY revenue/EBITDA margin/LC changes, etc.)
Audit trail:
Every adjustment/add-back has a rule reference + user + timestamp

4) Core modules (for your dev)
A) Ingestion & normalization
Parse Sageworks Excel reliably (structured extraction)
Normalize line items to a canonical chart of accounts
Create “as-of” snapshots per statement period (auditability)
B) Relationship / global cash flow engine
Data model:
BorrowerGroup (relationship)
Entity (operating company)
Guarantor (individual)
FinancialPeriod (year/TTM)
DebtObligation (existing + proposed)
Roll-up logic:
Entity cash flow + entity debt service
Guarantor cash flow + personal debt service
Consolidate into global DSCR
C) Adjustments & add-backs rules engine (the “hours saved” lever)
Bank-configurable rule sets, e.g.:
Non-recurring expenses
Owner compensation normalization
One-time legal/insurance events
Rent normalization / related-party adjustments
Rules should be:
Deterministic, explainable, and overrideable
Output an “adjustment schedule” automatically
D) Debt service engine
Existing debt schedule ingestion:
Import from Excel/CSV
Standard fields: balance, rate, term, payment, maturity, amortization type
Proposed debt:
User inputs terms, system calculates payment
DSCR computation:
Make method configurable (bank-specific)
E) Memo commentary generator (keep it compliant)
NOT a “credit decision model.”
It generates:
Standard narrative sections and trend commentary based on thresholds:
“Revenue decreased >10% YoY” → required explanation prompt
“DSCR < policy minimum” → exception language template
“LC deteriorated” → liquidity commentary template
Outputs should be labeled:
“Draft commentary for analyst review”


