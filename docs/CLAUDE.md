# Claude Code Guidelines - Credit Analysis Demo UI

## Project Overview

This is a **DEMO UI** for a credit analysis application. All data is mocked - **NO real API calls**.

---

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **State:** Zustand (if needed)
- **Components:** Shadcn/ui

---

## Project Structure

```
src/
├── app/                        # Next.js App Router
│   ├── (auth)/                # Auth route group
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/           # Dashboard route group
│   │   ├── analytics/
│   │   ├── clients/
│   │   ├── reports/
│   │   └── settings/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
│
├── components/                 # Shared components
│   ├── ui/                    # Shadcn/ui primitives
│   ├── layout/                # Layout components (Header, Sidebar, Footer)
│   └── common/                # Reusable business components
│
├── features/                   # Feature modules
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── types/
│   │   └── index.ts
│   ├── credit-score/
│   ├── clients/
│   └── reports/
│
├── lib/                        # Utilities and configs
│   ├── utils.ts               # Helper functions
│   └── constants.ts           # App constants
│
├── hooks/                      # Shared custom hooks
│
├── types/                      # Global TypeScript types
│
└── data/                       # MOCK DATA (NO API)
    ├── clients.ts
    ├── credit-scores.ts
    ├── reports.ts
    └── users.ts
```

---

## Critical Rules

### 1. NO API CALLS - DEMO ONLY

```typescript
// WRONG - Do not do this
const response = await fetch('/api/clients');

// CORRECT - Use mock data
import { mockClients } from '@/data/clients';
const clients = mockClients;
```

### 2. Mock Data Location

All mock data lives in `src/data/`. Each file exports typed mock data:

```typescript
// src/data/clients.ts
import { Client } from '@/types';

export const mockClients: Client[] = [
  {
    id: '1',
    name: 'Acme Corporation',
    creditScore: 750,
    status: 'approved',
    // ...
  },
];
```

### 3. Simulate Loading States

Use `setTimeout` or `useState` to simulate async behavior for realistic UX:

```typescript
const [loading, setLoading] = useState(true);

useEffect(() => {
  // Simulate network delay
  const timer = setTimeout(() => {
    setData(mockData);
    setLoading(false);
  }, 500);
  return () => clearTimeout(timer);
}, []);
```

### 4. Feature Isolation

Features do NOT import from other features. Only from:
- `@/components/*` (shared components)
- `@/lib/*` (utilities)
- `@/types/*` (global types)
- `@/data/*` (mock data)
- `@/hooks/*` (shared hooks)

```typescript
// WRONG
import { something } from '@/features/auth';

// CORRECT - lift shared code to components/ or lib/
import { something } from '@/components/common';
```

### 5. Path Aliases

Always use path aliases, never relative imports beyond one level:

```typescript
// WRONG
import { Button } from '../../../components/ui/button';

// CORRECT
import { Button } from '@/components/ui/button';
```

---

## Component Guidelines

### File Naming

- Components: `PascalCase.tsx` (e.g., `CreditScoreCard.tsx`)
- Hooks: `use-kebab-case.ts` (e.g., `use-credit-score.ts`)
- Utils: `kebab-case.ts` (e.g., `format-currency.ts`)
- Types: `kebab-case.ts` or `types.ts`

### Component Structure

```typescript
// Component template
import { type FC } from 'react';

interface Props {
  // props here
}

export const ComponentName: FC<Props> = ({ prop1, prop2 }) => {
  return (
    <div>
      {/* JSX */}
    </div>
  );
};
```

### Exports

Use named exports, not default exports:

```typescript
// WRONG
export default function Component() {}

// CORRECT
export function Component() {}
// or
export const Component: FC = () => {};
```

---

## Styling Rules

1. Use Tailwind CSS utility classes
2. Use `cn()` helper for conditional classes (from shadcn)
3. No inline styles
4. No CSS modules (use Tailwind)

```typescript
import { cn } from '@/lib/utils';

<div className={cn(
  'rounded-lg border p-4',
  isActive && 'border-primary bg-primary/10'
)} />
```

---

## TypeScript Rules

1. No `any` - use `unknown` if type is truly unknown
2. Define interfaces for all props
3. Define types for all mock data
4. Use strict mode

```typescript
// src/types/client.ts
export interface Client {
  id: string;
  name: string;
  email: string;
  creditScore: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}
```

---

## Mock Data Templates

### Client Data

```typescript
export const mockClients: Client[] = [
  {
    id: '1',
    name: 'Acme Corporation',
    email: 'contact@acme.com',
    creditScore: 750,
    status: 'approved',
    createdAt: '2024-01-15',
  },
  // Add 5-10 realistic entries
];
```

### Credit Score Data

```typescript
export const mockCreditScores: CreditScore[] = [
  {
    clientId: '1',
    score: 750,
    factors: {
      paymentHistory: 95,
      creditUtilization: 30,
      creditAge: 8,
      accountMix: 4,
      recentInquiries: 2,
    },
    lastUpdated: '2024-01-20',
  },
];
```

---

## Do NOT

- Make real API calls
- Use `fetch()` or `axios`
- Connect to databases
- Use environment variables for API keys
- Implement real authentication

## DO

- Use mock data from `src/data/`
- Simulate loading/error states
- Build complete UI flows
- Make it look production-ready
- Use realistic dummy data

---

## Quick Reference

| Task | Location |
|------|----------|
| Add new page | `src/app/(group)/page-name/page.tsx` |
| Add shared component | `src/components/common/` |
| Add UI primitive | `src/components/ui/` |
| Add feature component | `src/features/[feature]/components/` |
| Add mock data | `src/data/` |
| Add global type | `src/types/` |
| Add utility function | `src/lib/utils.ts` |
