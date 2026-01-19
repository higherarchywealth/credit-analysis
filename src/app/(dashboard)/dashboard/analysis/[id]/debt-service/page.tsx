'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowRight, Plus, TrendingUp, TrendingDown, CheckCircle, AlertCircle } from 'lucide-react';
import { demoBorrowerGroup, mockGlobalDSCR } from '@/data';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export default function DebtServicePage({ params }: { params: { id: string } }) {
  const [proposedLoan, setProposedLoan] = useState({
    amount: 500000,
    rate: 7.5,
    term: 84,
    payment: 7648,
  });

  // Combine all debts from entities
  const allDebts = demoBorrowerGroup.entities.flatMap((entity) =>
    entity.debts.map((debt) => ({ ...debt, entityName: entity.name }))
  );

  const personalDebts = demoBorrowerGroup.guarantors.flatMap((g) =>
    g.personalDebt.map((debt) => ({ ...debt, entityName: g.name }))
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div>
          <h1 className="text-lg font-semibold">Debt Schedule & DSCR</h1>
          <p className="text-sm text-muted-foreground">
            Review existing debt, add proposed loans, and calculate DSCR
          </p>
        </div>
        <Link href={`/dashboard/analysis/${params.id}/memo`}>
          <Button>
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <Tabs defaultValue="existing">
          <TabsList className="mb-6">
            <TabsTrigger value="existing">Existing Debt</TabsTrigger>
            <TabsTrigger value="proposed">Proposed Debt</TabsTrigger>
            <TabsTrigger value="dscr">DSCR Calculation</TabsTrigger>
          </TabsList>

          {/* Existing Debt Tab */}
          <TabsContent value="existing" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Entity Debt Obligations</CardTitle>
                    <CardDescription>Current debt for operating entities</CardDescription>
                  </div>
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Debt
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Entity</TableHead>
                      <TableHead>Lender</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                      <TableHead className="text-right">Rate</TableHead>
                      <TableHead className="text-right">Monthly Payment</TableHead>
                      <TableHead>Maturity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allDebts.map((debt) => (
                      <TableRow key={debt.id}>
                        <TableCell className="font-medium">{debt.entityName}</TableCell>
                        <TableCell>{debt.lender}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {debt.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {formatCurrency(debt.currentBalance)}
                        </TableCell>
                        <TableCell className="text-right">{debt.interestRate}%</TableCell>
                        <TableCell className="text-right font-mono">
                          {formatCurrency(debt.monthlyPayment)}
                        </TableCell>
                        <TableCell>{new Date(debt.maturityDate).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Personal Debt Obligations</CardTitle>
                <CardDescription>Guarantor personal debt</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Guarantor</TableHead>
                      <TableHead>Lender</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                      <TableHead className="text-right">Rate</TableHead>
                      <TableHead className="text-right">Monthly Payment</TableHead>
                      <TableHead>Maturity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {personalDebts.map((debt) => (
                      <TableRow key={debt.id}>
                        <TableCell className="font-medium">{debt.entityName}</TableCell>
                        <TableCell>{debt.lender}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {debt.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {formatCurrency(debt.currentBalance)}
                        </TableCell>
                        <TableCell className="text-right">{debt.interestRate}%</TableCell>
                        <TableCell className="text-right font-mono">
                          {formatCurrency(debt.monthlyPayment)}
                        </TableCell>
                        <TableCell>{new Date(debt.maturityDate).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Proposed Debt Tab */}
          <TabsContent value="proposed" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Proposed New Financing</CardTitle>
                <CardDescription>
                  Enter the terms of the proposed loan to model impact on DSCR
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-2">
                    <Label htmlFor="loan-amount">Loan Amount</Label>
                    <Input
                      id="loan-amount"
                      type="number"
                      value={proposedLoan.amount}
                      onChange={(e) =>
                        setProposedLoan({ ...proposedLoan, amount: Number(e.target.value) })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="interest-rate">Interest Rate (%)</Label>
                    <Input
                      id="interest-rate"
                      type="number"
                      step="0.125"
                      value={proposedLoan.rate}
                      onChange={(e) =>
                        setProposedLoan({ ...proposedLoan, rate: Number(e.target.value) })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="term">Term (months)</Label>
                    <Input
                      id="term"
                      type="number"
                      value={proposedLoan.term}
                      onChange={(e) =>
                        setProposedLoan({ ...proposedLoan, term: Number(e.target.value) })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Calculated Payment</Label>
                    <div className="flex h-9 items-center rounded-md border bg-muted px-3 font-mono">
                      {formatCurrency(proposedLoan.payment)}/mo
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-lg border bg-muted/50 p-4">
                  <h4 className="font-medium">Impact Analysis</h4>
                  <div className="mt-3 grid gap-4 md:grid-cols-3">
                    <div>
                      <div className="text-sm text-muted-foreground">Current Global DSCR</div>
                      <div className="text-2xl font-bold">1.40x</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Pro Forma DSCR</div>
                      <div className="text-2xl font-bold text-yellow-600">1.28x</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Change</div>
                      <div className="flex items-center text-2xl font-bold text-red-600">
                        <TrendingDown className="mr-1 h-5 w-5" />
                        -0.12x
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* DSCR Tab */}
          <TabsContent value="dscr" className="space-y-6">
            {/* Global DSCR Card */}
            <Card className="border-2 border-green-500">
              <CardHeader className="bg-green-50 dark:bg-green-950/20">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      Global DSCR
                    </CardTitle>
                    <CardDescription>Combined debt service coverage ratio</CardDescription>
                  </div>
                  <Badge className="bg-green-600 text-lg px-4 py-1">PASS</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid gap-6 md:grid-cols-4">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Combined Cash Flow</div>
                    <div className="text-2xl font-bold">
                      {formatCurrency(mockGlobalDSCR.combinedCashFlow)}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Total Debt Service</div>
                    <div className="text-2xl font-bold">
                      {formatCurrency(mockGlobalDSCR.totalDebtService)}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Global DSCR</div>
                    <div className="text-3xl font-bold text-green-600">
                      {mockGlobalDSCR.globalDSCR.toFixed(2)}x
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Policy Minimum</div>
                    <div className="text-2xl font-bold">{mockGlobalDSCR.policyMinimum}x</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Entity Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Entity-Level DSCR Breakdown</CardTitle>
                <CardDescription>Individual coverage ratios by entity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {mockGlobalDSCR.entityBreakdown.map((entity) => (
                    <div
                      key={entity.entityId}
                      className={`rounded-lg border p-4 ${
                        entity.status === 'pass'
                          ? 'border-green-200 bg-green-50 dark:bg-green-950/20'
                          : entity.status === 'fail'
                          ? 'border-red-200 bg-red-50 dark:bg-red-950/20'
                          : 'border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{entity.entityName}</h4>
                        <Badge
                          variant={
                            entity.status === 'pass'
                              ? 'default'
                              : entity.status === 'fail'
                              ? 'destructive'
                              : 'secondary'
                          }
                        >
                          {entity.status.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Cash Flow</div>
                          <div className="font-mono font-medium">
                            {formatCurrency(entity.cashFlow)}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Debt Service</div>
                          <div className="font-mono font-medium">
                            {formatCurrency(entity.debtService)}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">DSCR</div>
                          <div
                            className={`text-lg font-bold ${
                              entity.status === 'pass'
                                ? 'text-green-600'
                                : entity.status === 'fail'
                                ? 'text-red-600'
                                : 'text-yellow-600'
                            }`}
                          >
                            {entity.dscr.toFixed(2)}x
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
