'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { Separator } from '@/components/ui/separator';
import {
  FileSpreadsheet,
  FileText,
  Download,
  CheckCircle,
  Loader2,
  Package,
  Eye,
  X,
  Printer,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface OutputFile {
  id: string;
  name: string;
  type: 'excel' | 'word' | 'pdf';
  description: string;
  status: 'pending' | 'generating' | 'complete';
  selected: boolean;
}

// Mock data for the PDF preview
const mockMemoData = {
  bankName: 'First Community Bank',
  borrower: 'ABC Manufacturing Group',
  loanAmount: '$2,500,000',
  loanPurpose: 'Working Capital & Equipment',
  requestDate: 'January 15, 2026',
  analyst: 'Sarah Johnson',
  entities: [
    { name: 'ABC Manufacturing LLC', type: 'Operating Company', dscr: 1.45 },
    { name: 'ABC Properties LLC', type: 'Real Estate Holding', dscr: 1.82 },
  ],
  guarantors: [
    { name: 'John Smith', ownership: '60%', netWorth: '$1,250,000' },
    { name: 'Jane Smith', ownership: '40%', netWorth: '$890,000' },
  ],
  globalDSCR: 1.52,
  recommendation: 'Approve',
};

function PDFPreview({ onClose }: { onClose: () => void }) {
  const [zoom, setZoom] = useState(80);
  const [page, setPage] = useState(1);
  const totalPages = 3;

  return (
    <div className="flex flex-col h-full bg-gray-800">
      {/* PDF Viewer Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-900 text-white shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Credit Memo - {mockMemoData.borrower}.pdf</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-white hover:bg-gray-700" onClick={() => setZoom(Math.max(50, zoom - 10))}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm w-16 text-center">{zoom}%</span>
          <Button variant="ghost" size="sm" className="text-white hover:bg-gray-700" onClick={() => setZoom(Math.min(150, zoom + 10))}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Separator orientation="vertical" className="h-6 bg-gray-600" />
          <Button variant="ghost" size="sm" className="text-white hover:bg-gray-700" disabled={page === 1} onClick={() => setPage(page - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">Page {page} of {totalPages}</span>
          <Button variant="ghost" size="sm" className="text-white hover:bg-gray-700" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Separator orientation="vertical" className="h-6 bg-gray-600" />
          <Button variant="ghost" size="sm" className="text-white hover:bg-gray-700">
            <Printer className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-white hover:bg-gray-700">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-white hover:bg-gray-700" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* PDF Document Preview */}
      <div className="flex-1 overflow-auto p-4 flex justify-center">
        <div
          className="bg-white shadow-2xl relative"
          style={{
            width: `${816 * zoom / 100}px`,
            height: `${1056 * zoom / 100}px`,
          }}
        >
          {/* Page 1 - Cover / Summary */}
          {page === 1 && (
            <div className="p-8 text-black h-full flex flex-col" style={{ fontFamily: 'Times New Roman, serif', fontSize: `${zoom > 80 ? 14 : 12}px` }}>
              {/* Bank Header */}
              <div className="text-center border-b-2 border-gray-800 pb-4 mb-6">
                <h1 className="text-xl font-bold tracking-wide">{mockMemoData.bankName}</h1>
                <p className="text-xs mt-1 text-gray-600">CREDIT MEMORANDUM</p>
              </div>

              {/* Loan Summary Box */}
              <div className="border border-gray-400 mb-4">
                <div className="bg-gray-100 px-3 py-1 border-b border-gray-400">
                  <h2 className="font-bold text-xs">LOAN REQUEST SUMMARY</h2>
                </div>
                <div className="p-3 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-gray-600">Borrower:</p>
                    <p className="font-semibold">{mockMemoData.borrower}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Request Date:</p>
                    <p className="font-semibold">{mockMemoData.requestDate}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Loan Amount:</p>
                    <p className="font-semibold">{mockMemoData.loanAmount}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Purpose:</p>
                    <p className="font-semibold">{mockMemoData.loanPurpose}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Prepared By:</p>
                    <p className="font-semibold">{mockMemoData.analyst}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Recommendation:</p>
                    <p className="font-semibold text-green-700">{mockMemoData.recommendation}</p>
                  </div>
                </div>
              </div>

              {/* Executive Summary */}
              <div className="mb-4 flex-1">
                <h2 className="font-bold text-xs border-b border-gray-400 pb-1 mb-2">EXECUTIVE SUMMARY</h2>
                <p className="text-xs leading-relaxed text-justify">
                  This credit request is for {mockMemoData.loanAmount} to support working capital needs and equipment
                  acquisition for {mockMemoData.borrower}. The borrowing group consists of two related entities with
                  combined revenues exceeding $8.5 million annually. The request is supported by two personal guarantors
                  with combined net worth of over $2.1 million.
                </p>
                <p className="text-xs leading-relaxed text-justify mt-2">
                  Based on our analysis, the global debt service coverage ratio of <strong>{mockMemoData.globalDSCR}x</strong> exceeds
                  the bank's policy minimum of 1.25x, demonstrating adequate capacity to service the proposed debt obligation.
                </p>
              </div>

              {/* Key Metrics */}
              <div className="mb-4">
                <h2 className="font-bold text-xs border-b border-gray-400 pb-1 mb-2">KEY CREDIT METRICS</h2>
                <table className="w-full text-xs border border-gray-400">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-400 px-2 py-1 text-left">Metric</th>
                      <th className="border border-gray-400 px-2 py-1 text-center">Actual</th>
                      <th className="border border-gray-400 px-2 py-1 text-center">Policy</th>
                      <th className="border border-gray-400 px-2 py-1 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-400 px-2 py-1">Global DSCR</td>
                      <td className="border border-gray-400 px-2 py-1 text-center font-semibold">{mockMemoData.globalDSCR}x</td>
                      <td className="border border-gray-400 px-2 py-1 text-center">≥ 1.25x</td>
                      <td className="border border-gray-400 px-2 py-1 text-center text-green-700">Pass</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-400 px-2 py-1">Current Ratio</td>
                      <td className="border border-gray-400 px-2 py-1 text-center font-semibold">1.85x</td>
                      <td className="border border-gray-400 px-2 py-1 text-center">≥ 1.20x</td>
                      <td className="border border-gray-400 px-2 py-1 text-center text-green-700">Pass</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-400 px-2 py-1">Debt-to-Worth</td>
                      <td className="border border-gray-400 px-2 py-1 text-center font-semibold">2.1x</td>
                      <td className="border border-gray-400 px-2 py-1 text-center">≤ 3.0x</td>
                      <td className="border border-gray-400 px-2 py-1 text-center text-green-700">Pass</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Page Footer */}
              <div className="mt-auto pt-4 text-xs text-gray-500 flex justify-between border-t">
                <span>CONFIDENTIAL - {mockMemoData.bankName}</span>
                <span>Page 1 of 3</span>
              </div>
            </div>
          )}

          {/* Page 2 - Entity Analysis */}
          {page === 2 && (
            <div className="p-8 text-black h-full flex flex-col" style={{ fontFamily: 'Times New Roman, serif' }}>
              <div className="text-center mb-4">
                <h1 className="text-base font-bold">BORROWING ENTITY ANALYSIS</h1>
                <p className="text-xs text-gray-600">{mockMemoData.borrower}</p>
              </div>

              {/* Entity 1 */}
              <div className="mb-4">
                <h2 className="font-bold text-xs bg-gray-100 px-2 py-1 border border-gray-400">
                  Entity 1: {mockMemoData.entities[0].name}
                </h2>
                <div className="border-x border-b border-gray-400 p-3">
                  <p className="text-xs mb-2"><strong>Entity Type:</strong> {mockMemoData.entities[0].type}</p>
                  <p className="text-xs leading-relaxed text-justify mb-3">
                    ABC Manufacturing LLC is the primary operating entity engaged in precision metal fabrication
                    serving the aerospace and automotive industries. The company has demonstrated consistent revenue
                    growth of 8% annually over the past three fiscal years with stable gross margins of 32%.
                  </p>
                  <table className="w-full text-xs border border-gray-400">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-400 px-2 py-1 text-left">Financial Summary</th>
                        <th className="border border-gray-400 px-2 py-1 text-right">FY 2024</th>
                        <th className="border border-gray-400 px-2 py-1 text-right">FY 2025</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-400 px-2 py-1">Revenue</td>
                        <td className="border border-gray-400 px-2 py-1 text-right">$6,250,000</td>
                        <td className="border border-gray-400 px-2 py-1 text-right">$6,750,000</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-400 px-2 py-1">Net Income</td>
                        <td className="border border-gray-400 px-2 py-1 text-right">$425,000</td>
                        <td className="border border-gray-400 px-2 py-1 text-right">$485,000</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-400 px-2 py-1">Cash Flow Available</td>
                        <td className="border border-gray-400 px-2 py-1 text-right">$680,000</td>
                        <td className="border border-gray-400 px-2 py-1 text-right">$745,000</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-400 px-2 py-1 font-semibold">Entity DSCR</td>
                        <td className="border border-gray-400 px-2 py-1 text-right font-semibold">1.38x</td>
                        <td className="border border-gray-400 px-2 py-1 text-right font-semibold">{mockMemoData.entities[0].dscr}x</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Entity 2 */}
              <div className="mb-4 flex-1">
                <h2 className="font-bold text-xs bg-gray-100 px-2 py-1 border border-gray-400">
                  Entity 2: {mockMemoData.entities[1].name}
                </h2>
                <div className="border-x border-b border-gray-400 p-3">
                  <p className="text-xs mb-2"><strong>Entity Type:</strong> {mockMemoData.entities[1].type}</p>
                  <p className="text-xs leading-relaxed text-justify mb-3">
                    ABC Properties LLC holds the real estate assets utilized by the operating company including
                    a 45,000 sq ft manufacturing facility. The property generates stable rental income from a
                    long-term lease agreement with the operating entity.
                  </p>
                  <table className="w-full text-xs border border-gray-400">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-400 px-2 py-1 text-left">Financial Summary</th>
                        <th className="border border-gray-400 px-2 py-1 text-right">FY 2024</th>
                        <th className="border border-gray-400 px-2 py-1 text-right">FY 2025</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-400 px-2 py-1">Rental Income</td>
                        <td className="border border-gray-400 px-2 py-1 text-right">$420,000</td>
                        <td className="border border-gray-400 px-2 py-1 text-right">$420,000</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-400 px-2 py-1">NOI</td>
                        <td className="border border-gray-400 px-2 py-1 text-right">$365,000</td>
                        <td className="border border-gray-400 px-2 py-1 text-right">$372,000</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-400 px-2 py-1 font-semibold">Entity DSCR</td>
                        <td className="border border-gray-400 px-2 py-1 text-right font-semibold">1.78x</td>
                        <td className="border border-gray-400 px-2 py-1 text-right font-semibold">{mockMemoData.entities[1].dscr}x</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Page Footer */}
              <div className="mt-auto pt-4 text-xs text-gray-500 flex justify-between border-t">
                <span>CONFIDENTIAL - {mockMemoData.bankName}</span>
                <span>Page 2 of 3</span>
              </div>
            </div>
          )}

          {/* Page 3 - Global DSCR & Recommendation */}
          {page === 3 && (
            <div className="p-8 text-black h-full flex flex-col" style={{ fontFamily: 'Times New Roman, serif' }}>
              <div className="text-center mb-4">
                <h1 className="text-base font-bold">GLOBAL CASH FLOW ANALYSIS</h1>
                <p className="text-xs text-gray-600">{mockMemoData.borrower}</p>
              </div>

              {/* Global DSCR Calculation */}
              <div className="mb-4">
                <h2 className="font-bold text-xs border-b border-gray-400 pb-1 mb-2">GLOBAL DSCR CALCULATION</h2>
                <table className="w-full text-xs border border-gray-400">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-400 px-2 py-1 text-left">Source</th>
                      <th className="border border-gray-400 px-2 py-1 text-right">Cash Flow</th>
                      <th className="border border-gray-400 px-2 py-1 text-right">Debt Service</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-400 px-2 py-1">ABC Manufacturing LLC</td>
                      <td className="border border-gray-400 px-2 py-1 text-right">$745,000</td>
                      <td className="border border-gray-400 px-2 py-1 text-right">$514,000</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-400 px-2 py-1">ABC Properties LLC</td>
                      <td className="border border-gray-400 px-2 py-1 text-right">$372,000</td>
                      <td className="border border-gray-400 px-2 py-1 text-right">$205,000</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-400 px-2 py-1">Guarantor - John Smith (60%)</td>
                      <td className="border border-gray-400 px-2 py-1 text-right">$125,000</td>
                      <td className="border border-gray-400 px-2 py-1 text-right">$48,000</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-400 px-2 py-1">Guarantor - Jane Smith (40%)</td>
                      <td className="border border-gray-400 px-2 py-1 text-right">$95,000</td>
                      <td className="border border-gray-400 px-2 py-1 text-right">$32,000</td>
                    </tr>
                    <tr className="bg-gray-100 font-semibold">
                      <td className="border border-gray-400 px-2 py-1">TOTAL</td>
                      <td className="border border-gray-400 px-2 py-1 text-right">$1,337,000</td>
                      <td className="border border-gray-400 px-2 py-1 text-right">$799,000</td>
                    </tr>
                  </tbody>
                </table>

                <div className="mt-3 p-3 bg-gray-50 border border-gray-400 text-center">
                  <p className="text-xs text-gray-600">Global Debt Service Coverage Ratio</p>
                  <p className="text-2xl font-bold mt-1">{mockMemoData.globalDSCR}x</p>
                  <p className="text-xs text-green-700 mt-1">Exceeds Policy Minimum of 1.25x</p>
                </div>
              </div>

              {/* Guarantor Summary */}
              <div className="mb-4">
                <h2 className="font-bold text-xs border-b border-gray-400 pb-1 mb-2">GUARANTOR SUMMARY</h2>
                <table className="w-full text-xs border border-gray-400">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-400 px-2 py-1 text-left">Guarantor</th>
                      <th className="border border-gray-400 px-2 py-1 text-center">Ownership</th>
                      <th className="border border-gray-400 px-2 py-1 text-right">Net Worth</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockMemoData.guarantors.map((g, i) => (
                      <tr key={i}>
                        <td className="border border-gray-400 px-2 py-1">{g.name}</td>
                        <td className="border border-gray-400 px-2 py-1 text-center">{g.ownership}</td>
                        <td className="border border-gray-400 px-2 py-1 text-right">{g.netWorth}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Recommendation */}
              <div className="mb-4 flex-1">
                <h2 className="font-bold text-xs border-b border-gray-400 pb-1 mb-2">RECOMMENDATION</h2>
                <p className="text-xs leading-relaxed text-justify">
                  Based on the analysis performed, we recommend <strong>APPROVAL</strong> of the credit request
                  for {mockMemoData.loanAmount}. The borrowing group demonstrates adequate cash flow coverage
                  with a global DSCR of {mockMemoData.globalDSCR}x, exceeding the bank's policy minimum. The
                  guarantors provide additional support with combined net worth coverage of approximately 0.86x
                  the loan amount.
                </p>
              </div>

              {/* Signature Lines */}
              <div className="grid grid-cols-2 gap-6 mb-4">
                <div>
                  <div className="border-t border-gray-800 pt-2">
                    <p className="text-xs">Prepared By: {mockMemoData.analyst}</p>
                    <p className="text-xs text-gray-600">Credit Analyst</p>
                  </div>
                </div>
                <div>
                  <div className="border-t border-gray-800 pt-2">
                    <p className="text-xs">Approved By: _______________</p>
                    <p className="text-xs text-gray-600">Senior Credit Officer</p>
                  </div>
                </div>
              </div>

              {/* Page Footer */}
              <div className="mt-auto pt-4 text-xs text-gray-500 flex justify-between border-t">
                <span>CONFIDENTIAL - {mockMemoData.bankName}</span>
                <span>Page 3 of 3</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function OutputPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [outputs, setOutputs] = useState<OutputFile[]>([
    {
      id: 'dscr-workbook',
      name: 'DSCR Workbook.xlsx',
      type: 'excel',
      description: 'Entity and Global DSCR calculations with supporting schedules',
      status: 'pending',
      selected: true,
    },
    {
      id: 'global-cashflow',
      name: 'Global Cash Flow Package.xlsx',
      type: 'excel',
      description: 'Consolidated cash flow analysis across all entities and guarantors',
      status: 'pending',
      selected: true,
    },
    {
      id: 'credit-memo',
      name: 'Credit Memo.pdf',
      type: 'pdf',
      description: 'Complete credit memo with all narrative sections',
      status: 'pending',
      selected: true,
    },
    {
      id: 'audit-trail',
      name: 'Audit Trail Report.pdf',
      type: 'pdf',
      description: 'Complete audit log of all actions, adjustments, and overrides',
      status: 'pending',
      selected: true,
    },
  ]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<string | null>(null);

  const toggleOutput = (id: string) => {
    setOutputs((prev) =>
      prev.map((o) => (o.id === id ? { ...o, selected: !o.selected } : o))
    );
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setProgress(0);

    const selectedOutputs = outputs.filter((o) => o.selected);
    let completed = 0;

    selectedOutputs.forEach((output, index) => {
      setTimeout(() => {
        setOutputs((prev) =>
          prev.map((o) => (o.id === output.id ? { ...o, status: 'generating' } : o))
        );

        setTimeout(() => {
          setOutputs((prev) =>
            prev.map((o) => (o.id === output.id ? { ...o, status: 'complete' } : o))
          );
          completed++;
          setProgress((completed / selectedOutputs.length) * 100);

          if (completed === selectedOutputs.length) {
            setIsGenerating(false);
          }
        }, 1500);
      }, index * 2000);
    });
  };

  const handlePreview = (fileId: string) => {
    setPreviewFile(fileId);
    setPreviewOpen(true);
  };

  const allComplete = outputs.filter((o) => o.selected).every((o) => o.status === 'complete');
  const selectedCount = outputs.filter((o) => o.selected).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'excel':
        return <FileSpreadsheet className="h-8 w-8 text-green-600" />;
      case 'word':
        return <FileText className="h-8 w-8 text-blue-600" />;
      case 'pdf':
        return <FileText className="h-8 w-8 text-red-600" />;
      default:
        return <FileText className="h-8 w-8" />;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div>
          <h1 className="text-lg font-semibold">Output Generation</h1>
          <p className="text-sm text-muted-foreground">
            Generate and download your credit analysis package
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/dashboard/analysis/${id}/audit`}>
            <Button variant="outline">View Audit Trail</Button>
          </Link>
          {allComplete && (
            <Button>
              <Package className="mr-2 h-4 w-4" />
              Download All (ZIP)
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-3xl space-y-6">
          {/* Output Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Outputs</CardTitle>
              <CardDescription>Choose which documents to generate</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {outputs.map((output) => (
                <div
                  key={output.id}
                  className={`flex items-center gap-4 rounded-lg border p-4 transition-colors ${
                    output.selected ? 'border-primary bg-primary/5' : ''
                  }`}
                >
                  <Checkbox
                    id={output.id}
                    checked={output.selected}
                    onCheckedChange={() => toggleOutput(output.id)}
                    disabled={isGenerating}
                  />
                  {getIcon(output.type)}
                  <div className="flex-1">
                    <Label
                      htmlFor={output.id}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {output.name}
                    </Label>
                    <p className="text-sm text-muted-foreground">{output.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {output.status === 'complete' && (
                      <>
                        <Badge className="bg-green-600">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Ready
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePreview(output.id)}
                          title="Preview"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Download">
                          <Download className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    {output.status === 'generating' && (
                      <Badge variant="secondary">
                        <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                        Generating...
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Generate Button / Progress */}
          <Card>
            <CardContent className="pt-6">
              {isGenerating ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span>Generating outputs...</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} />
                </div>
              ) : allComplete ? (
                <div className="flex flex-col items-center py-6 text-center">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                  <h3 className="mt-4 text-lg font-semibold">All Outputs Ready</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Your credit analysis package has been generated successfully.
                  </p>
                  <div className="flex gap-3 mt-4">
                    <Button variant="outline" onClick={() => handlePreview('credit-memo')}>
                      <Eye className="mr-2 h-4 w-4" />
                      Preview Credit Memo
                    </Button>
                    <Button>
                      <Package className="mr-2 h-4 w-4" />
                      Download All (ZIP)
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center py-6 text-center">
                  <h3 className="text-lg font-semibold">Ready to Generate</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {selectedCount} output{selectedCount !== 1 ? 's' : ''} selected
                  </p>
                  <Button
                    className="mt-4"
                    size="lg"
                    onClick={handleGenerate}
                    disabled={selectedCount === 0}
                  >
                    Generate Outputs
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* PDF Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-[95vw] w-[95vw] h-[95vh] max-h-[95vh] p-0" aria-describedby={undefined}>
          <VisuallyHidden.Root>
            <DialogTitle>Credit Memo Preview</DialogTitle>
          </VisuallyHidden.Root>
          <PDFPreview onClose={() => setPreviewOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
