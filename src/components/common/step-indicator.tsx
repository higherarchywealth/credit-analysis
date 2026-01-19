'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface Step {
  id: string;
  name: string;
  href: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  analysisId: string;
}

export function StepIndicator({ steps, currentStep, analysisId }: StepIndicatorProps) {
  return (
    <nav aria-label="Progress" className="px-6 py-4 border-b bg-card">
      <ol className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isComplete = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <li key={step.id} className="flex items-center">
              <Link
                href={step.href.replace('[id]', analysisId)}
                className={cn(
                  'flex items-center gap-2 text-sm font-medium transition-colors',
                  isComplete && 'text-primary',
                  isCurrent && 'text-foreground',
                  !isComplete && !isCurrent && 'text-muted-foreground hover:text-foreground'
                )}
              >
                <span
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold',
                    isComplete && 'border-primary bg-primary text-primary-foreground',
                    isCurrent && 'border-primary text-primary',
                    !isComplete && !isCurrent && 'border-muted-foreground/50'
                  )}
                >
                  {isComplete ? <Check className="h-4 w-4" /> : index + 1}
                </span>
                <span className="hidden md:inline">{step.name}</span>
              </Link>

              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'mx-4 h-0.5 w-12 lg:w-24',
                    index < currentStep ? 'bg-primary' : 'bg-muted'
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export const analysisSteps: Step[] = [
  { id: 'review', name: 'Data Review', href: '/dashboard/analysis/[id]/review' },
  { id: 'adjustments', name: 'Adjustments', href: '/dashboard/analysis/[id]/adjustments' },
  { id: 'relationship', name: 'Relationship', href: '/dashboard/analysis/[id]/relationship' },
  { id: 'debt-service', name: 'Debt & DSCR', href: '/dashboard/analysis/[id]/debt-service' },
  { id: 'memo', name: 'Memo', href: '/dashboard/analysis/[id]/memo' },
  { id: 'output', name: 'Output', href: '/dashboard/analysis/[id]/output' },
];
