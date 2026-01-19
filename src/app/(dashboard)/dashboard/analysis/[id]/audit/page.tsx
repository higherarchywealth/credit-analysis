'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeft,
  Upload,
  FileCheck,
  Settings,
  Calculator,
  FileText,
  Download,
  Search,
  Filter,
} from 'lucide-react';
import { mockAuditLog } from '@/data';
import { AuditAction } from '@/types';

const actionConfig: Record<
  AuditAction,
  { icon: React.ElementType; color: string; label: string }
> = {
  'file-uploaded': { icon: Upload, color: 'text-blue-600', label: 'File Uploaded' },
  'data-normalized': { icon: FileCheck, color: 'text-green-600', label: 'Data Normalized' },
  'adjustment-applied': { icon: Settings, color: 'text-yellow-600', label: 'Adjustment Applied' },
  'adjustment-overridden': {
    icon: Settings,
    color: 'text-orange-600',
    label: 'Adjustment Overridden',
  },
  'relationship-updated': { icon: Settings, color: 'text-purple-600', label: 'Relationship Updated' },
  'dscr-calculated': { icon: Calculator, color: 'text-green-600', label: 'DSCR Calculated' },
  'memo-generated': { icon: FileText, color: 'text-blue-600', label: 'Memo Generated' },
  'memo-edited': { icon: FileText, color: 'text-indigo-600', label: 'Memo Edited' },
  'output-generated': { icon: Download, color: 'text-green-600', label: 'Output Generated' },
};

export default function AuditPage({ params }: { params: { id: string } }) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/analysis/${params.id}/output`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-lg font-semibold">Audit Trail</h1>
            <p className="text-sm text-muted-foreground">
              Complete history of all actions and changes
            </p>
          </div>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Log
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search audit log..." className="pl-9" />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-48">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Filter by action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    <SelectItem value="file-uploaded">File Uploads</SelectItem>
                    <SelectItem value="adjustment">Adjustments</SelectItem>
                    <SelectItem value="calculation">Calculations</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all">
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by user" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="sarah">Sarah Johnson</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
              <CardDescription>{mockAuditLog.length} entries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-6 top-0 h-full w-0.5 bg-border" />

                {/* Timeline entries */}
                <div className="space-y-6">
                  {mockAuditLog.map((entry, index) => {
                    const config = actionConfig[entry.action];
                    const Icon = config.icon;

                    return (
                      <div key={entry.id} className="relative flex gap-4">
                        {/* Icon */}
                        <div
                          className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full border bg-background ${config.color}`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 pt-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{config.label}</Badge>
                              <span className="text-sm text-muted-foreground">
                                by {entry.user}
                              </span>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {formatDate(entry.timestamp)}
                            </span>
                          </div>
                          <p className="mt-1 text-sm">{entry.description}</p>

                          {/* Details */}
                          {entry.details && (
                            <div className="mt-2 rounded bg-muted p-2 text-xs font-mono">
                              {Object.entries(entry.details).map(([key, value]) => (
                                <div key={key}>
                                  <span className="text-muted-foreground">{key}: </span>
                                  <span>{String(value)}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}