'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import { demoBorrowerGroup } from '@/data';

// Install select component
// npx shadcn@latest add select

interface LineItemMapping {
  id: string;
  sageworksLabel: string;
  canonicalLabel: string;
  value: number;
  confidence: 'high' | 'medium' | 'low';
  flagged: boolean;
}

const balanceSheetMappings: LineItemMapping[] = [
  { id: '1', sageworksLabel: 'Cash & Equivalents', canonicalLabel: 'Cash', value: 245000, confidence: 'high', flagged: false },
  { id: '2', sageworksLabel: 'Trade Receivables', canonicalLabel: 'Accounts Receivable', value: 520000, confidence: 'high', flagged: false },
  { id: '3', sageworksLabel: 'Inventory - Raw Materials', canonicalLabel: 'Inventory', value: 380000, confidence: 'high', flagged: false },
  { id: '4', sageworksLabel: 'Prepaid Expenses', canonicalLabel: 'Other Current Assets', value: 45000, confidence: 'medium', flagged: true },
  { id: '5', sageworksLabel: 'Property & Equipment', canonicalLabel: 'Fixed Assets', value: 1850000, confidence: 'high', flagged: false },
  { id: '6', sageworksLabel: 'Accum Depreciation', canonicalLabel: 'Accumulated Depreciation', value: -620000, confidence: 'high', flagged: false },
  { id: '7', sageworksLabel: 'Goodwill & Intangibles', canonicalLabel: 'Other Assets', value: 85000, confidence: 'low', flagged: true },
];

const incomeStatementMappings: LineItemMapping[] = [
  { id: '8', sageworksLabel: 'Net Sales', canonicalLabel: 'Revenue', value: 4250000, confidence: 'high', flagged: false },
  { id: '9', sageworksLabel: 'Cost of Sales', canonicalLabel: 'Cost of Goods Sold', value: 2890000, confidence: 'high', flagged: false },
  { id: '10', sageworksLabel: 'Officer Compensation', canonicalLabel: 'Officer Compensation', value: 180000, confidence: 'high', flagged: false },
  { id: '11', sageworksLabel: 'Depreciation Expense', canonicalLabel: 'Depreciation', value: 145000, confidence: 'high', flagged: false },
  { id: '12', sageworksLabel: 'Legal & Professional', canonicalLabel: 'Operating Expenses', value: 85000, confidence: 'medium', flagged: true },
  { id: '13', sageworksLabel: 'Interest Expense', canonicalLabel: 'Interest Expense', value: 68000, confidence: 'high', flagged: false },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export default function DataReviewPage({ params }: { params: { id: string } }) {
  const [selectedPeriod, setSelectedPeriod] = useState('2023');
  const entity = demoBorrowerGroup.entities[0];

  const renderMappingTable = (mappings: LineItemMapping[]) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-8"></TableHead>
          <TableHead>Sageworks Label</TableHead>
          <TableHead>
            <ArrowRight className="h-4 w-4" />
          </TableHead>
          <TableHead>Normalized Label</TableHead>
          <TableHead className="text-right">Value</TableHead>
          <TableHead>Confidence</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {mappings.map((item) => (
          <TableRow key={item.id} className={item.flagged ? 'bg-yellow-50 dark:bg-yellow-950/20' : ''}>
            <TableCell>
              {item.flagged ? (
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
              ) : (
                <CheckCircle className="h-4 w-4 text-green-600" />
              )}
            </TableCell>
            <TableCell className="font-mono text-sm">{item.sageworksLabel}</TableCell>
            <TableCell>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </TableCell>
            <TableCell className="font-medium">{item.canonicalLabel}</TableCell>
            <TableCell className="text-right font-mono">
              {formatCurrency(item.value)}
            </TableCell>
            <TableCell>
              <Badge
                variant={
                  item.confidence === 'high'
                    ? 'default'
                    : item.confidence === 'medium'
                    ? 'secondary'
                    : 'destructive'
                }
              >
                {item.confidence}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div>
          <h1 className="text-lg font-semibold">Data Review & Normalization</h1>
          <p className="text-sm text-muted-foreground">
            Review and confirm line item mappings for {entity.name}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2023">FY 2023</SelectItem>
              <SelectItem value="2022">FY 2022</SelectItem>
              <SelectItem value="ttm">TTM</SelectItem>
            </SelectContent>
          </Select>
          <Link href={`/dashboard/analysis/${params.id}/adjustments`}>
            <Button>
              Approve & Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid gap-6 lg:grid-cols-4">
          {/* Summary Cards */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Line Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Auto-Mapped</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">148</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Needs Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">8</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Confidence</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">95%</div>
            </CardContent>
          </Card>
        </div>

        {/* Mapping Tables */}
        <Card className="mt-6">
          <Tabs defaultValue="balance-sheet">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Line Item Mappings</CardTitle>
                <TabsList>
                  <TabsTrigger value="balance-sheet">Balance Sheet</TabsTrigger>
                  <TabsTrigger value="income-statement">Income Statement</TabsTrigger>
                  <TabsTrigger value="cash-flow">Cash Flow</TabsTrigger>
                </TabsList>
              </div>
              <CardDescription>
                Yellow rows require analyst review. Click to edit mappings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TabsContent value="balance-sheet" className="mt-0">
                {renderMappingTable(balanceSheetMappings)}
              </TabsContent>
              <TabsContent value="income-statement" className="mt-0">
                {renderMappingTable(incomeStatementMappings)}
              </TabsContent>
              <TabsContent value="cash-flow" className="mt-0">
                <div className="flex items-center justify-center py-12 text-muted-foreground">
                  Cash flow mappings would appear here
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
