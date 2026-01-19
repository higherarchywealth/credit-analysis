'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ArrowRight, Check, X, Edit2, Info } from 'lucide-react';
import { mockAdjustments, getAdjustmentSummary } from '@/data';
import { Adjustment, AdjustmentCategory } from '@/types';

const categoryLabels: Record<AdjustmentCategory, string> = {
  'non-recurring': 'Non-Recurring Expenses',
  'owner-compensation': 'Owner Compensation',
  'related-party': 'Related Party Transactions',
  'one-time': 'One-Time Events',
  'rent-normalization': 'Rent Normalization',
  other: 'Other Adjustments',
};

const formatCurrency = (value: number) => {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.abs(value));
  return value < 0 ? `(${formatted})` : formatted;
};

function AdjustmentCard({ adjustment }: { adjustment: Adjustment }) {
  const [isOverridden, setIsOverridden] = useState(adjustment.isOverridden);
  const [overrideReason, setOverrideReason] = useState(adjustment.overrideReason || '');
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className={`rounded-lg border p-4 ${isOverridden ? 'bg-muted/50' : ''}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-medium">{adjustment.description}</h4>
            {isOverridden && (
              <Badge variant="outline" className="text-xs">
                Overridden
              </Badge>
            )}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{adjustment.rule}</p>

          <div className="mt-3 flex items-center gap-6 text-sm">
            <div>
              <span className="text-muted-foreground">Original: </span>
              <span className="font-mono">{formatCurrency(adjustment.originalValue)}</span>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <div>
              <span className="text-muted-foreground">Adjusted: </span>
              <span className="font-mono">{formatCurrency(adjustment.adjustedValue)}</span>
            </div>
            <div className={adjustment.impact >= 0 ? 'text-green-600' : 'text-red-600'}>
              <span className="font-medium">
                Impact: {adjustment.impact >= 0 ? '+' : ''}
                {formatCurrency(adjustment.impact)}
              </span>
            </div>
          </div>

          {isOverridden && overrideReason && (
            <div className="mt-3 rounded bg-muted p-2 text-sm">
              <span className="font-medium">Override Reason: </span>
              {overrideReason}
            </div>
          )}
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Edit2 className="mr-2 h-3 w-3" />
              {isOverridden ? 'Edit Override' : 'Override'}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Override Adjustment</DialogTitle>
              <DialogDescription>
                Provide a reason for overriding this adjustment. This will be recorded in the audit
                trail.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="rounded-lg bg-muted p-3">
                <p className="text-sm font-medium">{adjustment.description}</p>
                <p className="text-xs text-muted-foreground">{adjustment.rule}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">Override Reason</Label>
                <Textarea
                  id="reason"
                  placeholder="Enter your justification for overriding this adjustment..."
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setIsOverridden(true);
                  setDialogOpen(false);
                }}
              >
                Confirm Override
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default function AdjustmentsPage({ params }: { params: { id: string } }) {
  const summary = getAdjustmentSummary(mockAdjustments);

  // Group adjustments by category
  const groupedAdjustments = mockAdjustments.reduce(
    (acc, adj) => {
      if (!acc[adj.category]) acc[adj.category] = [];
      acc[adj.category].push(adj);
      return acc;
    },
    {} as Record<AdjustmentCategory, Adjustment[]>
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div>
          <h1 className="text-lg font-semibold">Adjustments & Add-backs</h1>
          <p className="text-sm text-muted-foreground">
            Review and override auto-applied normalization adjustments
          </p>
        </div>
        <Link href={`/dashboard/analysis/${params.id}/relationship`}>
          <Button>
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Adjustments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.count}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Net Impact to EBITDA</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${summary.totalImpact >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {summary.totalImpact >= 0 ? '+' : ''}
                {formatCurrency(summary.totalImpact)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Overridden</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.overriddenCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{summary.pendingReview}</div>
            </CardContent>
          </Card>
        </div>

        {/* Adjustment Categories */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Adjustment Schedule</CardTitle>
            <CardDescription>
              Adjustments are auto-applied based on bank policy rules. Override with justification as
              needed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" defaultValue={Object.keys(groupedAdjustments)}>
              {Object.entries(groupedAdjustments).map(([category, adjustments]) => (
                <AccordionItem key={category} value={category}>
                  <AccordionTrigger>
                    <div className="flex items-center gap-3">
                      <span>{categoryLabels[category as AdjustmentCategory]}</span>
                      <Badge variant="secondary">{adjustments.length}</Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 pt-2">
                      {adjustments.map((adj) => (
                        <AdjustmentCard key={adj.id} adjustment={adj} />
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
