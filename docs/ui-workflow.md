# Demo UI - Full Workflow

## User Flow Overview

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│   Upload    │ → │  Review &    │ → │ Relationship │ → │   Debt &     │ → │   Output    │
│   Files     │    │  Normalize   │    │   Setup      │    │   DSCR       │    │  Generation │
└─────────────┘    └──────────────┘    └─────────────┘    └──────────────┘    └─────────────┘
```

---

## Screen-by-Screen Breakdown

### 1. Dashboard (Home)

**Route:** `/dashboard`

**Purpose:** Overview of all borrower relationships/deals in progress

**Components:**
- Stats cards (Active deals, Pending review, Completed this month)
- Recent activity feed
- Quick actions (New Analysis, Continue Draft)
- Table of borrower groups with status

**Mock Data:**
- 5-8 sample borrower groups at various stages

---

### 2. New Analysis - File Upload

**Route:** `/dashboard/analysis/new`

**Purpose:** Upload Sageworks exports and debt schedules

**Components:**
- Drag-and-drop file upload zone
- File type selector (Sageworks Spreads, UCA, Debt Schedule)
- Upload queue showing files with status
- "Continue" button when files ready

**Demo Behavior:**
- Accept file drop → show "processing" → auto-advance
- Pre-loaded sample files option for quick demo

---

### 3. Data Review & Normalization

**Route:** `/dashboard/analysis/[id]/review`

**Purpose:** Review parsed financials, fix mapping issues

**Components:**
- Side-by-side view: Original (Sageworks) → Normalized (Canonical)
- Line item mapping table with confidence indicators
- Flagged items requiring review (yellow/red highlights)
- Period selector (FY2022, FY2023, TTM)
- "Approve & Continue" button

**Tabs:**
- Balance Sheet
- Income Statement
- Cash Flow (UCA)

**Mock Data:**
- Sample company with 3 years of financials
- A few intentionally "flagged" items to show review workflow

---

### 4. Adjustments & Add-backs

**Route:** `/dashboard/analysis/[id]/adjustments`

**Purpose:** Apply and review normalization adjustments

**Components:**
- Adjustment categories accordion:
  - Non-recurring expenses
  - Owner compensation normalization
  - Related party adjustments
  - One-time events
- Each adjustment shows:
  - Rule that triggered it
  - Original value → Adjusted value
  - Override toggle + reason field
- Running total: "Net Adjustments: +$X to EBITDA"
- Adjustment audit log preview

**Mock Data:**
- 5-6 sample adjustments auto-applied
- 2-3 requiring analyst decision

---

### 5. Relationship Structure

**Route:** `/dashboard/analysis/[id]/relationship`

**Purpose:** Define borrower group, entities, guarantors, ownership

**Components:**
- Visual org chart / tree diagram:
  ```
  Borrower Group: "Smith Holdings"
  ├── Entity: Smith Manufacturing LLC (100%)
  ├── Entity: Smith Properties LLC (100%)
  └── Guarantor: John Smith (Personal)
  ```
- Add/edit entity modal
- Add/edit guarantor modal
- Ownership percentage inputs
- "Include in Global DSCR" toggles
- Roll-up configuration

**Mock Data:**
- Pre-built relationship with 2 operating companies + 1 guarantor

---

### 6. Debt Schedule & DSCR

**Route:** `/dashboard/analysis/[id]/debt-service`

**Purpose:** Review existing debt, add proposed debt, calculate DSCR

**Tabs:**

#### 6a. Existing Debt
- Table of current obligations per entity:
  | Lender | Type | Balance | Rate | Payment | Maturity |
- Personal debt obligations (guarantor)
- Import from file or manual entry

#### 6b. Proposed Debt
- Form to add new loan request:
  - Amount, Rate, Term, Amortization
  - Auto-calculate payment
- Scenario comparison (with/without new debt)

#### 6c. DSCR Calculation
- Entity-level DSCR cards
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
- Sensitivity analysis toggle (stress test)

**Mock Data:**
- 3-4 existing loans across entities
- 1 proposed new loan
- Calculated DSCR values

---

### 7. Memo & Commentary

**Route:** `/dashboard/analysis/[id]/memo`

**Purpose:** Review auto-generated narrative, edit, finalize

**Components:**
- Section-by-section memo builder:
  - Business Overview
  - Financial Performance (auto-generated trends)
  - Global Cash Flow Summary
  - DSCR Analysis
  - Policy Exceptions (if any)
  - Recommendation (template)
- Each section shows:
  - "Draft - Analyst Review Required" badge
  - Edit in place
  - "Regenerate" button
- Variance callouts:
  - "Revenue decreased 12% YoY" → explanation prompt
  - "DSCR below 1.25x" → exception language inserted

**Mock Data:**
- Pre-generated commentary with placeholders
- Sample variance triggers

---

### 8. Output Generation

**Route:** `/dashboard/analysis/[id]/output`

**Purpose:** Generate and download final package

**Components:**
- Output checklist:
  - [ ] DSCR Workbook (Excel)
  - [ ] Global Cash Flow Package (Excel)
  - [ ] Credit Memo (Word/PDF)
  - [ ] Audit Trail Report (PDF)
- Preview panels for each output
- "Generate All" button
- Download individual or ZIP

**Demo Behavior:**
- Simulate generation (progress bar)
- Provide sample downloadable files

---

### 9. Audit Trail

**Route:** `/dashboard/analysis/[id]/audit`

**Purpose:** Full history of all changes

**Components:**
- Timeline of all actions:
  - File uploaded
  - Adjustment applied (rule: X, user: Y)
  - Adjustment overridden (reason: Z)
  - DSCR calculated
  - Memo generated
- Filter by: date, user, action type
- Export audit log

---

## Supporting Screens

### Settings / Bank Policy Config

**Route:** `/dashboard/settings`

**Tabs:**
- **DSCR Methodology:** Configure calculation method
- **Add-back Rules:** Manage adjustment rules
- **Memo Templates:** Section templates and triggers
- **Users & Permissions:** Team management

---

### Auth Screens (Simple)

- `/login` - Simple login form
- `/register` - Registration form (optional for demo)

---

## Navigation Structure

```
Sidebar:
├── Dashboard (home)
├── Analyses (list of all deals)
├── Clients (borrower groups)
├── Reports
└── Settings
    ├── DSCR Config
    ├── Add-back Rules
    ├── Memo Templates
    └── Team
```

---

## Component Library Needs

| Component | Usage |
|-----------|-------|
| DataTable | Financial statements, debt schedules, audit logs |
| FileUpload | Drag-drop upload zone |
| OrgChart | Relationship visualization |
| StatCard | Dashboard metrics |
| StepWizard | Multi-step analysis flow |
| AdjustmentCard | Individual adjustment review |
| DSCRGauge | Visual DSCR indicator |
| MemoEditor | Rich text with sections |
| AuditTimeline | Chronological activity log |

---

## Demo Flow (Happy Path)

1. User logs in → lands on Dashboard
2. Clicks "New Analysis"
3. Uploads sample Sageworks file (or uses pre-loaded)
4. Reviews normalized data → approves
5. Reviews auto-applied adjustments → overrides one
6. Confirms relationship structure
7. Reviews debt schedule → adds proposed loan
8. Views DSCR calculation (passing)
9. Reviews generated memo → edits one section
10. Generates output package → downloads

**Total screens in flow: 8 steps**
**Estimated demo time: 3-5 minutes**
