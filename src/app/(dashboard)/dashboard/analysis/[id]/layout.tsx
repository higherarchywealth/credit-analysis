'use client';

import { use } from 'react';
import { usePathname } from 'next/navigation';
import { StepIndicator, analysisSteps } from '@/components/common';

export default function AnalysisLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const pathname = usePathname();

  // Determine current step from pathname
  const currentStepIndex = analysisSteps.findIndex((step) =>
    pathname.includes(step.id)
  );

  return (
    <div className="flex flex-col h-full">
      <StepIndicator
        steps={analysisSteps}
        currentStep={currentStepIndex >= 0 ? currentStepIndex : 0}
        analysisId={resolvedParams.id}
      />
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
